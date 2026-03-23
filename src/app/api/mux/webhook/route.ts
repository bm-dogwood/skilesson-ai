import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    console.log("🎬 MUX EVENT:", body.type);

    // ✅ Only handle when video is ready
    if (body.type !== "video.asset.ready") {
      return NextResponse.json({ received: true });
    }

    const asset = body.data;

    const playbackId = asset.playback_ids?.[0]?.id;
    const uploadId = asset.upload_id;

    console.log("📦 Asset ID:", asset.id);
    console.log("🔗 Upload ID:", uploadId);
    console.log("▶️ Playback ID:", playbackId);

    // ❗ Safety checks
    if (!uploadId) {
      console.log("❌ Missing uploadId");
      return NextResponse.json({ received: true });
    }

    if (!playbackId) {
      console.log("⏳ Playback not ready yet");
      return NextResponse.json({ received: true });
    }

    // ✅ Update lesson with REAL video data
    const updatedLesson = await prisma.lesson.update({
      where: {
        uploadId: uploadId, // must be unique
      },
      data: {
        playbackId: playbackId,
        assetId: asset.id,
        thumbnailUrl: `https://image.mux.com/${playbackId}/thumbnail.jpg`,
        duration: Math.floor(asset.duration || 0),
      },
    });

    console.log("✅ LESSON UPDATED:", updatedLesson.id);

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("❌ WEBHOOK ERROR:", error);
    return NextResponse.json({ error: "Webhook failed" }, { status: 500 });
  }
}
