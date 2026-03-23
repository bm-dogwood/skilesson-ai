import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

// ✅ UPDATE USER
export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> } // 👈 params is Promise
) {
  try {
    const params = await context.params; // 👈 FIX HERE
    const body = await req.json();
    const { name, email, password, role } = body;

    if (!params.id) {
      return NextResponse.json(
        { success: false, error: "Missing user ID" },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { id: params.id },
    });

    if (!existingUser) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    const updateData: any = {
      name,
      email,
      role,
    };

    if (password && password.trim() !== "") {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const user = await prisma.user.update({
      where: { id: params.id },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      user,
    });
  } catch (err) {
    console.error("❌ UPDATE USER ERROR:", err);
    return NextResponse.json(
      { success: false, error: "Failed to update user" },
      { status: 500 }
    );
  }
}

// ✅ DELETE USER
export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> } // 👈 SAME FIX
) {
  try {
    const params = await context.params; // 👈 FIX HERE

    if (!params.id) {
      return NextResponse.json(
        { success: false, error: "Missing user ID" },
        { status: 400 }
      );
    }

    await prisma.user.delete({
      where: { id: params.id },
    });

    return NextResponse.json({
      success: true,
    });
  } catch (err) {
    console.error("❌ DELETE USER ERROR:", err);
    return NextResponse.json(
      { success: false, error: "Failed to delete user" },
      { status: 500 }
    );
  }
}
