import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

/**
 * Get the current user session on the server
 */
export async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  return session?.user;
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated() {
  const session = await getServerSession(authOptions);
  return !!session?.user;
}

