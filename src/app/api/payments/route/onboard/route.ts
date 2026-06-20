import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/server/auth";
import { db } from "@/server/db";
import { createLinkedAccount } from "@/utils/razorpay";

/**
 * POST /api/payments/route/onboard
 * Registers the logged-in creator as a Razorpay Route Linked Account.
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const body = await req.json();
    const { phone, street, city, state, postalCode } = body;

    if (!phone || !street || !city || !state || !postalCode) {
      return NextResponse.json({ error: "Missing required onboarding parameters" }, { status: 400 });
    }

    // Retrieve the creator profile
    const profile = await db.creatorProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      return NextResponse.json({ error: "Creator profile not found. Please link Instagram first." }, { status: 404 });
    }

    if (profile.razorpayRouteId) {
      return NextResponse.json({
        message: "Account already onboarded",
        razorpayRouteId: profile.razorpayRouteId,
      });
    }

    // Call Razorpay API to create the linked account
    const account = await createLinkedAccount({
      email: session.user.email || "creator@creatoros.com",
      phone,
      name: session.user.name || profile.instagramHandle,
      street,
      city,
      state,
      postalCode,
    });

    if (!account || !account.id) {
      throw new Error("Failed to create Razorpay account ID");
    }

    // Update CreatorProfile with the Razorpay account ID
    await db.creatorProfile.update({
      where: { id: profile.id },
      data: {
        razorpayRouteId: account.id,
      },
    });

    return NextResponse.json({
      message: "Razorpay Route onboarding successful",
      razorpayRouteId: account.id,
    });
  } catch (error: any) {
    console.error("Error onboarding Razorpay Route:", error);
    return NextResponse.json({ error: error.message || "Onboarding failed" }, { status: 500 });
  }
}
