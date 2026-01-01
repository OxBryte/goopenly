import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/database";
import { User } from "@/lib/models/User";
import { authOptions } from "@/lib/auth";

/**
 * Get authenticated user from NextAuth session
 * Returns user ID and user object
 */
export async function getAuthUser() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return null;
  }

  await connectDB();
  const dbUser = await User.findById(session.user.id);

  if (!dbUser) {
    return null;
  }

  return { userId: session.user.id, user: dbUser };
}

/**
 * Middleware to protect API routes
 * Returns 401 if user is not authenticated
 */
export async function requireAuth(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Get user from database
  await connectDB();
  const dbUser = await User.findById(session.user.id);

  if (!dbUser) {
    return NextResponse.json(
      { error: "User not found in database" },
      { status: 404 }
    );
  }

  return { userId: session.user.id, dbUser };
}

/**
 * Get current session
 */
export async function getSession() {
  return await getServerSession(authOptions);
}
