import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import Mux from "@mux/mux-node";
import { translateToSpanish } from "@/lib/translate";

const mux = new Mux({
  tokenId: process.env.MUX_TOKEN_ID!,
  tokenSecret: process.env.MUX_TOKEN_SECRET!,
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { title, description, level, sport, packageId } = await req.json();

    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    // Step 1: Create Mux upload URL
    const upload = await mux.video.uploads.create({
      new_asset_settings: {
        playback_policy: ["public"],
        mp4_support: "capped-1080p",
      },
      cors_origin: process.env.NEXTAUTH_URL!,
    });

    // Step 2: Create lesson in DB
    const lesson = await prisma.lesson.create({
      data: {
        title,
        description: description || "",
        level,
        sport,
        userId: user.id,
        packageId: packageId || null,
        uploadId: upload.id,
        subtitlesStatus: "pending",
      },
    });
    try {
      const translated = await translateToSpanish({
        title: title,
        description: description || "",
      });

      await prisma.lesson.update({
        where: { id: lesson.id },
        data: {
          titleEs: translated.title,
          descriptionEs: translated.description,
        },
      });
    } catch (err) {
      console.error("Translation failed:", err);
      // Non-blocking — lesson still saves fine without it
    }
    console.log("✅ LESSON CREATED:", lesson.id);
    console.log("🔗 MUX UPLOAD ID:", upload.id);

    return NextResponse.json({
      uploadUrl: upload.url,
      lessonId: lesson.id,
    });
  } catch (error) {
    console.error("CREATE UPLOAD ERROR:", error);
    return NextResponse.json(
      { error: "Failed to create upload" },
      { status: 500 }
    );
  }
}
