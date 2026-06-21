import { PrismaClient, Role, CampaignStatus } from "@prisma/client";

export async function seedDatabase(db: PrismaClient) {
  try {
    // 1. Check if seeding is already completed
    const existingCreators = await db.creatorProfile.count();
    const existingCampaigns = await db.campaign.count();

    if (existingCreators > 0 && existingCampaigns > 0) {
      console.log("Seeding skipped: Database already contains creators and campaigns.");
      return;
    }

    console.log("Seeding database with default sponsors, campaigns, and creators...");

    // 2. Seed Sponsors and their Campaigns
    const sponsorData = [
      {
        email: "boat@creatoros.com",
        name: "Boat Labs",
        companyName: "Boat Labs",
        industry: "Consumer Audio",
        website: "https://boat-lifestyle.com",
        campaigns: [
          {
            title: "Wireless Over-Ear ANC Headphones Launch",
            description: "Launch campaign for our new premium noise-canceling headphones. We want creators to review the sound isolation and bass boost features in a high-energy video style.",
            industry: "Tech & Gadgets",
            budget: 500,
            creatorCriteria: { minFollowers: 1000, maxFollowers: 10000 },
            deliverables: ["Reel"],
            status: CampaignStatus.ACTIVE
          }
        ]
      },
      {
        email: "noise@creatoros.com",
        name: "Noise Fit",
        companyName: "Noise Fit",
        industry: "Wearables",
        website: "https://gonoise.com",
        campaigns: [
          {
            title: "Summer Activewear Promo",
            description: "Showcase the comfort and durability of our noise activewear collection during workout transitions.",
            industry: "Fitness & Apparel",
            budget: 300,
            creatorCriteria: { minFollowers: 1000, maxFollowers: 10000 },
            deliverables: ["Reel", "Story"],
            status: CampaignStatus.ACTIVE
          }
        ]
      },
      {
        email: "skillshare@creatoros.com",
        name: "Skillshare",
        companyName: "Skillshare",
        industry: "EdTech",
        website: "https://skillshare.com",
        campaigns: [
          {
            title: "Online Learning Summer Promotion",
            description: "Promote online classes for creative side-hustlers and designers. Emphasize learning a new skill in 30 days.",
            industry: "Education",
            budget: 200,
            creatorCriteria: { minFollowers: 1000, maxFollowers: 10000 },
            deliverables: ["Post"],
            status: CampaignStatus.ACTIVE
          }
        ]
      }
    ];

    for (const sponsor of sponsorData) {
      let user = await db.user.findUnique({ where: { email: sponsor.email } });
      if (!user) {
        user = await db.user.create({
          data: {
            email: sponsor.email,
            name: sponsor.name,
            role: Role.SPONSOR,
            sponsorProfile: {
              create: {
                companyName: sponsor.companyName,
                industry: sponsor.industry,
                website: sponsor.website,
              }
            }
          }
        });
      }

      const sponsorProfile = await db.sponsorProfile.findUnique({
        where: { userId: user.id }
      });

      if (sponsorProfile) {
        for (const camp of sponsor.campaigns) {
          const existingCamp = await db.campaign.findFirst({
            where: { sponsorId: sponsorProfile.id, title: camp.title }
          });
          if (!existingCamp) {
            await db.campaign.create({
              data: {
                sponsorId: sponsorProfile.id,
                title: camp.title,
                description: camp.description,
                industry: camp.industry,
                budget: camp.budget,
                creatorCriteria: camp.creatorCriteria,
                deliverables: camp.deliverables,
                status: camp.status
              }
            });
          }
        }
      }
    }

    // 3. Seed Creators
    const creatorData = [
      {
        email: "rahul@creatoros.com",
        name: "Rahul Sharma",
        instagramHandle: "tech_review_guy",
        bio: "Reviewing the latest tech gadgets and mobile gear. Daily tech reels and stories.",
        niche: "Tech & Gadgets",
        followerCount: 4890,
        engagementRate: 0.089,
        averageViews: 1740,
        averageLikes: 435,
      },
      {
        email: "amit@creatoros.com",
        name: "Amit Patel",
        instagramHandle: "gadget_hacks",
        bio: "Smart home reviews and daily life productivity hacks. Making tech accessible.",
        niche: "Tech & Gadgets",
        followerCount: 3120,
        engagementRate: 0.076,
        averageViews: 950,
        averageLikes: 237,
      },
      {
        email: "pooja@creatoros.com",
        name: "Pooja Roy",
        instagramHandle: "healthy_eats_in",
        bio: "Registered nutritionist sharing quick, healthy vegan recipes and tea reviews.",
        niche: "Health & Food",
        followerCount: 4210,
        engagementRate: 0.092,
        averageViews: 1540,
        averageLikes: 387,
      },
      {
        email: "priya@creatoros.com",
        name: "Priya Das",
        instagramHandle: "priya_fitlife",
        bio: "Fitness trainer sharing daily workouts, gym clothing reviews, and meal prep tips.",
        niche: "Fitness & Apparel",
        followerCount: 3200,
        engagementRate: 0.084,
        averageViews: 1070,
        averageLikes: 268,
      }
    ];

    for (const creator of creatorData) {
      const user = await db.user.findUnique({ where: { email: creator.email } });
      if (!user) {
        await db.user.create({
          data: {
            email: creator.email,
            name: creator.name,
            role: Role.CREATOR,
            creatorProfile: {
              create: {
                instagramHandle: creator.instagramHandle,
                bio: creator.bio,
                niche: creator.niche,
                followerCount: creator.followerCount,
                engagementRate: creator.engagementRate,
                averageViews: creator.averageViews,
                averageLikes: creator.averageLikes,
                audienceDemo: {
                  countries: { IN: 0.70, US: 0.15, UK: 0.05, Other: 0.10 },
                  gender: { male: 0.52, female: 0.48 },
                  age: { "18-24": 0.40, "25-34": 0.40, "35-44": 0.15, "Other": 0.05 }
                }
              }
            }
          }
        });
      }
    }

    console.log("Seeding completed successfully!");
  } catch (error) {
    console.error("Seeding failed:", error);
  }
}
