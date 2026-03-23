import { prisma } from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";

// ✅ GET SINGLE LESSON
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const lesson = await prisma.lesson.findUnique({
    where: { id },
    include: {
      user: true,
      progress: true,
    },
  });

  if (!lesson) {
    return NextResponse.json(
      { success: false, error: "Lesson not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true, lesson });
}

// ✅ UPDATE LESSON
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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
}

// ✅ DELETE LESSON
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  await prisma.lesson.delete({
    where: { id },
  });

  return NextResponse.json({ success: true });
}
