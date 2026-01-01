import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/api/auth";
import connectDB from "@/lib/database";
import Product from "@/lib/models/Product";
import { z } from "zod";

const createProductSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  description: z.string().min(1, "Product description is required"),
  priceUSD: z.number().min(0.01, "Price must be greater than 0"),
  imageUrl: z.string().url().optional(),
  category: z.string().optional(),
  allowMultiplePayments: z.boolean().optional().default(false),
});

/**
 * POST /api/protected/product
 * Create a new product
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
    const validatedData = createProductSchema.parse(body);

    // Generate payment link
    const paymentLink = await Product.generatePaymentLink(validatedData.name);

    // Convert USD to USDC
    const priceUSDC = Product.convertUSDToUSDC(validatedData.priceUSD);

    const product = await Product.create({
      sellerId: dbUser._id.toString(),
      name: validatedData.name,
      description: validatedData.description,
      priceUSD: validatedData.priceUSD,
      priceUSDC,
      paymentLink,
      imageUrl: validatedData.imageUrl,
      category: validatedData.category,
      isActive: true,
    });

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
        isActive: product.isActive,
        createdAt: product.createdAt,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/protected/product
 * Get all products for authenticated user (paginated)
 */
export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAuth(request);
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const { dbUser } = authResult;
    await connectDB();

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = parseInt(searchParams.get("offset") || "0");
    const isActive = searchParams.get("isActive");

    const query: any = {
      sellerId: dbUser._id.toString(),
    };

    if (isActive !== null) {
      query.isActive = isActive === "true";
    }

    const products = await Product.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(offset);

    const total = await Product.countDocuments(query);

    return NextResponse.json({
      success: true,
      data: {
        products: products.map((p) => ({
          id: p._id,
          name: p.name,
          description: p.description,
          priceUSD: p.priceUSD,
          priceUSDC: p.priceUSDC,
          paymentLink: p.paymentLink,
          imageUrl: p.imageUrl,
          category: p.category,
          isActive: p.isActive,
          createdAt: p.createdAt,
          updatedAt: p.updatedAt,
        })),
        total,
        limit,
        offset,
      },
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

