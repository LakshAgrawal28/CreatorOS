import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server/db";

/**
 * GET /api/sponsors/matches
 * Fetches creators that match a given campaign's criteria and calculates
 * their semantic similarity score using pgvector.
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const campaignId = searchParams.get("campaignId");

    if (!campaignId) {
      return NextResponse.json({ error: "Missing campaignId query parameter" }, { status: 400 });
    }

    // 1. Fetch the campaign to get its industry and budget parameters
    const campaign = await db.campaign.findUnique({
      where: { id: campaignId },
    });

    if (!campaign) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
    }

    // 2. Fetch the raw campaign embedding using raw SQL (Prisma doesn't expose Unsupported fields directly)
    const campaignData: any[] = await db.$queryRawUnsafe(
      `SELECT "campaignEmbedding"::text as embedding FROM "Campaign" WHERE id = $1`,
      campaignId
    );

    if (!campaignData || campaignData.length === 0 || !campaignData[0].embedding) {
      return NextResponse.json(
        { error: "Campaign vector embedding has not been generated yet. Please wait a moment." },
        { status: 404 }
      );
    }

    const embeddingStr = campaignData[0].embedding;

    // 3. Extract follower range criteria from JSON
    let minFollowers = 0;
    let maxFollowers = 10000000;
    if (campaign.creatorCriteria && typeof campaign.creatorCriteria === "object") {
      const criteria = campaign.creatorCriteria as any;
      if (criteria.minFollowers !== undefined && criteria.minFollowers !== null) {
        minFollowers = Number(criteria.minFollowers);
      }
      if (criteria.maxFollowers !== undefined && criteria.maxFollowers !== null) {
        maxFollowers = Number(criteria.maxFollowers);
      }
    }

    // 4. Query creator profiles that match the follower bounds, ordering by vector similarity score
    const matches: any[] = await db.$queryRawUnsafe(
      `SELECT 
        c.id, 
        c."instagramHandle", 
        c.bio, 
        c.niche, 
        c."followerCount", 
        c."engagementRate", 
        c."averageViews", 
        c."averageLikes",
        c."razorpayRouteId",
        u.name as "creatorName",
        m.score
      FROM match_creators_to_campaign(cast($1 as vector), $2, $3) m
      JOIN "CreatorProfile" c ON c.id = m.creator_id
      JOIN "User" u ON u.id = c."userId"
      ORDER BY m.score DESC`,
      embeddingStr,
      minFollowers,
      maxFollowers
    );

    // 5. Cache the matching results in the database Match table
    for (const match of matches) {
      await db.match.upsert({
        where: {
          creatorProfileId_campaignId: {
            creatorProfileId: match.id,
            campaignId: campaignId,
          },
        },
        create: {
          creatorProfileId: match.id,
          campaignId: campaignId,
          matchScore: match.score || 0.0,
        },
        update: {
          matchScore: match.score || 0.0,
        },
      });
    }

    return NextResponse.json({ matches });
  } catch (error: any) {
    console.error("Error matching creators to campaign:", error);
    return NextResponse.json({ error: error.message || "Failed to match creators" }, { status: 500 });
  }
}
