import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET all packages
export async function GET() {
  try {
    const packages = await prisma.package.findMany({
      orderBy: { priceMonthly: "asc" },
    });

    return NextResponse.json({ packages }); // ✅ FIXED
  } catch (error) {
    console.error("❌ Fetch packages error:", error);
    return NextResponse.json(
      { error: "Failed to fetch packages" },
      { status: 500 }
    );
  }
}

// CREATE package
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const newPackage = await prisma.package.create({
      data: {
        name: body.name,

        description: body.description || "",
        priceMonthly: body.priceMonthly,
        priceYearly: body.priceYearly,
      },
    });

    return NextResponse.json({ success: true, package: newPackage });
  } catch (error) {
    console.error("❌ Create package error:", error);
    return NextResponse.json(
      { error: "Failed to create package" },
      { status: 500 }
    );
  }
}
