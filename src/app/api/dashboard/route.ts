import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { subscription: true },
  });

  if (!user || !user.subscription?.packageId) {
    return NextResponse.json({ hasSubscription: false });
  }

  // ─── Lessons + progress ───────────────────────────────────────────────────
  const lessons = await prisma.lesson.findMany({
    where: { packageId: user.subscription.packageId },
    include: {
      progress: { where: { userId: user.id } },
    },
    orderBy: { createdAt: "asc" },
  });

  // ─── Stats ────────────────────────────────────────────────────────────────
  let completedLessons = 0;
  let inProgressLessons = 0;
  let totalWatchSeconds = 0;

  lessons.forEach((lesson) => {
    const p = lesson.progress?.[0];
    if (p?.status === "COMPLETED") completedLessons++;
    if (p?.status === "IN_PROGRESS") inProgressLessons++;
    if (p?.timestamp) totalWatchSeconds += p.timestamp;
  });

  const notStarted = lessons.length - completedLessons - inProgressLessons;
  const hoursLearned = Math.round((totalWatchSeconds / 3600) * 10) / 10;

  // ─── Continue watching ────────────────────────────────────────────────────
  const continueWatching =
    lessons.find((l) => {
      const p = l.progress?.[0];
      return p?.timestamp && p.status !== "COMPLETED";
    }) ?? null;

  // ─── Modules (grouped by level) ───────────────────────────────────────────
  const levelOrder = ["Beginner", "Intermediate", "Advanced"];
  const grouped: Record<string, typeof lessons> = {
    Beginner: [],
    Intermediate: [],
    Advanced: [],
  };
  lessons.forEach((l) => {
    if (grouped[l.level] !== undefined) grouped[l.level].push(l);
  });

  const modules = levelOrder
    .map((level) => {
      const group = grouped[level];
      const completed = group.filter(
        (l) => l.progress?.[0]?.status === "COMPLETED"
      ).length;
      return { title: level, total: group.length, completed };
    })
    .filter((m) => m.total > 0);

  // ─── Status donut data ────────────────────────────────────────────────────
  const statusChart = [
    { label: "Completed", value: completedLessons, color: "#38bdf8" },
    { label: "In Progress", value: inProgressLessons, color: "#7dd3fc" },
    {
      label: "Not Started",
      value: notStarted,
      color: "rgba(255,255,255,0.08)",
    },
  ];

  // ─── Weekly activity (last 7 days) ────────────────────────────────────────
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
  sevenDaysAgo.setHours(0, 0, 0, 0);

  const recentProgress = await prisma.progress.findMany({
    where: {
      userId: user.id,
      completedAt: { gte: sevenDaysAgo },
    },
    include: { lesson: true },
    orderBy: { completedAt: "asc" },
  });

  // Build last-7-days array
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const weeklyActivity = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    d.setHours(0, 0, 0, 0);
    const dayEnd = new Date(d);
    dayEnd.setHours(23, 59, 59, 999);

    const dayProgress = recentProgress.filter((p) => {
      const ca = p.completedAt;
      return ca && ca >= d && ca <= dayEnd;
    });

    const watchSeconds = dayProgress.reduce((acc, p) => {
      return acc + (p.timestamp ?? 0);
    }, 0);

    return {
      day: weekDays[d.getDay()],
      date: d.toISOString().split("T")[0],
      completed: dayProgress.filter((p) => p.status === "COMPLETED").length,
      watchMinutes: Math.round(watchSeconds / 60),
    };
  });

  // ─── Streak ───────────────────────────────────────────────────────────────
  const streakDays = weeklyActivity.map((d) => ({
    day: d.day,
    done: d.completed > 0 || d.watchMinutes > 0,
  }));

  let currentStreak = 0;
  const todayIdx = 6;
  for (let i = todayIdx; i >= 0; i--) {
    if (streakDays[i].done) currentStreak++;
    else break;
  }

  // ─── Recent activity ──────────────────────────────────────────────────────
  const recentActivity = await prisma.progress.findMany({
    where: { userId: user.id },
    include: { lesson: true },
    orderBy: { completedAt: "desc" },
    take: 6,
  });

  const activity = recentActivity.map((p) => ({
    action:
      p.status === "COMPLETED"
        ? `Completed "${p.lesson.title}"`
        : `Watched "${p.lesson.title}"`,
    time: p.completedAt,
    icon: p.status === "COMPLETED" ? "CheckCircle2" : "Play",
  }));

  // ─── AI submissions chart ─────────────────────────────────────────────────
  const submissions = await prisma.aISubmission.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "asc" },
  });

  const submissionsByWeek = submissions.reduce<Record<string, number>>(
    (acc, s) => {
      const week = getWeekLabel(s.createdAt);
      acc[week] = (acc[week] || 0) + 1;
      return acc;
    },
    {}
  );

  const aiSubmissionsChart = Object.entries(submissionsByWeek)
    .slice(-6)
    .map(([week, count]) => ({ week, count }));

  return NextResponse.json({
    hasSubscription: true,
    user: {
      name: user.name,
      level: user.level,
      sport: user.sport,
    },
    stats: {
      completedLessons,
      inProgressLessons,
      notStarted,
      hoursLearned,
      totalLessons: lessons.length,
      overallProgress: lessons.length
        ? Math.round((completedLessons / lessons.length) * 100)
        : 0,
      currentStreak,
      totalSubmissions: submissions.length,
    },
    continueWatching,
    modules,
    // Chart data
    statusChart,
    weeklyActivity,
    aiSubmissionsChart,
    // Other
    streakDays,
    recentActivity: activity,
    lessons,
  });
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function getWeekLabel(date: Date): string {
  const d = new Date(date);
  const jan1 = new Date(d.getFullYear(), 0, 1);
  const week = Math.ceil(
    ((d.getTime() - jan1.getTime()) / 86400000 + jan1.getDay() + 1) / 7
  );
  return `W${week}`;
}
