import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/server/auth";
import { db } from "@/server/db";

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

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (user.role === "SPONSOR") {
      const sponsorProfile = await db.sponsorProfile.findUnique({
        where: { userId: user.id },
      });

      if (!sponsorProfile) {
        return NextResponse.json({ campaigns: [] });
      }

      const campaigns = await db.campaign.findMany({
        where: { sponsorId: sponsorProfile.id },
        include: { sponsor: true },
        orderBy: { createdAt: "desc" },
      });

      return NextResponse.json({ campaigns });
    } else {
      // If creator or admin, return all active campaigns so they can match
      const campaigns = await db.campaign.findMany({
        include: { sponsor: true },
        orderBy: { createdAt: "desc" },
      });
      return NextResponse.json({ campaigns });
    }
  } catch (error: unknown) {
    console.error("Error fetching campaigns:", error);
    const message = error instanceof Error ? error.message : "Failed to fetch campaigns";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
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

    if (!user || user.role !== "SPONSOR") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const sponsorProfile = await db.sponsorProfile.findUnique({
      where: { userId: user.id },
    });

    if (!sponsorProfile) {
      return NextResponse.json({ error: "Sponsor profile not found" }, { status: 404 });
    }

    const body = await req.json();
    const { title, description, industry, budget, deliverables, creatorCriteria } = body;

    if (!title || !description || !industry || !budget) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const campaign = await db.campaign.create({
      data: {
        sponsorId: sponsorProfile.id,
        title,
        description,
        industry,
        budget: Number(budget),
        deliverables: deliverables || [],
        creatorCriteria: creatorCriteria || {},
      },
    });

    return NextResponse.json({ campaign });
  } catch (error: unknown) {
    console.error("Error creating campaign:", error);
    const message = error instanceof Error ? error.message : "Failed to create campaign";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
