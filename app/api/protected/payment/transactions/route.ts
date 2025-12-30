import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/api/auth";
import connectDB from "@/lib/database";
import Payment from "@/lib/models/Payment";

/**
 * GET /api/protected/payment/transactions
 * Get transaction history for authenticated user
 */
export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAuth(request);
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const { dbUser } = authResult;
    await connectDB();

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");
    const status = searchParams.get("status");

    const query: any = {
      sellerId: dbUser.clerkId || dbUser.walletAddress,
    };

    if (status) {
      query.status = status;
    }

    const transactions = await Payment.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(offset);

    const total = await Payment.countDocuments(query);

    return NextResponse.json({
      success: true,
      data: {
        transactions: transactions.map((t) => ({
          id: t._id,
          productId: t.productId,
          amountUSDC: t.amountUSDC,
          amountUSD: t.amountUSD,
          status: t.status,
          paymentLink: t.paymentLink,
          stripePaymentIntentId: t.stripePaymentIntentId,
          transactionHash: t.transactionHash,
          buyerEmail: t.buyerEmail,
          buyerName: t.buyerName,
          createdAt: t.createdAt,
          completedAt: t.completedAt,
        })),
        total,
        limit,
        offset,
      },
    });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

