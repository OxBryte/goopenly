import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/api/auth";
import connectDB from "@/lib/database";
import Payment from "@/lib/models/Payment";

/**
 * GET /api/protected/payment/sales-heatmap
 * Get sales heatmap data (365 days) for authenticated user
 */
export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAuth(request);
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const { dbUser } = authResult;
    await connectDB();

    // Get sales from last 365 days
    const oneYearAgo = new Date();
    oneYearAgo.setDate(oneYearAgo.getDate() - 365);

    const payments = await Payment.find({
      sellerId: dbUser._id.toString(),
      status: "completed",
      createdAt: { $gte: oneYearAgo },
    });

    // Group by date
    const salesByDate: Record<string, number> = {};

    payments.forEach((payment) => {
      const date = new Date(payment.createdAt).toISOString().split("T")[0];
      const amount = parseInt(payment.amountUSDC || "0");
      salesByDate[date] = (salesByDate[date] || 0) + amount;
    });

    // Generate heatmap data (array of { date, value })
    const heatmapData = Object.entries(salesByDate).map(([date, value]) => ({
      date,
      value: value / 1e6, // Convert to USD
    }));

    return NextResponse.json({
      success: true,
      data: {
        heatmapData,
        totalDays: 365,
        totalSales: payments.length,
        dateRange: {
          start: oneYearAgo.toISOString(),
          end: new Date().toISOString(),
        },
      },
    });
  } catch (error) {
    console.error("Error fetching sales heatmap:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

