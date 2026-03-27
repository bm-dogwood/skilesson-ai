import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { sendNewLessonEmail } from "@/lib/email";

// ✅ GET ALL LESSONS
export async function GET() {
  const lessons = await prisma.lesson.findMany({
    include: {
      user: true,
      _count: { select: { progress: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ success: true, lessons });
}

// ✅ CREATE LESSON
export async function POST(req: Request) {
  const body = await req.json();
  const { title, description, level, sport, userId, packageId } = body;

  if (!title || !userId) {
    return NextResponse.json(
      { success: false, error: "Missing fields" },
      { status: 400 }
    );
  }

  const lesson = await prisma.lesson.create({
    data: {
      title,
      description,
      level,
      sport,
      userId,
      packageId,
    },
  });
  const users = await prisma.user.findMany({
    where: {
      subscription: {
        packageId: packageId,
        status: "active",
      },
    },
  });
  await Promise.all(
    users.map((user) => sendNewLessonEmail(user.email, lesson.title))
  );
  return NextResponse.json({ success: true, lesson });
}
