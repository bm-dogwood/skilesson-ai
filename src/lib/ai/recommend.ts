import { prisma } from "@/lib/prisma";

export async function getRecommendedLessons(focusArea: string, level: string) {
  return prisma.lesson.findMany({
    where: {
      level,
      title: {
        contains: focusArea,
        mode: "insensitive",
      },
    },
    take: 3,
  });
}
