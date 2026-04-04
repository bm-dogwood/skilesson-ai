import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateSubtitles } from "@/lib/subtitles";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("🎬 MUX EVENT:", body.type);

    const asset = body.data;
    const playbackId = asset.playback_ids?.[0]?.id;
    const uploadId = asset.upload_id;

    // ── Handle video.asset.ready — update lesson metadata only ──────────────
    if (body.type === "video.asset.ready") {
      console.log("📦 Asset ID:", asset.id);
      console.log("🔗 Upload ID:", uploadId);
      console.log("▶️ Playback ID:", playbackId);

      if (!uploadId || !playbackId) {
        console.log("❌ Missing uploadId or playbackId");
        return NextResponse.json({ received: true });
      }

      try {
        await prisma.lesson.update({
          where: { uploadId },
          data: {
            playbackId,
            assetId: asset.id,
            thumbnailUrl: `https://image.mux.com/${playbackId}/thumbnail.jpg`,
            duration: Math.floor(asset.duration || 0),
          },
        });
        console.log("✅ LESSON UPDATED with video metadata");
      } catch (e: any) {
        if (e.code === "P2025") {
          console.log(
            "⚠️ No lesson found for uploadId:",
            uploadId,
            "— skipping"
          );
        } else {
          throw e;
        }
      }

      return NextResponse.json({ received: true });
    }

    // ── Handle video.asset.static_renditions.ready — NOW download + subtitle ─
    if (body.type === "video.asset.static_renditions.ready") {
      console.log("🎞️ Static renditions ready, starting subtitles...");
      console.log("📦 Asset ID:", asset.id);

      // Find lesson by assetId since this event has no upload_id
      const lesson = await prisma.lesson.findFirst({
        where: { assetId: asset.id },
      });

      if (!lesson) {
        console.log("⚠️ No lesson found for assetId:", asset.id);
        return NextResponse.json({ received: true });
      }

      if (!lesson.playbackId) {
        console.log("⚠️ Lesson has no playbackId yet");
        return NextResponse.json({ received: true });
      }

      if (lesson.subtitlesStatus === "done") {
        console.log("⏭️ Subtitles already generated, skipping");
        return NextResponse.json({ received: true });
      }

      generateSubtitles(lesson.id, lesson.playbackId)
        .then(async ({ enUrl, esUrl }) => {
          await prisma.lesson.update({
            where: { id: lesson.id },
            data: {
              subtitlesEnUrl: enUrl,
              subtitlesEsUrl: esUrl,
              subtitlesStatus: "done",
            },
          });
          console.log(`✅ SUBTITLES SAVED for lesson ${lesson.id}`);
        })
        .catch(async (err) => {
          console.error(`❌ SUBTITLE FAILED for lesson ${lesson.id}:`, err);
          await prisma.lesson.update({
            where: { id: lesson.id },
            data: { subtitlesStatus: "failed" },
          });
        });

      return NextResponse.json({ received: true });
    }

    // All other events — ignore
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("❌ WEBHOOK ERROR:", error);
    return NextResponse.json({ error: "Webhook failed" }, { status: 500 });
  }
}
