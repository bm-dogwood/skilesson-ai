import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

const OLLAMA_URL = process.env.OLLAMA_URL || "http://localhost:11434";

/* ------------------------------------------------------------------ */
/* 🧠 STEP 1: IMAGE ANALYSIS (VISION MODEL)                            */
/* ------------------------------------------------------------------ */
async function analyzeImageUrl(imageUrl: string) {
  try {
    const res = await fetch(`${OLLAMA_URL}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "llava:latest",
        prompt: `
Analyze this ski posture.

Focus on:
- stance
- balance
- alignment
- control

Keep it short and factual.
        `,
        images: [imageUrl],
        stream: false,
      }),
    });

    const data = await res.json();
    return data.response || "Basic posture detected.";
  } catch (err) {
    console.error("Vision error:", err);
    return "Basic posture detected.";
  }
}

/* ------------------------------------------------------------------ */
/* 🏂 STEP 2: AI COACH (STRUCTURED JSON)                               */
/* ------------------------------------------------------------------ */
async function generateCoachFeedback(description: string, userId: string) {
  // 🎯 Get user info
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  // 📚 Get lessons for recommendation
  const lessons = await prisma.lesson.findMany({
    where: {
      level: user?.level || undefined,
      sport: user?.sport || undefined,
    },
    take: 3,
  });

  const lessonTitles = lessons.map((l) => l.title);

  try {
    const res = await fetch(`${OLLAMA_URL}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "llama3",
        prompt: `
You are an elite ski coach.

Analyze this:
${description}

Return ONLY valid JSON:

{
  "positive": "short encouragement",
  "correction": "main issue",
  "fix": "exact actionable fix",
  "why": "why it matters",
  "lessons": ["lesson1", "lesson2"]
}



Rules:
- No markdown
- No symbols like **
- No extra text
- Keep sentences short
- Sound like a real coach

Recommended lessons you can choose from:
${lessonTitles.join(", ")}
        `,
        stream: false,
      }),
    });

    const data = await res.json();

    let parsed;

    try {
      parsed = JSON.parse(data.response);
    } catch (err) {
      console.error("JSON parse failed:", data.response);

      // 🔥 fallback (IMPORTANT)
      parsed = {
        positive: "Good effort and stable stance.",
        correction: "Balance shifts slightly forward.",
        fix: "Keep shoulders aligned over hips.",
        why: "Improves control and reduces fatigue.",
        lessons: lessonTitles.slice(0, 2),
      };
    }

    return parsed;
  } catch (err) {
    console.error("Coach error:", err);

    return {
      positive: "Good effort.",
      correction: "Needs refinement.",
      fix: "Focus on posture and balance.",
      why: "Improves skiing performance.",
      lessons: [],
    };
  }
}

/* ------------------------------------------------------------------ */
/* 🚀 MAIN API ROUTE                                                   */
/* ------------------------------------------------------------------ */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ success: false });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    /* -------------------- ☁️ Upload -------------------- */
    const uploadRes: any = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            resource_type: "auto",
            folder: "ai-coach",
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        )
        .end(buffer);
    });

    const mediaUrl = uploadRes.secure_url;
    const mediaType = uploadRes.resource_type;

    /* -------------------- 🎥 Video frame -------------------- */
    let analysisUrl = mediaUrl;
    if (mediaType === "video") {
      analysisUrl = mediaUrl.replace("/upload/", "/upload/so_1/");
    }

    /* -------------------- 🧠 AI -------------------- */
    const description = await analyzeImageUrl(analysisUrl);
    const feedback = await generateCoachFeedback(description, session.userId);

    /* -------------------- 💾 Save -------------------- */
    const submission = await prisma.aISubmission.create({
      data: {
        userId: session.userId,
        mediaUrl,
        mediaType,
        aiDescription: description,
        aiFeedback: JSON.stringify(feedback), // ✅ IMPORTANT
      },
    });

    /* -------------------- ✅ Response -------------------- */
    return NextResponse.json({
      success: true,
      data: {
        feedback,
        submissionId: submission.id,
      },
    });
  } catch (err) {
    console.error("API ERROR:", err);

    return NextResponse.json({
      success: false,
      error: "Something went wrong",
    });
  }
}
