import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const session = await getServerSession();
    const { lessonId, status, timestamp } = await req.json();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const progress = await prisma.progress.upsert({
      where: {
        userId_lessonId: {
          userId: user.id,
          lessonId,
        },
      },
      update: {
        ...(status && {
          status,
          completedAt: status === "COMPLETED" ? new Date() : null,
        }),
        ...(timestamp !== undefined && {
          timestamp,
        }),
      },
      create: {
        userId: user.id,
        lessonId,
        status: status || "IN_PROGRESS",
        timestamp: timestamp || 0,
        completedAt: status === "COMPLETED" ? new Date() : null,
      },
    });

    return NextResponse.json({ success: true, progress });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
