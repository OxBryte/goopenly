import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/api/auth";
import connectDB from "@/lib/database";
import Payment from "@/lib/models/Payment";

/**
 * GET /api/protected/payment/earnings
 * Get earnings by status for authenticated user
 */
export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAuth(request);
    if (authResult instanceof NextResponse) {
      return authResult; // Error response
    }

    const { dbUser } = authResult;
    await connectDB();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || "completed";

    // Get earnings by status
    const payments = await Payment.find({
      sellerId: dbUser._id.toString(),
      status: status as any,
    });

    // Calculate totals
    const totalEarnings = payments.reduce((sum, payment) => {
      return sum + parseInt(payment.amountUSDC || "0");
    }, 0);

    const earningsByStatus = {
      pending: payments.filter((p) => p.status === "pending").length,
      completed: payments.filter((p) => p.status === "completed").length,
      failed: payments.filter((p) => p.status === "failed").length,
      cancelled: payments.filter((p) => p.status === "cancelled").length,
    };

    return NextResponse.json({
      success: true,
      data: {
        totalEarningsUSDC: totalEarnings.toString(),
        totalEarningsUSD: (totalEarnings / 1e6).toFixed(2),
        totalPayments: payments.length,
        earningsByStatus,
        payments: payments.map((p) => ({
          id: p._id,
          amountUSDC: p.amountUSDC,
          amountUSD: p.amountUSD,
          status: p.status,
          createdAt: p.createdAt,
          completedAt: p.completedAt,
        })),
      },
    });
  } catch (error) {
    console.error("Error fetching earnings:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

