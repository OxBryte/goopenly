import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/api/auth";
import connectDB from "@/lib/database";
import Product from "@/lib/models/Product";

/**
 * PUT /api/protected/product/[productId]
 * Update a product
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { productId: string } }
) {
  try {
    const authResult = await requireAuth(request);
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const { dbUser } = authResult;
    await connectDB();

    const body = await request.json();
    const { productId } = params;

    // Verify product belongs to user
    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    if (product.sellerId !== dbUser.clerkId && product.sellerId !== dbUser.walletAddress) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }

    // Update product
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      {
        ...body,
        updatedAt: new Date(),
      },
      { new: true }
    );

    return NextResponse.json({
      success: true,
      data: {
        id: updatedProduct._id,
        name: updatedProduct.name,
        description: updatedProduct.description,
        priceUSD: updatedProduct.priceUSD,
        priceUSDC: updatedProduct.priceUSDC,
        paymentLink: updatedProduct.paymentLink,
        imageUrl: updatedProduct.imageUrl,
        category: updatedProduct.category,
        isActive: updatedProduct.isActive,
        updatedAt: updatedProduct.updatedAt,
      },
    });
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

