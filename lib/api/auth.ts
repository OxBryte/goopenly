import { auth, currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/database";
import { User } from "@/lib/models/User";

/**
 * Get authenticated user from Clerk
 * Returns user ID and user object
 */
export async function getAuthUser() {
  const { userId } = await auth();
  
  if (!userId) {
    return null;
  }

  const user = await currentUser();
  return { userId, user };
}

/**
 * Middleware to protect API routes
 * Returns 401 if user is not authenticated
 */
export async function requireAuth(request: NextRequest) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  // Get user from database
  await connectDB();
  const dbUser = await User.findOne({ clerkId: userId });

  if (!dbUser) {
    return NextResponse.json(
      { error: "User not found in database" },
      { status: 404 }
    );
  }

  return { userId, dbUser };
}

/**
 * Get user's Clerk token for external API calls
 */
export async function getAuthToken() {
  const { getToken } = await auth();
  return await getToken();
}

