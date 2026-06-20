import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { db } from "@/server/db";

/**
 * POST /api/webhooks/razorpay
 * Receives Razorpay webhook events to capture sponsor payment deposits.
 */
export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-razorpay-signature");
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET || "";

    // If webhook secret is configured, verify the HMAC signature
    if (secret && signature) {
      const hmac = crypto.createHmac("sha256", secret);
      hmac.update(rawBody);
      const generatedSignature = hmac.digest("hex");

      if (generatedSignature !== signature) {
        console.warn("Razorpay Webhook: Invalid signature received");
        return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
      }
    } else {
      console.warn("Razorpay Webhook: Skipping signature verification (secret or header missing)");
    }

    const payload = JSON.parse(rawBody);
    const event = payload.event;

    console.log(`Razorpay Webhook: Received event "${event}"`);

    // Handle payment.captured event
    if (event === "payment.captured" || event === "order.paid") {
      const paymentEntity = payload.payload.payment.entity;
      const orderId = paymentEntity.order_id;
      const paymentId = paymentEntity.id;

      if (orderId) {
        // Find transaction associated with this Razorpay Order ID
        const transaction = await db.escrowTransaction.findFirst({
          where: { razorpayOrderId: orderId },
        });

        if (transaction) {
          // Confirm escrow locking by updating database record with payment ID
          await db.escrowTransaction.update({
            where: { id: transaction.id },
            data: {
              razorpayPaymentId: paymentId,
              escrowStatus: "ESCROW_LOCKED",
            },
          });
          console.log(`Razorpay Webhook: Escrow payment successfully locked for order ${orderId}`);
        } else {
          console.warn(`Razorpay Webhook: No EscrowTransaction found for order ID ${orderId}`);
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("Error handling Razorpay Webhook:", error);
    return NextResponse.json({ error: error.message || "Webhook processing failed" }, { status: 500 });
  }
}
