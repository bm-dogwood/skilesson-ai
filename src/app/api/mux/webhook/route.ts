import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateSubtitles } from "@/lib/subtitles";
import Mux from "@mux/mux-node";

const mux = new Mux({
  tokenId: process.env.MUX_TOKEN_ID!,
  tokenSecret: process.env.MUX_TOKEN_SECRET!,
});

export async function POST(req: Request) {
  try {
    // ── Verify webhook signature ──────────────────────────────────────────────
    const rawBody = await req.text(); // Must read as text FIRST for signature check
    const muxSignature = req.headers.get("mux-signature");

    if (!muxSignature || !process.env.MUX_WEBHOOK_SECRET) {
      console.error("❌ Missing webhook signature or secret");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
      mux.webhooks.verifySignature(
        rawBody,
        req.headers as any,
        process.env.MUX_WEBHOOK_SECRET
      );
    } catch (err) {
      console.error("❌ Invalid webhook signature:", err);
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const body = JSON.parse(rawBody); // Parse AFTER verification
    console.log("🎬 MUX EVENT:", body.type);

    const asset = body.data;
    const playbackId = asset.playback_ids?.[0]?.id;
    const uploadId = asset.upload_id;

    // ── video.asset.ready ─────────────────────────────────────────────────────
    if (body.type === "video.asset.ready") {
      if (!uploadId || !playbackId) {
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
        if (e.code !== "P2025") throw e;
        console.log("⚠️ No lesson found for uploadId:", uploadId);
      }
      return NextResponse.json({ received: true });
    }

    // ── video.asset.static_renditions.ready ───────────────────────────────────
    if (body.type === "video.asset.static_renditions.ready") {
      const lesson = await prisma.lesson.findFirst({
        where: { assetId: asset.id },
      });

      if (!lesson?.playbackId || lesson.subtitlesStatus === "done") {
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

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("❌ WEBHOOK ERROR:", error);
    return NextResponse.json({ error: "Webhook failed" }, { status: 500 });
  }
}
