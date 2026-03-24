import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession();

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

  return NextResponse.json({
    lessons,
    hasSubscription: true,
  });
}
