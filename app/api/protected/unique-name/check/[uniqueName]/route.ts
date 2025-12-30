import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/database";
import { User } from "@/lib/models/User";

/**
 * GET /api/protected/unique-name/check/[uniqueName]
 * Check if unique name is available
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { uniqueName: string } }
) {
  try {
    await connectDB();

    const { uniqueName } = params;

    const existingUser = await User.findOne({ username: uniqueName });

    return NextResponse.json({
      success: true,
      data: {
        available: !existingUser,
        uniqueName,
      },
    });
  } catch (error) {
    console.error("Error checking unique name:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

