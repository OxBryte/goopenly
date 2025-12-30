import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/api/auth";
import { getWalletBalance } from "@/lib/blockradar";

/**
 * GET /api/protected/wallet/balance
 * Get wallet balance for authenticated user
 */
export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAuth(request);
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const { dbUser } = authResult;

    if (!dbUser.blockradarWalletId) {
      return NextResponse.json(
        { error: "Wallet not configured" },
        { status: 404 }
      );
    }

    // Get balance from Blockradar
    const balance = await getWalletBalance(dbUser.blockradarWalletId);

    return NextResponse.json({
      success: true,
      data: balance,
    });
  } catch (error) {
    console.error("Error fetching wallet balance:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

