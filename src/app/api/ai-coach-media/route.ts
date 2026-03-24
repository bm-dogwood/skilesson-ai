import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

const OLLAMA_URL = process.env.OLLAMA_URL || "http://localhost:11434";

// 🧠 AI Image Analysis (using URL)
async function analyzeImageUrl(imageUrl: string) {
  try {
    const res = await fetch(`${OLLAMA_URL}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "llava:latest",
        prompt: "Describe ski posture issues briefly.",
        images: [imageUrl],
        stream: false,
        options: { num_predict: 80 },
      }),
    });

    const data = await res.json();
    return data.response || "No analysis.";
  } catch (err) {
    console.error(err);
    return "AI analysis failed.";
  }
}

// 🏂 Coaching
async function generateCoachFeedback(description: string) {
  try {
    const res = await fetch(`${OLLAMA_URL}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "llama3",
        prompt: `
You are a ski coach.

Based on:
${description}

Give:
- 1 positive
- 1 correction
- 1 actionable tip
Short.
        `,
        stream: false,
      }),
    });

    const data = await res.json();
    return data.response || description;
  } catch {
    return description;
  }
}

export async function POST(req: NextRequest) {
  try {
    // 🔐 Auth
    const session = await getServerSession(authOptions);

    if (!session?.userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }
    console.log({
      cloud: process.env.CLOUDINARY_CLOUD_NAME,
      key: process.env.CLOUDINARY_API_KEY,
    });
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ success: false });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // ☁️ STEP 1: Upload to Cloudinary
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

    // 🎥 If video → use thumbnail frame
    let analysisUrl = mediaUrl;
    if (mediaType === "video") {
      analysisUrl = mediaUrl.replace("/upload/", "/upload/so_1/");
    }

    // 🧠 STEP 2: AI
    const description = await analyzeImageUrl(analysisUrl);

    // 🏂 STEP 3: Feedback
    const feedback = await generateCoachFeedback(description);

    // 💾 STEP 4: Save to DB
    const submission = await prisma.aISubmission.create({
      data: {
        userId: session.userId,
        mediaUrl,
        mediaType,
        aiDescription: description,
        aiFeedback: feedback,
      },
    });

    // ✅ RESPONSE
    return NextResponse.json({
      success: true,
      data: {
        aiDescription: description,
        aiFeedback: feedback,
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
