import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ lessonId: string; lang: string }> }
) {
  const { lessonId, lang } = await params;

  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    select: { subtitlesEnUrl: true, subtitlesEsUrl: true },
  });

  if (!lesson) {
    return new NextResponse("Not found", { status: 404 });
  }

  const url = lang === "en" ? lesson.subtitlesEnUrl : lesson.subtitlesEsUrl;

  if (!url) {
    return new NextResponse("Subtitles not ready", { status: 404 });
  }

  const vttRes = await fetch(url);
  const vttText = await vttRes.text();

  return new NextResponse(vttText, {
    headers: {
      "Content-Type": "text/vtt",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
