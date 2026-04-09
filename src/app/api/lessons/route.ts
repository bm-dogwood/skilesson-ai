import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { sendNewLessonEmail } from "@/lib/email";

// ✅ GET ALL LESSONS
export async function GET(req: NextRequest) {
  // 👈 add req param
  const lang = req.nextUrl.searchParams.get("lang") || "en"; // 👈 read lang

  const lessons = await prisma.lesson.findMany({
    include: {
      user: true,
      _count: { select: { progress: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  // 👇 Localize title + description based on lang
  const localized = lessons.map((l) => ({
    ...l,
    title: lang === "es" && l.titleEs ? l.titleEs : l.title,
    description:
      lang === "es" && l.descriptionEs ? l.descriptionEs : l.description,
  }));

  return NextResponse.json({ success: true, lessons: localized });
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
