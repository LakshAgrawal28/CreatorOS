import { inngest } from "./client";
import { db } from "@/server/db";
import { getInstagramProfile } from "@/server/meta";

/**
 * Daily cron function that fetches real-time Instagram metrics, follower growth,
 * average likes, mock views, engagement rates, and demographics, updating the DB.
 */
export const syncInstagramMetrics = inngest.createFunction(
  {
    id: "sync-instagram-metrics",
    name: "Sync Instagram Metrics",
    triggers: [{ cron: "0 0 * * *" }],
  },
  async ({ step }) => {
    // 1. Fetch all profiles with valid Meta OAuth long-lived access tokens
    const profiles = await step.run("fetch-active-profiles", async () => {
      return await db.creatorProfile.findMany({
        where: {
          metaAccessToken: { not: null },
        },
        select: {
          id: true,
          instagramHandle: true,
          metaAccessToken: true,
        },
      });
    });

    const results = [];

    // 2. Iterate and sync each profile independently inside step isolation
    for (const profile of profiles) {
      const result = await step.run(`sync-profile-${profile.instagramHandle}`, async () => {
        try {
          const token = profile.metaAccessToken!;
          let instagramAccountId = "";

          // Resolve the Instagram Business Account ID from Meta Page links
          const pagesUrl = `https://graph.facebook.com/v20.0/me/accounts?access_token=${token}`;
          const pagesRes = await fetch(pagesUrl);
          if (!pagesRes.ok) {
            throw new Error(`Failed to fetch Facebook Pages: ${pagesRes.statusText}`);
          }
          
          const pagesData = await pagesRes.json();
          const pages = pagesData.data || [];

          for (const page of pages) {
            const pageDetailUrl = `https://graph.facebook.com/v20.0/${page.id}?fields=instagram_business_account&access_token=${token}`;
            const pageDetailRes = await fetch(pageDetailUrl);
            if (pageDetailRes.ok) {
              const pageDetail = await pageDetailRes.json();
              if (pageDetail.instagram_business_account?.id) {
                instagramAccountId = pageDetail.instagram_business_account.id;
                break;
              }
            }
          }

          if (!instagramAccountId) {
            return {
              profileId: profile.id,
              instagramHandle: profile.instagramHandle,
              status: "failed",
              reason: "no_linked_instagram_business_account",
            };
          }

          // Fetch basic profile stats (follower count, media count, biography)
          const profileData = await getInstagramProfile(instagramAccountId, token);

          // Fetch last 15 media items to calculate historical engagement rates
          const mediaUrl = `https://graph.facebook.com/v20.0/${instagramAccountId}/media?fields=like_count,comments_count,media_type,timestamp&limit=15&access_token=${token}`;
          const mediaRes = await fetch(mediaUrl);
          let engagementRate = 0.0;
          let totalLikes = 0;
          let totalComments = 0;
          let postCount = 0;

          if (mediaRes.ok) {
            const mediaData = await mediaRes.json();
            const posts = mediaData.data || [];
            postCount = posts.length;

            if (postCount > 0) {
              for (const post of posts) {
                totalLikes += post.like_count || 0;
                totalComments += post.comments_count || 0;
              }
              const averageEngagementPerPost = (totalLikes + totalComments) / postCount;
              engagementRate = profileData.followers_count > 0
                ? parseFloat((averageEngagementPerPost / profileData.followers_count).toFixed(4))
                : 0.0;
            }
          }

          // Fetch audience gender, age, and country metrics
          const insightsUrl = `https://graph.facebook.com/v20.0/${instagramAccountId}/insights?metric=audience_gender_age,audience_country&period=lifetime&access_token=${token}`;
          const insightsRes = await fetch(insightsUrl);
          let demographics = null;
          if (insightsRes.ok) {
            const insightsData = await insightsRes.json();
            demographics = insightsData.data || null;
          }

          // Update the database CreatorProfile record with fresh analytics data
          await db.creatorProfile.update({
            where: { id: profile.id },
            data: {
              followerCount: profileData.followers_count,
              averageLikes: postCount > 0 ? Math.round(totalLikes / postCount) : 0,
              averageViews: postCount > 0 ? Math.round((totalLikes * 4) / postCount) : 0, // Ingesting views based on likes multiplier for mock scaling
              engagementRate: engagementRate,
              audienceDemo: demographics ? JSON.stringify(demographics) : undefined,
            },
          });

          return {
            profileId: profile.id,
            instagramHandle: profile.instagramHandle,
            status: "success",
            followers: profileData.followers_count,
            engagementRate: engagementRate,
          };
        } catch (error: any) {
          return {
            profileId: profile.id,
            instagramHandle: profile.instagramHandle,
            status: "failed",
            error: error.message,
          };
        }
      });
      results.push(result);
    }

    return {
      syncedCount: results.length,
      results,
    };
  }
);
