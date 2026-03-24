// /api/progress-summary/route.ts

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
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

  const lessons = await prisma.lesson.findMany({
    include: {
      progress: {
        where: { userId: user.id },
      },
    },
  });

  const totalLessons = lessons.length;

  const completedLessons = lessons.filter(
    (l) => l.progress[0]?.status === "COMPLETED"
  ).length;

  const inProgressLessons = lessons.filter(
    (l) => l.progress[0]?.status === "IN_PROGRESS"
  ).length;

  // ✅ Level breakdown
  const levels = ["Beginner", "Intermediate", "Advanced"];

  const levelBreakdown = levels.map((level) => {
    const levelLessons = lessons.filter((l) => l.level === level);

    const completed = levelLessons.filter(
      (l) => l.progress[0]?.status === "COMPLETED"
    ).length;

    return {
      level,
      completed,
      total: levelLessons.length,
    };
  });

  return NextResponse.json({
    totalLessons,
    completedLessons,
    inProgressLessons,
    progressPercent:
      totalLessons > 0
        ? Math.round((completedLessons / totalLessons) * 100)
        : 0,
    levelBreakdown,
  });
}
