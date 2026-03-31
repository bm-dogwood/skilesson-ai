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
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // ── All lessons + this user's progress ───────────────────────────────────
  const lessons = await prisma.lesson.findMany({
    include: {
      progress: { where: { userId: user.id } },
    },
  });

  const totalLessons = lessons.length;
  const completedLessons = lessons.filter(
    (l) => l.progress[0]?.status === "COMPLETED"
  ).length;
  const inProgressLessons = lessons.filter(
    (l) => l.progress[0]?.status === "IN_PROGRESS"
  ).length;

  // ── Level breakdown ───────────────────────────────────────────────────────
  const levels = ["Beginner", "Intermediate", "Advanced"];
  const levelColors: Record<string, string> = {
    Beginner: "from-green-400 to-emerald-400",
    Intermediate: "from-ice to-powder",
    Advanced: "from-orange-400 to-red-400",
  };

  const levelBreakdown = levels.map((level) => {
    const group = lessons.filter((l) => l.level === level);
    const completed = group.filter(
      (l) => l.progress[0]?.status === "COMPLETED"
    ).length;
    return { level, completed, total: group.length, color: levelColors[level] };
  });

  // ── All completed progress rows (for timeline + heatmap) ──────────────────
  const allProgress = await prisma.progress.findMany({
    where: { userId: user.id },
    include: { lesson: { select: { title: true, level: true } } },
    orderBy: { completedAt: "asc" },
  });

  // ── Completion timeline — last 30 days, one entry per completed lesson ────
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 29);
  thirtyDaysAgo.setHours(0, 0, 0, 0);

  const timeline = allProgress
    .filter(
      (p) =>
        p.status === "COMPLETED" &&
        p.completedAt &&
        p.completedAt >= thirtyDaysAgo
    )
    .map((p) => ({
      date: p.completedAt!.toISOString().split("T")[0],
      lessonTitle: p.lesson.title,
      level: p.lesson.level,
    }));

  // ── Activity heatmap — last 12 weeks (84 days) ────────────────────────────
  // Returns one cell per day: { date, count } where count = lessons touched
  const twelveWeeksAgo = new Date();
  twelveWeeksAgo.setDate(twelveWeeksAgo.getDate() - 83);
  twelveWeeksAgo.setHours(0, 0, 0, 0);

  const heatmapProgress = await prisma.progress.findMany({
    where: {
      userId: user.id,
      completedAt: { gte: twelveWeeksAgo },
    },
  });

  // Bucket by date string
  const dateBuckets: Record<string, number> = {};
  heatmapProgress.forEach((p) => {
    if (!p.completedAt) return;
    const key = p.completedAt.toISOString().split("T")[0];
    dateBuckets[key] = (dateBuckets[key] || 0) + 1;
  });

  // Build full 84-day grid
  const heatmap = Array.from({ length: 84 }, (_, i) => {
    const d = new Date(twelveWeeksAgo);
    d.setDate(d.getDate() + i);
    const key = d.toISOString().split("T")[0];
    return { date: key, count: dateBuckets[key] || 0 };
  });

  // ── Watch time stats ──────────────────────────────────────────────────────
  const totalWatchSeconds = allProgress.reduce(
    (acc, p) => acc + (p.timestamp ?? 0),
    0
  );
  const totalWatchMinutes = Math.round(totalWatchSeconds / 60);

  // This week watch time
  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - weekStart.getDay());
  weekStart.setHours(0, 0, 0, 0);

  const weekProgress = await prisma.progress.findMany({
    where: {
      userId: user.id,
      completedAt: { gte: weekStart },
    },
  });
  const weekWatchMinutes = Math.round(
    weekProgress.reduce((acc, p) => acc + (p.timestamp ?? 0), 0) / 60
  );

  // Avg session (only sessions with timestamp > 0)
  const sessionsWithTime = allProgress.filter((p) => (p.timestamp ?? 0) > 60);
  const avgSessionMinutes =
    sessionsWithTime.length > 0
      ? Math.round(
          sessionsWithTime.reduce((a, p) => a + (p.timestamp ?? 0), 0) /
            sessionsWithTime.length /
            60
        )
      : 0;

  // ── Badges — computed from real data ─────────────────────────────────────
  const completedCount = allProgress.filter(
    (p) => p.status === "COMPLETED"
  ).length;
  const hasAdvanced = allProgress.some((p) => p.lesson.level === "Advanced");
  const hasCompletedModule = levelBreakdown.some(
    (l) => l.total > 0 && l.completed === l.total
  );

  // Streak calc
  let currentStreak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  for (let i = 0; i <= 30; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().split("T")[0];
    if (dateBuckets[key]) currentStreak++;
    else if (i > 0) break; // gap — stop
  }

  const badges = [
    {
      name: "First Lesson",
      icon: "Star",
      earned: completedCount >= 1,
      description: "Complete your very first lesson",
    },
    {
      name: "Week Warrior",
      icon: "Flame",
      earned: currentStreak >= 5,
      description: "5-day learning streak",
    },
    {
      name: "Module Master",
      icon: "Trophy",
      earned: hasCompletedModule,
      description: "Complete an entire module",
    },
    {
      name: "Speed Demon",
      icon: "Zap",
      earned: false, // needs quiz data
      description: "Complete 3 lessons in one day",
    },
    {
      name: "Night Owl",
      icon: "Moon",
      earned: false, // needs time-of-day tracking
      description: "Study after 10 PM",
    },
    {
      name: "Trailblazer",
      icon: "Mountain",
      earned: hasAdvanced,
      description: "Start an Advanced lesson",
    },
    {
      name: "Snowflake",
      icon: "Snowflake",
      earned: [11, 0, 1].includes(new Date().getMonth()), // Nov–Feb
      description: "Log in during winter season",
    },
    {
      name: "Dedicated",
      icon: "Timer",
      earned: totalWatchMinutes >= 3000, // 50 hours
      description: "Accumulate 50 hours of learning",
    },
  ];

  // ── Monthly summary ───────────────────────────────────────────────────────
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthProgress = allProgress.filter(
    (p) => p.completedAt && p.completedAt >= monthStart
  );
  const monthCompleted = monthProgress.filter(
    (p) => p.status === "COMPLETED"
  ).length;
  const monthWatchMinutes = Math.round(
    monthProgress.reduce((a, p) => a + (p.timestamp ?? 0), 0) / 60
  );
  const monthBadges = badges.filter((b) => b.earned).length;
  const monthName = now.toLocaleString("default", { month: "long" });

  return NextResponse.json({
    totalLessons,
    completedLessons,
    inProgressLessons,
    progressPercent:
      totalLessons > 0
        ? Math.round((completedLessons / totalLessons) * 100)
        : 0,
    levelBreakdown,
    // New
    timeline,
    heatmap,
    badges,
    currentStreak,
    timeTracking: {
      totalMinutes: totalWatchMinutes,
      weekMinutes: weekWatchMinutes,
      avgSessionMinutes,
    },
    monthlySummary: {
      monthName,
      lessonsCompleted: monthCompleted,
      watchMinutes: monthWatchMinutes,
      longestStreak: currentStreak,
      badgesEarned: monthBadges,
    },
  });
}
