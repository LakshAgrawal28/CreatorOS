import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/server/auth";
import { db } from "@/server/db";
import { createRazorpayOrder } from "@/utils/razorpay";

/**
 * POST /api/payments/escrow/order
 * Creates a Razorpay Order ID for brand campaign deposits.
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { applicationId } = body;

    if (!applicationId) {
      return NextResponse.json({ error: "Missing applicationId" }, { status: 400 });
    }

    // Find the application and its associated campaign/sponsor
    const application = await db.application.findUnique({
      where: { id: applicationId },
      include: {
        campaign: true,
      },
    });

    if (!application) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }

    // Convert USD campaign budget to INR (mock conversion rate of 85 INR/USD)
    const amountInInr = application.campaign.budget * 85;

    // Call Razorpay API to generate an Order ID
    const order = await createRazorpayOrder(amountInInr);

    if (!order || !order.id) {
      throw new Error("Failed to generate Razorpay Order ID");
    }

    // Create the EscrowTransaction record in database
    const transaction = await db.escrowTransaction.upsert({
      where: { applicationId },
      create: {
        applicationId,
        razorpayOrderId: order.id,
        amount: amountInInr,
        escrowStatus: "ESCROW_LOCKED", // Initial status, will be confirmed by payment webhook
      },
      update: {
        razorpayOrderId: order.id,
        amount: amountInInr,
      },
    });

    return NextResponse.json({
      orderId: order.id,
      amount: amountInInr,
      transactionId: transaction.id,
      keyId: process.env.RAZORPAY_KEY_ID || "",
    });
  } catch (error: any) {
    console.error("Error creating escrow order:", error);
    return NextResponse.json({ error: error.message || "Failed to create order" }, { status: 500 });
  }
}
