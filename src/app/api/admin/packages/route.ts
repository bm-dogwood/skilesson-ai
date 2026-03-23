import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// ✅ GET ALL PACKAGES
export async function GET() {
  try {
    const packages = await prisma.package.findMany({
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json({
      success: true,
      packages,
    });
  } catch (err) {
    console.error("❌ GET PACKAGES ERROR:", err);
    return NextResponse.json(
      { success: false, error: "Failed to fetch packages" },
      { status: 500 }
    );
  }
}

// ✅ CREATE PACKAGE
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      name,
      description,
      priceMonthly,
      priceYearly,
      stripePriceIdMonthly,
      stripePriceIdYearly,
      features,
    } = body;

    if (!name || !priceMonthly) {
      return NextResponse.json(
        { success: false, error: "Name & monthly price required" },
        { status: 400 }
      );
    }

    const pkg = await prisma.package.create({
      data: {
        name,
        description,
        priceMonthly: Number(priceMonthly),
        priceYearly: priceYearly ? Number(priceYearly) : null,
        stripePriceIdMonthly,
        stripePriceIdYearly,
        features,
      },
    });

    return NextResponse.json({
      success: true,
      package: pkg,
    });
  } catch (err) {
    console.error("❌ CREATE PACKAGE ERROR:", err);
    return NextResponse.json(
      { success: false, error: "Failed to create package" },
      { status: 500 }
    );
  }
}
