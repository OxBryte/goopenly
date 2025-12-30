import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/api/auth";
import connectDB from "@/lib/database";
import { User } from "@/lib/models/User";
import { z } from "zod";

const setUniqueNameSchema = z.object({
  uniqueName: z
    .string()
    .min(3, "Unique name must be at least 3 characters")
    .max(30, "Unique name must be at most 30 characters")
    .regex(
      /^[a-z0-9-]+$/,
      "Unique name can only contain lowercase letters, numbers, and hyphens"
    ),
});

/**
 * GET /api/protected/unique-name
 * Get user's unique name
 */
export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAuth(request);
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const { dbUser } = authResult;

    return NextResponse.json({
      success: true,
      data: {
        uniqueName: dbUser.username || null,
      },
    });
  } catch (error) {
    console.error("Error fetching unique name:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/protected/unique-name
 * Set user's unique name
 */
export async function POST(request: NextRequest) {
  try {
    const authResult = await requireAuth(request);
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const { dbUser } = authResult;
    await connectDB();

    const body = await request.json();
    const { uniqueName } = setUniqueNameSchema.parse(body);

    // Check if unique name is already taken
    const existingUser = await User.findOne({ username: uniqueName });
    if (existingUser && existingUser._id.toString() !== dbUser._id.toString()) {
      return NextResponse.json(
        { error: "Unique name already taken" },
        { status: 409 }
      );
    }

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      dbUser._id,
      { username: uniqueName },
      { new: true }
    );

    return NextResponse.json({
      success: true,
      data: {
        uniqueName: updatedUser.username,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Error setting unique name:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

