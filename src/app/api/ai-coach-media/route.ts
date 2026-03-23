import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import ffmpeg from "fluent-ffmpeg";

const OLLAMA_URL = process.env.OLLAMA_URL || "http://localhost:11434";

// 🧠 Analyze image (FIXED: timeout + lighter model)
async function analyzeImage(buffer: Buffer) {
  const base64 = buffer.toString("base64");

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 120000); // 2 min

  try {
    const res = await fetch(`${OLLAMA_URL}/api/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.SECRET_KEY || "",
      },
      body: JSON.stringify({
        model: "llava:latest",
        prompt: "Describe ski posture issues briefly.", // ✅ shorter prompt
        images: [base64],
        stream: false,
        options: {
          num_predict: 80, // ✅ limit output
        },
      }),
      signal: controller.signal,
    });

    const data = await res.json();
    return data.response || "";
  } catch (err) {
    console.error("Image analysis error:", err);
    return "Could not analyze image.";
  } finally {
    clearTimeout(timeout);
  }
}

// 🎥 Extract frames (FIXED: only 1 frame)
function extractFrames(videoPath: string): Promise<string[]> {
  return new Promise((resolve, reject) => {
    const frames: string[] = [];

    ffmpeg(videoPath)
      .on("end", () => resolve(frames))
      .on("error", reject)
      .screenshots({
        count: 1, // ✅ BIG speed improvement
        folder: "/tmp",
        filename: "frame-%i.png",
      })
      .on("filenames", (names) => {
        names.forEach((name) => frames.push(`/tmp/${name}`));
      });
  });
}

// 🧠 Video analysis
async function analyzeVideo(buffer: Buffer) {
  const tempPath = `/tmp/video-${Date.now()}.mp4`;
  fs.writeFileSync(tempPath, buffer);

  const frames = await extractFrames(tempPath);

  const analyses = await Promise.all(
    frames.map((frame) => {
      const imgBuffer = fs.readFileSync(frame);
      return analyzeImage(imgBuffer);
    })
  );

  return analyses.join("\n");
}

// 🏂 Coaching (OPTIONAL — can skip for speed)
async function generateCoachFeedback(description: string) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 120000);

  try {
    const res = await fetch(`${OLLAMA_URL}/api/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.SECRET_KEY || "",
      },
      body: JSON.stringify({
        model: "llama3",
        prompt: `
You are a professional ski/snowboard coach.

Based on this:
${description}

Give:
- 1 positive
- 1 correction
- 1 actionable tip

Keep it short and clear.
        `,
        stream: false,
        options: {
          num_predict: 100,
        },
      }),
      signal: controller.signal,
    });

    const data = await res.json();
    return data.response || "";
  } catch (err) {
    console.error("Coach error:", err);
    return description; // fallback
  } finally {
    clearTimeout(timeout);
  }
}

// 🚀 MAIN API
export async function POST(req: NextRequest) {
  try {
    // 🔐 Security
    const key = req.nextUrl.searchParams.get("key");
    console.log("URL KEY:", key);
    console.log("ENV KEY:", process.env.SECRET_KEY);
    if (key !== process.env.SECRET_KEY) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({
        success: false,
        error: "No file uploaded",
      });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const mime = file.type;

    let description = "";

    // 🖼️ Image
    if (mime.startsWith("image")) {
      description = await analyzeImage(buffer);
    }

    // 🎥 Video
    else if (mime.startsWith("video")) {
      description = await analyzeVideo(buffer);
    } else {
      return NextResponse.json({
        success: false,
        error: "Unsupported file type",
      });
    }

    // ⚡ FAST MODE (skip second AI call if needed)
    const feedback = await generateCoachFeedback(description);
    // 👉 For ultra-fast:
    // const feedback = description;

    return NextResponse.json({
      success: true,
      data: {
        aiDescription: description,
        aiFeedback: feedback,
        instructorFeedback: null,
      },
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json({
      success: false,
      error: "Processing failed",
    });
  }
}
