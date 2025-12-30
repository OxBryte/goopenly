import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/api/auth";
import connectDB from "@/lib/database";
import Product from "@/lib/models/Product";
import Payment from "@/lib/models/Payment";

/**
 * GET /api/protected/product/stats
 * Get product statistics for authenticated user
 */
export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAuth(request);
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const { dbUser } = authResult;
    await connectDB();

    const sellerId = dbUser.clerkId || dbUser.walletAddress;

    // Get product stats
    const totalProducts = await Product.countDocuments({ sellerId });
    const activeProducts = await Product.countDocuments({
      sellerId,
      isActive: true,
    });

    // Get payment stats
    const totalPayments = await Payment.countDocuments({
      sellerId,
      status: "completed",
    });

    const totalRevenue = await Payment.aggregate([
      {
        $match: {
          sellerId,
          status: "completed",
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: { $toDouble: "$amountUSDC" } },
        },
      },
    ]);

    const totalRevenueUSDC = totalRevenue[0]?.total || 0;

    return NextResponse.json({
      success: true,
      data: {
        totalProducts,
        activeProducts,
        inactiveProducts: totalProducts - activeProducts,
        totalPayments,
        totalRevenueUSDC: totalRevenueUSDC.toString(),
        totalRevenueUSD: (totalRevenueUSDC / 1e6).toFixed(2),
      },
    });
  } catch (error) {
    console.error("Error fetching product stats:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

