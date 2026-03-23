import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// ✅ UPDATE PACKAGE
export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const body = await req.json();

    const {
      name,
      description,
      priceMonthly,
      priceYearly,
      stripePriceIdMonthly,
      stripePriceIdYearly,
      features,
      isActive,
    } = body;

    const existing = await prisma.package.findUnique({
      where: { id: params.id },
    });

    if (!existing) {
      return NextResponse.json(
        { success: false, error: "Package not found" },
        { status: 404 }
      );
    }

    const updated = await prisma.package.update({
      where: { id: params.id },
      data: {
        name,
        description,
        priceMonthly: Number(priceMonthly),
        priceYearly: priceYearly ? Number(priceYearly) : null,
        stripePriceIdMonthly,
        stripePriceIdYearly,
        features,
        isActive,
      },
    });

    return NextResponse.json({
      success: true,
      package: updated,
    });
  } catch (err) {
    console.error("❌ UPDATE PACKAGE ERROR:", err);
    return NextResponse.json(
      { success: false, error: "Failed to update package" },
      { status: 500 }
    );
  }
}

// ✅ DELETE PACKAGE (soft delete recommended)
export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;

    // 👉 safer: deactivate instead of delete
    const pkg = await prisma.package.update({
      where: { id: params.id },
      data: {
        isActive: false,
      },
    });

    return NextResponse.json({
      success: true,
      package: pkg,
    });
  } catch (err) {
    console.error("❌ DELETE PACKAGE ERROR:", err);
    return NextResponse.json(
      { success: false, error: "Failed to delete package" },
      { status: 500 }
    );
  }
}
