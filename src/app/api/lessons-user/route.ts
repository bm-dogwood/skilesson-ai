import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const session = await getServerSession();
  const lang = req.nextUrl.searchParams.get("lang") || "en";
  if (!session?.user?.email) {
    return NextResponse.json({
      lessons: [],
      hasSubscription: false,
    });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { subscription: true },
  });

  if (!user?.subscription?.packageId) {
    return NextResponse.json({
      lessons: [],
      hasSubscription: false,
    });
  }

  const lessons = await prisma.lesson.findMany({
    where: {
      packageId: user.subscription.packageId,
    },
    include: {
      progress: {
        where: { userId: user.id },
      },
    },
    orderBy: { createdAt: "desc" },
  });
  const localized = lessons.map((l) => ({
    ...l,
    title: lang === "es" && l.titleEs ? l.titleEs : l.title,
    description:
      lang === "es" && l.descriptionEs ? l.descriptionEs : l.description,
  }));

  return NextResponse.json({
    lessons: localized,
    hasSubscription: true,
  });
}
