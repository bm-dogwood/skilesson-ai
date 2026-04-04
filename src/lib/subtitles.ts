import OpenAI from "openai";
import { put } from "@vercel/blob";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

function toVTT(
  segments: { start: number; end: number; text: string }[]
): string {
  const fmt = (s: number) => {
    const h = String(Math.floor(s / 3600)).padStart(2, "0");
    const m = String(Math.floor((s % 3600) / 60)).padStart(2, "0");
    const sec = String(Math.floor(s % 60)).padStart(2, "0");
    const ms = String(Math.round((s % 1) * 1000)).padStart(3, "0");
    return `${h}:${m}:${sec}.${ms}`;
  };

  const cues = segments
    .map(
      (seg, i) =>
        `${i + 1}\n${fmt(seg.start)} --> ${fmt(seg.end)}\n${seg.text.trim()}`
    )
    .join("\n\n");

  return `WEBVTT\n\n${cues}`;
}

async function transcribe(
  buffer: Buffer,
  language: "en" | "es"
): Promise<{ start: number; end: number; text: string }[]> {
  const file = new File([buffer], "video.mp4", { type: "video/mp4" });

  const result = await openai.audio.transcriptions.create({
    file,
    model: "whisper-1",
    language,
    response_format: "verbose_json",
    timestamp_granularities: ["segment"],
  });

  return (result.segments ?? []).map((seg: any) => ({
    start: seg.start,
    end: seg.end,
    text: seg.text,
  }));
}

export async function generateSubtitles(
  lessonId: string,
  playbackId: string
): Promise<{ enUrl: string; esUrl: string }> {
  // Download the video from Mux
  const videoUrl = `https://stream.mux.com/${playbackId}/capped-1080p.mp4`;
  const res = await fetch(videoUrl);
  if (!res.ok) throw new Error(`Failed to download video: ${res.status}`);
  const buffer = Buffer.from(await res.arrayBuffer());

  // English
  console.log(`[subtitles] Transcribing EN for lesson ${lessonId}`);
  const enVTT = toVTT(await transcribe(buffer, "en"));
  const { url: enUrl } = await put(`subtitles/${lessonId}/en.vtt`, enVTT, {
    access: "public",
    contentType: "text/vtt",
  });

  // Spanish
  console.log(`[subtitles] Transcribing ES for lesson ${lessonId}`);
  const esVTT = toVTT(await transcribe(buffer, "es"));
  const { url: esUrl } = await put(`subtitles/${lessonId}/es.vtt`, esVTT, {
    access: "public",
    contentType: "text/vtt",
  });

  return { enUrl, esUrl };
}
