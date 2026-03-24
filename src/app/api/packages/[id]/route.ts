import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// UPDATE package
export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await req.json();

    const updated = await prisma.package.update({
      where: { id },
      data: {
        name: body.name,
        description: body.description,
        priceMonthly: body.priceMonthly,
        priceYearly: body.priceYearly,
      },
    });

    return NextResponse.json({ success: true, package: updated });
  } catch (error) {
    console.error("❌ Update error:", error);
    return NextResponse.json(
      { error: "Failed to update package" },
      { status: 500 }
    );
  }
}

// DELETE package
export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    await prisma.package.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("❌ Delete error:", error);
    return NextResponse.json(
      { error: "Failed to delete package" },
      { status: 500 }
    );
  }
}
