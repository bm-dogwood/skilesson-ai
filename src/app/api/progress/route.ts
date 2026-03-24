import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const session = await getServerSession();
    const body = await req.json();

    const { lessonId, status, timestamp } = body;

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!lessonId) {
      return NextResponse.json(
        { error: "Lesson ID is required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 🔥 Get existing progress FIRST
    const existing = await prisma.progress.findUnique({
      where: {
        userId_lessonId: {
          userId: user.id,
          lessonId,
        },
      },
    });

    // ✅ Decide final status safely
    const finalStatus = status ?? existing?.status ?? "IN_PROGRESS";

    const progress = await prisma.progress.upsert({
      where: {
        userId_lessonId: {
          userId: user.id,
          lessonId,
        },
      },
      update: {
        status: finalStatus,
        timestamp: timestamp ?? existing?.timestamp ?? 0,
        completedAt: finalStatus === "COMPLETED" ? new Date() : null,
      },
      create: {
        userId: user.id,
        lessonId,
        status: finalStatus,
        timestamp: timestamp ?? 0,
        completedAt: finalStatus === "COMPLETED" ? new Date() : null,
      },
    });

    return NextResponse.json({ success: true, progress });
  } catch (err) {
    console.error("PROGRESS ERROR:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
