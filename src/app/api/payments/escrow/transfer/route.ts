import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/server/auth";
import { db } from "@/server/db";
import { transferEscrowFunds } from "@/utils/razorpay";

/**
 * POST /api/payments/escrow/transfer
 * Releases escrowed funds to the creator's Razorpay Linked Account.
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { transactionId } = body;

    if (!transactionId) {
      return NextResponse.json({ error: "Missing transactionId" }, { status: 400 });
    }

    // Find the escrow transaction
    const transaction = await db.escrowTransaction.findUnique({
      where: { id: transactionId },
      include: {
        application: {
          include: {
            creator: true,
            campaign: {
              include: {
                sponsor: true,
              },
            },
          },
        },
      },
    });

    if (!transaction) {
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
    }

    // Verify authorized user: must be the sponsor who owns the campaign, or an admin
    const sponsorUserId = transaction.application.campaign.sponsor.userId;
    const currentUserId = (session.user as any).id;
    const currentUserRole = (session.user as any).role;

    if (currentUserId !== sponsorUserId && currentUserRole !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized to release these funds" }, { status: 403 });
    }

    // Verify creator has onboarded payouts
    const creatorRouteId = transaction.application.creator.razorpayRouteId;
    if (!creatorRouteId) {
      return NextResponse.json(
        { error: "Creator has not set up their Razorpay Route payouts account yet" },
        { status: 400 }
      );
    }

    // Verify status is eligible for release
    if (transaction.escrowStatus === "RELEASED") {
      return NextResponse.json({ error: "Funds have already been released" }, { status: 400 });
    }

    if (transaction.escrowStatus === "REFUNDED") {
      return NextResponse.json({ error: "Funds have been refunded to the sponsor" }, { status: 400 });
    }

    if (!transaction.razorpayPaymentId) {
      return NextResponse.json({ error: "Cannot release funds: no verified deposit payment ID" }, { status: 400 });
    }

    // Call Razorpay API to execute Route transfer
    const transfer = await transferEscrowFunds(
      transaction.razorpayPaymentId,
      creatorRouteId,
      transaction.amount
    );

    const transferId = transfer.transfers?.[0]?.id || `trn_${Date.now()}`;

    // Update transaction status in database
    await db.escrowTransaction.update({
      where: { id: transaction.id },
      data: {
        escrowStatus: "RELEASED",
        razorpayTransferId: transferId,
        releasedAt: new Date(),
      },
    });

    return NextResponse.json({
      message: "Escrow funds released successfully to the creator",
      transferId,
    });
  } catch (error: any) {
    console.error("Error releasing escrow funds:", error);
    return NextResponse.json({ error: error.message || "Failed to release funds" }, { status: 500 });
  }
}
