import { requireInstructor } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import StudentsTable from "@/components/StudentsTable";

export default async function StudentsPage() {
  await requireInstructor();

  const students = await prisma.user.findMany({
    where: { role: "student" },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      level: true,
      sport: true,
      createdAt: true,
      progress: {
        select: {
          status: true,
        },
      },
      subscription: {
        select: {
          plan: true,
          status: true,
        },
      },
    },
  });

  // Compute stats per student
  const enriched = students.map((s) => {
    const total = s.progress.length;
    const completed = s.progress.filter((p) => p.status === "COMPLETED").length;
    const inProg = s.progress.filter((p) => p.status === "IN_PROGRESS").length;
    const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

    return {
      id: s.id,
      name: s.name ?? "—",
      email: s.email,
      level: s.level ?? null,
      sport: s.sport ?? null,
      createdAt: s.createdAt.toISOString(),
      plan: s.subscription?.plan ?? null,
      subStatus: s.subscription?.status ?? null,
      totalLessons: total,
      completed,
      inProgress: inProg,
      progressPct: pct,
    };
  });

  return <StudentsTable students={enriched} />;
}
