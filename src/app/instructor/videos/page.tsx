import { requireInstructor } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import VideosGrid from "@/components/VideosGrid";

export default async function VideosPage() {
  await requireInstructor();

  const session = await getServerSession(authOptions);

  const user = await prisma.user.findUnique({
    where: { email: session!.user!.email! },
  });

  const lessons = await prisma.lesson.findMany({
    where: { userId: user!.id },
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { progress: true } },
      progress: { select: { status: true } },
    },
  });

  const enriched = lessons.map((l) => ({
    id: l.id,
    title: l.title,
    description: l.description,
    level: l.level,
    sport: l.sport,
    playbackId: l.playbackId,
    thumbnailUrl: l.thumbnailUrl,
    duration: l.duration,
    uploadId: l.uploadId,
    createdAt: l.createdAt.toISOString(),
    totalStudents: l._count.progress,
    completions: l.progress.filter((p) => p.status === "COMPLETED").length,
    inProgress: l.progress.filter((p) => p.status === "IN_PROGRESS").length,
  }));

  return <VideosGrid lessons={enriched} />;
}
