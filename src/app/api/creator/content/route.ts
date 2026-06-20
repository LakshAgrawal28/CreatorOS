import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/server/auth";
import { db } from "@/server/db";

/**
 * GET /api/creator/content
 * Returns all ContentItems created by the authenticated creator.
 */
export async function GET(req: NextRequest) {
  try {
    let session: any = await getServerSession(authOptions);

    if (!session || !session.user) {
      const demoRole = req.cookies.get("demo_role")?.value;
      if (demoRole) {
        session = { user: { id: "guest-user-id", role: demoRole } };
      } else {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    const userId = (session.user as any).id;

    // Retrieve creator profile
    const profile = await db.creatorProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      // Guest or new users without a profile: return empty list, not an error
      return NextResponse.json({ items: [] });
    }

    // Retrieve items from DB
    const items = await db.contentItem.findMany({
      where: { creatorProfileId: profile.id },
      orderBy: { scheduledAt: "asc" },
    });

    return NextResponse.json({ items });
  } catch (error: any) {
    console.error("Error fetching content items:", error);
    return NextResponse.json({ error: error.message || "Failed to fetch content" }, { status: 500 });
  }
}

/**
 * POST /api/creator/content
 * Creates a new ContentItem for the authenticated creator.
 */
export async function POST(req: NextRequest) {
  try {
    let session: any = await getServerSession(authOptions);

    if (!session || !session.user) {
      const demoRole = req.cookies.get("demo_role")?.value;
      if (demoRole) {
        session = { user: { id: "guest-user-id", role: demoRole } };
      } else {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    const userId = (session.user as any).id;
    const body = await req.json();
    const { title, platform, format, status, scheduledAt, mediaUrl } = body;

    if (!title || !platform || !format) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Retrieve creator profile
    const profile = await db.creatorProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      return NextResponse.json(
        { error: "Creator profile not found. Please complete your profile setup first." },
        { status: 403 }
      );
    }

    // Create record in DB
    const item = await db.contentItem.create({
      data: {
        creatorProfileId: profile.id,
        title,
        platform,
        format,
        status: status || "Idea",
        scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
        mediaUrl: mediaUrl || null,
      },
    });

    return NextResponse.json({ item });
  } catch (error: any) {
    console.error("Error creating content item:", error);
    return NextResponse.json({ error: error.message || "Failed to create content" }, { status: 500 });
  }
}
