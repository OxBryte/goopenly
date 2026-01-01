import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/database";
import Product from "@/lib/models/Product";
import { User } from "@/lib/models/User";

/**
 * GET /api/public/p/[uniqueName]/[slug]
 * Get product by unique name and slug (public endpoint)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { uniqueName: string; slug: string } }
) {
  try {
    await connectDB();

    const { uniqueName, slug } = params;

    // Find user by unique name
    const user = await User.findOne({ username: uniqueName });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Find product by slug and seller
    const product = await Product.findOne({
      paymentLink: slug.toLowerCase(),
      sellerId: user._id.toString(),
      isActive: true,
    });

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        id: product._id,
        name: product.name,
        description: product.description,
        priceUSD: product.priceUSD,
        priceUSDC: product.priceUSDC,
        paymentLink: product.paymentLink,
        imageUrl: product.imageUrl,
        category: product.category,
        seller: {
          uniqueName: user.username,
          name: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
        },
      },
    });
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

