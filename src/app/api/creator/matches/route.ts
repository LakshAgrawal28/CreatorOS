import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/server/auth";
import { db } from "@/server/db";

interface EmbeddingRow {
  embedding: string | null;
}

interface CampaignMatchRow {
  id: string;
  title: string;
  description: string;
  industry: string;
  budget: number;
  brandName: string;
  score: number | null;
}

interface AuthUser {
  id: string;
  role: string;
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    let user = session?.user as AuthUser | undefined;

    if (!user) {
      const demoRole = req.cookies.get("demo_role")?.value;
      const demoName = req.cookies.get("demo_name")?.value;
      if (demoRole && demoName) {
        const email = `${decodeURIComponent(demoName).toLowerCase().replace(/[^a-z0-9_]/g, "")}@creatoros.com`;
        const dbUser = await db.user.findUnique({ where: { email } });
        if (dbUser) {
          user = { id: dbUser.id, role: dbUser.role };
        }
      }
    }

    if (!user || user.role !== "CREATOR") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const creatorProfile = await db.creatorProfile.findUnique({
      where: { userId: user.id },
    });

    if (!creatorProfile) {
      return NextResponse.json({ matches: [] });
    }

    // Fetch the raw creator embedding using raw SQL
    const creatorData = await db.$queryRawUnsafe<EmbeddingRow[]>(
      `SELECT "profileEmbedding"::text as embedding FROM "CreatorProfile" WHERE id = $1`,
      creatorProfile.id
    );

    if (!creatorData || creatorData.length === 0 || !creatorData[0].embedding) {
      return NextResponse.json({ matches: [] });
    }

    const embeddingStr = creatorData[0].embedding;

    // Fetch campaigns that match, ordering by vector similarity score
    const matches = await db.$queryRawUnsafe<CampaignMatchRow[]>(
      `SELECT
        c.id,
        c.title,
        c.description,
        c.industry,
        c.budget,
        s."companyName" as "brandName",
        (1 - (c."campaignEmbedding" <=> cast($1 as vector))) as score
      FROM "Campaign" c
      JOIN "SponsorProfile" s ON s.id = c."sponsorId"
      ORDER BY score DESC
      LIMIT 10`,
      embeddingStr
    );

    const formattedMatches = matches.map(m => ({
      id: m.id,
      brandName: m.brandName,
      title: m.title,
      industry: m.industry,
      budget: `₹${(m.budget * 85).toLocaleString()}`,
      score: Math.round((m.score || 0.0) * 100),
      img: m.brandName.toLowerCase().includes("boat")
        ? "https://lh3.googleusercontent.com/aida-public/AB6AXuAMf3D7T8dWNOagRHiwapsOQvOTuAs9wSAaIOJp1chO_nzvRfsTX2i-3cho7ZiA2BPUZ7xAgLJdlQOfQo71iXfPNzXFy6N_O5kUwkmt_TQA42tQKjwW4Md81UROgWhkOW7Pu01AmXCvk0yYTb2AadyC6rep4BqK6lQiP7YG7o1egLhRahx7ov7gCa9mQv_ybAqknyRl7wPK0LeRe0_4sp0gNz9gav__QybYzp7WlAYXZrkKUSN3J95C9tqCjR_IAfjCbG2xvWJXSfc"
        : m.brandName.toLowerCase().includes("noise")
        ? "https://lh3.googleusercontent.com/aida-public/AB6AXuC2cec2vdS52vNiougobe1HC6PwBzH7QhOocPiADY9A966KKA_9mQou0RvDytdz1kzuJvXDlsgRak5tHZblEwpQa1ZFBxCYTJFAU27s2zJdNkG3e-QIIKqEUKc2ExunfE-gya_Oak9-q7qwo89M_3kEOFejppiFKb6sdSrhL-Sf7thbolKY7Tmdc4IEv7fT3Orgkcx8oFeJ32kXokMlIPksjm57MrpCiOlBu1qo7UImT8RbsQ1VwmiFfJsN3cVqCW-bI_bhGlhYnA4"
        : "https://lh3.googleusercontent.com/aida-public/AB6AXuC0rQAxBdEVvNjxAl-tTnjFlVgP9X_26pGbim4B7sX6e9iUglHNch-mv2Ck0yS2rDxcI3SJLr4kA3l0ytGOyayXpyyhyMsIvvMaRWLFLVLIOmON1lV54x0eF5bp302SzSCf_iS7wXpWaOm3k02HeEtNsJDflCpy2Ow_bzz9mNGe8k00SyUcZaOymkJlI7YrUPLeWyCpBeyVmM8YjtOQ2H4mq7EaAeq8flUI2b8-rwBrSfR8Cp3DyhkN738Fmt60vJs1M1nrolrR70k",
      logo: m.brandName.charAt(0).toUpperCase()
    }));

    return NextResponse.json({ matches: formattedMatches });
  } catch (error: unknown) {
    console.error("Error matching campaigns to creator:", error);
    const message = error instanceof Error ? error.message : "Failed to fetch matches";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
