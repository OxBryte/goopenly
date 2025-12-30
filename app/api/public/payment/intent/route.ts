import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/database";
import { PaymentLink } from "@/lib/models/PaymentLink";
import { createPaymentIntent } from "@/lib/stripe";
import { z } from "zod";

const createIntentSchema = z.object({
  paymentLink: z.string().min(1, "Payment link is required"),
});

/**
 * POST /api/public/payment/intent
 * Create a payment intent for a payment link
 */
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const validatedData = createIntentSchema.parse(body);

    // Find payment link
    const paymentLink = await PaymentLink.findBySlug(validatedData.paymentLink);

    if (!paymentLink || paymentLink.status !== "active") {
      return NextResponse.json(
        { error: "Payment link not found or inactive" },
        { status: 404 }
      );
    }

    // Create Stripe payment intent
    const amount = paymentLink.amount || 0;
    const currency = paymentLink.currency || "usd";

    const paymentIntent = await createPaymentIntent(
      Math.round(amount * 100), // Convert to cents
      currency,
      {
        paymentLink: paymentLink.slug,
        sellerId: paymentLink.sellerId,
        type: paymentLink.type,
      }
    );

    // Update payment link with payment intent ID
    await PaymentLink.updateStatus(paymentLink.slug, "active");

    return NextResponse.json({
      success: true,
      data: {
        paymentIntentId: paymentIntent.id,
        clientSecret: paymentIntent.client_secret,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Error creating payment intent:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

