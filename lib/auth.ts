import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectDB } from "@/lib/database";
import { User } from "@/lib/models/User";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        pin: { label: "PIN", type: "password" },
        walletAddress: { label: "Wallet Address", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.pin) {
          throw new Error("Username and PIN are required");
        }

        if (!credentials?.walletAddress) {
          throw new Error("Wallet connection is required");
        }

        await connectDB();

        // Find user by username
        const user = await User.findOne({ username: credentials.username.trim() }).select("+password");

        if (!user || !user.password) {
          throw new Error("Invalid username or PIN");
        }

        // Verify PIN (stored as hashed password)
        const isPinValid = await bcrypt.compare(
          credentials.pin,
          user.password
        );

        if (!isPinValid) {
          throw new Error("Invalid username or PIN");
        }

        // Verify wallet address matches (if user has wallet address)
        if (user.walletAddress && user.walletAddress.toLowerCase() !== credentials.walletAddress.toLowerCase()) {
          throw new Error("Wallet address does not match account");
        }

        // Update wallet address if not set
        if (!user.walletAddress && credentials.walletAddress) {
          user.walletAddress = credentials.walletAddress.toLowerCase();
          await user.save();
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.username || user.email,
          image: user.avatar,
        };
      },
    }),
  ],
  pages: {
    signIn: "/",
    signOut: "/",
    error: "/",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

