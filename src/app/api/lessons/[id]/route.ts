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
    const lang = req.nextUrl.searchParams.get("lang") || "en"; // 👈 ADD THIS
    const session = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const lesson = await prisma.lesson.findUnique({
      where: { id },
      include: {
        progress: { where: { userId: user.id } },
      },
    });

    if (!lesson) {
      return NextResponse.json(
        { success: false, error: "Lesson not found" },
        { status: 404 }
      );
    }

    const progress = lesson.progress?.[0] || null;

    const upNext = await prisma.lesson.findMany({
      where: { id: { not: id }, sport: lesson.sport },
      take: 4,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        duration: true,
        thumbnailUrl: true,
        titleEs: true,
      },
    });

    // 👇 Localize the main lesson
    const localizedLesson = {
      ...lesson,
      title: lang === "es" && lesson.titleEs ? lesson.titleEs : lesson.title,
      description:
        lang === "es" && lesson.descriptionEs
          ? lesson.descriptionEs
          : lesson.description,
      progress,
      completed: progress?.status === "COMPLETED",
      status: progress?.status || "IN_PROGRESS",
      timestamp: progress?.timestamp || 0,
    };

    // 👇 Localize upNext titles too
    const localizedUpNext = upNext.map((l) => ({
      ...l,
      title: lang === "es" && l.titleEs ? l.titleEs : l.title,
    }));

    return NextResponse.json({
      success: true,
      lesson: localizedLesson,
      upNext: localizedUpNext,
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
