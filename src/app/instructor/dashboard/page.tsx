import { requireInstructor } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import DashboardClient from "@/components/DashboardClient";

export default async function Dashboard() {
  await requireInstructor();

  const session = await getServerSession(authOptions);

  const instructor = await prisma.user.findUnique({
    where: { email: session!.user!.email! },
  });

  // ── All students ──────────────────────────────────────────────
  const students = await prisma.user.findMany({
    where: { role: "student" },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      level: true,
      createdAt: true,
      progress: { select: { status: true, completedAt: true } },
    },
  });

  // ── Instructor's lessons ──────────────────────────────────────
  const lessons = await prisma.lesson.findMany({
    where: { userId: instructor!.id },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      createdAt: true,
      progress: { select: { status: true } },
    },
  });

  // ── Stats ─────────────────────────────────────────────────────
  const totalStudents = students.length;
  const totalLessons = lessons.length;

  const allProgress = students.flatMap((s) => s.progress);
  const completed = allProgress.filter((p) => p.status === "COMPLETED").length;
  const inProg = allProgress.filter((p) => p.status === "IN_PROGRESS").length;
  const avgProgress =
    allProgress.length > 0
      ? Math.round((completed / allProgress.length) * 100)
      : 0;

  // ── Students joined per month (last 6 months) ─────────────────
  const now = new Date();
  const joinsByMonth: { month: string; count: number }[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const label = d.toLocaleString("default", { month: "short" });
    const count = students.filter((s) => {
      const c = new Date(s.createdAt);
      return (
        c.getFullYear() === d.getFullYear() && c.getMonth() === d.getMonth()
      );
    }).length;
    joinsByMonth.push({ month: label, count });
  }

  // ── Completions per month (last 6 months) ─────────────────────
  const completionsByMonth: { month: string; count: number }[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const label = d.toLocaleString("default", { month: "short" });
    const count = allProgress.filter((p) => {
      if (p.status !== "COMPLETED" || !p.completedAt) return false;
      const c = new Date(p.completedAt);
      return (
        c.getFullYear() === d.getFullYear() && c.getMonth() === d.getMonth()
      );
    }).length;
    completionsByMonth.push({ month: label, count });
  }

  // ── Level distribution ────────────────────────────────────────
  const levelCounts = {
    beginner: students.filter((s) => s.level?.toLowerCase() === "beginner")
      .length,
    intermediate: students.filter(
      (s) => s.level?.toLowerCase() === "intermediate"
    ).length,
    advanced: students.filter((s) => s.level?.toLowerCase() === "advanced")
      .length,
    unknown: students.filter((s) => !s.level).length,
  };

  // ── Lesson engagement (top 5) ─────────────────────────────────
  const lessonEngagement = lessons.slice(0, 5).map((l) => ({
    title: l.title.length > 22 ? l.title.slice(0, 22) + "…" : l.title,
    completed: l.progress.filter((p) => p.status === "COMPLETED").length,
    inProg: l.progress.filter((p) => p.status === "IN_PROGRESS").length,
  }));

  // ── Recent students (5) ───────────────────────────────────────
  const recentStudents = students.slice(0, 5).map((s) => {
    const total = s.progress.length;
    const done = s.progress.filter((p) => p.status === "COMPLETED").length;
    const pct = total > 0 ? Math.round((done / total) * 100) : 0;
    return {
      id: s.id,
      name: s.name ?? "Unknown",
      email: s.email,
      level: s.level ?? null,
      joinedAt: s.createdAt.toISOString(),
      pct,
      total,
      done,
    };
  });

  // ── Recent activity feed ──────────────────────────────────────
  type ActivityItem = { type: string; text: string; time: string; dot: string };
  const activityFeed: ActivityItem[] = [];

  // New students
  students.slice(0, 3).forEach((s) => {
    activityFeed.push({
      type: "join",
      text: `${s.name ?? s.email} joined as a student`,
      time: new Date(s.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      dot: "#38bdf8",
    });
  });

  // Recent completions
  const recentCompletions = allProgress
    .filter((p) => p.status === "COMPLETED" && p.completedAt)
    .sort(
      (a, b) =>
        new Date(b.completedAt!).getTime() - new Date(a.completedAt!).getTime()
    )
    .slice(0, 3);

  recentCompletions.forEach((p) => {
    activityFeed.push({
      type: "completion",
      text: `A student completed a lesson`,
      time: new Date(p.completedAt!).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      dot: "#22c55e",
    });
  });

  // New lessons
  lessons.slice(0, 2).forEach((l) => {
    activityFeed.push({
      type: "lesson",
      text: `Lesson "${l.title}" was published`,
      time: new Date(l.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      dot: "#f59e0b",
    });
  });

  // Sort by recency approximation (already sorted by createdAt desc)
  const sortedFeed = activityFeed.slice(0, 8);

  return (
    <DashboardClient
      instructorName={instructor?.name ?? null}
      stats={{
        totalStudents,
        totalLessons,
        avgProgress,
        inProgress: inProg,
      }}
      joinsByMonth={joinsByMonth}
      completionsByMonth={completionsByMonth}
      levelCounts={levelCounts}
      lessonEngagement={lessonEngagement}
      recentStudents={recentStudents}
      activityFeed={sortedFeed}
    />
  );
}
