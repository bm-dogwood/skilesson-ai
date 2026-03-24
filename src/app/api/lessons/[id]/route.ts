import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse, NextRequest } from "next/server";

// ✅ GET SINGLE LESSON
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession();

    // 🔐 Auth check
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 👤 Get user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 📚 Get lesson + progress
    const lesson = await prisma.lesson.findUnique({
      where: { id },
      include: {
        progress: {
          where: {
            userId: user.id,
          },
        },
      },
    });

    if (!lesson) {
      return NextResponse.json(
        { success: false, error: "Lesson not found" },
        { status: 404 }
      );
    }

    // 🎯 Extract progress safely
    const progress = lesson.progress?.[0] || null;

    // 🚀 Clean response for frontend
    return NextResponse.json({
      success: true,
      lesson: {
        ...lesson,
        progress, // full progress object (optional use)
        completed: progress?.status === "COMPLETED",
        status: progress?.status || "IN_PROGRESS",
        timestamp: progress?.timestamp || 0,
      },
    });
  } catch (err) {
    console.error("GET LESSON ERROR:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// ✅ UPDATE LESSON
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    const lesson = await prisma.lesson.update({
      where: { id },
      data: {
        title: body.title,
        description: body.description,
        level: body.level,
        sport: body.sport,
      },
    });

    return NextResponse.json({ success: true, lesson });
  } catch (err) {
    console.error("UPDATE LESSON ERROR:", err);
    return NextResponse.json(
      { error: "Failed to update lesson" },
      { status: 500 }
    );
  }
}

// ✅ DELETE LESSON
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.lesson.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE LESSON ERROR:", err);
    return NextResponse.json(
      { error: "Failed to delete lesson" },
      { status: 500 }
    );
  }
}
