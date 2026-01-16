import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/database";
import { User } from "@/lib/models/User";
import bcrypt from "bcryptjs";
import { z } from "zod";

const signupSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters").max(30, "Username must be less than 30 characters"),
  pin: z.string().min(4, "PIN must be at least 4 digits").max(6, "PIN must be at most 6 digits").regex(/^\d+$/, "PIN must contain only digits"),
  walletAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/, "Invalid wallet address"),
  email: z.string().email("Invalid email address").optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = signupSchema.parse(body);

    await connectDB();

    // Check if username already exists
    const existingUsername = await User.findOne({ 
      username: validatedData.username.trim() 
    });

    if (existingUsername) {
      return NextResponse.json(
        { error: "Username already taken" },
        { status: 400 }
      );
    }

    // Check if wallet address already exists
    const existingWallet = await User.findOne({ 
      walletAddress: validatedData.walletAddress.toLowerCase() 
    });

    if (existingWallet) {
      return NextResponse.json(
        { error: "Wallet address is already registered" },
        { status: 400 }
      );
    }

    // Check if email already exists (if provided)
    if (validatedData.email) {
      const existingEmail = await User.findOne({ 
        email: validatedData.email.toLowerCase() 
      });

      if (existingEmail) {
        return NextResponse.json(
          { error: "Email already registered" },
          { status: 400 }
        );
      }
    }

    // Hash PIN (treating it as a password)
    const hashedPin = await bcrypt.hash(validatedData.pin, 12);

    // Create user
    const user = await User.create({
      username: validatedData.username.trim(),
      password: hashedPin,
      walletAddress: validatedData.walletAddress.toLowerCase(),
      email: validatedData.email?.toLowerCase(),
      isOnboardingComplete: false,
    });

    return NextResponse.json(
      {
        message: "User created successfully",
        user: {
          id: user._id.toString(),
          username: user.username,
          walletAddress: user.walletAddress,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    if (error.code === 11000) {
      // Handle duplicate key error
      if (error.keyPattern?.username) {
        return NextResponse.json(
          { error: "Username already taken" },
          { status: 400 }
        );
      }
      if (error.keyPattern?.walletAddress) {
        return NextResponse.json(
          { error: "Wallet address is already registered" },
          { status: 400 }
        );
      }
      if (error.keyPattern?.email) {
        return NextResponse.json(
          { error: "Email already registered" },
          { status: 400 }
        );
      }
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}

