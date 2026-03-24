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
    include: {
      subscription: true,
    },
  });

  if (!user || !user.subscription?.packageId) {
    return NextResponse.json({
      hasSubscription: false,
    });
  }

  // 🔥 Get lessons with progress
  const lessons = await prisma.lesson.findMany({
    where: {
      packageId: user.subscription.packageId,
    },
    include: {
      progress: {
        where: { userId: user.id },
      },
    },
    orderBy: { createdAt: "asc" },
  });

  // =========================
  // 📊 STATS CALCULATION
  // =========================
  let completedLessons = 0;
  let totalWatchTime = 0;
  let inProgressLessons = 0;

  lessons.forEach((lesson) => {
    const p = lesson.progress?.[0];

    if (p?.status === "COMPLETED") completedLessons++;
    if (p?.status === "IN_PROGRESS") inProgressLessons++;

    if (p?.timestamp) {
      totalWatchTime += p.timestamp;
    }
  });

  const totalLessons = lessons.length;
  const overallProgress = totalLessons
    ? Math.round((completedLessons / totalLessons) * 100)
    : 0;

  // =========================
  // ▶️ CONTINUE WATCHING
  // =========================
  const continueLesson = lessons.find((l) => {
    const p = l.progress?.[0];
    return p && p.timestamp && p.status !== "COMPLETED";
  });

  // =========================
  // 📚 FAKE MODULE GROUPING (by level)
  // =========================
  const grouped = {
    Beginner: lessons.filter((l) => l.level === "Beginner"),
    Intermediate: lessons.filter((l) => l.level === "Intermediate"),
    Advanced: lessons.filter((l) => l.level === "Advanced"),
  };

  const modules = Object.entries(grouped).map(([level, lessons]) => {
    const completed = lessons.filter(
      (l) => l.progress?.[0]?.status === "COMPLETED"
    ).length;

    return {
      title: level,
      total: lessons.length,
      completed,
    };
  });

  // =========================
  // 🕒 RECENT ACTIVITY
  // =========================
  const recentActivity = await prisma.progress.findMany({
    where: { userId: user.id },
    include: { lesson: true },
    orderBy: { completedAt: "desc" },
    take: 5,
  });

  const activity = recentActivity.map((p) => ({
    action:
      p.status === "COMPLETED"
        ? `Completed "${p.lesson.title}"`
        : `Watched "${p.lesson.title}"`,
    time: p.completedAt,
  }));

  return NextResponse.json({
    hasSubscription: true,
    stats: {
      completedLessons,
      totalLessons,
      totalWatchTime,
      overallProgress,
    },
    continueLesson,
    modules,
    activity,
  });
}
