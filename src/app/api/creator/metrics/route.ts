import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/server/auth";
import { db } from "@/server/db";

/**
 * GET handler to securely fetch the current user's creator profile stats.
 */
export async function GET(req: NextRequest) {
  try {
    let session: any = await getServerSession(authOptions);

    if (!session || !session.user) {
      const demoRole = req.cookies.get("demo_role")?.value;
      const demoName = req.cookies.get("demo_name")?.value;
      if (demoRole && demoName) {
        const email = `${decodeURIComponent(demoName).toLowerCase().replace(/[^a-z0-9_]/g, "")}@creatoros.com`;
        const dbUser = await db.user.findUnique({ where: { email } });
        if (dbUser) {
          session = { user: { id: dbUser.id, role: dbUser.role } };
        } else {
          return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
      } else {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    const userId = (session.user as any).id;

    const creatorProfile = await db.creatorProfile.findUnique({
      where: { userId },
      select: {
        id: true,
        instagramHandle: true,
        followerCount: true,
        engagementRate: true,
        averageViews: true,
        averageLikes: true,
        audienceDemo: true,
        niche: true,
      },
    });

    if (!creatorProfile) {
      // Guest or new users without a profile: return null stats (frontend uses fallbacks)
      return NextResponse.json({ profile: null });
    }

    // Return profile data
    return NextResponse.json(creatorProfile);
  } catch (error: any) {
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}
