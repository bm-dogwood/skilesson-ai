import { NextRequest, NextResponse } from "next/server";
import { buildPrompt } from "@/lib/ai/buildPrompt";
import { getLocalAIResponse } from "@/lib/ai/local";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, message, context } = body;

    // Validation
    if (!userId || !message) {
      return NextResponse.json(
        { success: false, error: "userId and message are required." },
        { status: 400 }
      );
    }

    if (typeof message !== "string" || message.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: "Message must be a non-empty string." },
        { status: 400 }
      );
    }

    // 👉 For MVP: treat message as "analysis text"
    const analysisText = message;

    // Build prompt
    const prompt = buildPrompt(context, analysisText);

    // 🔥 Choose ONE:

    // ✅ Claude (instead of OpenAI)
    const ai = await getLocalAIResponse(prompt);

    // Child safety filter (basic)
    let responseText = ai.text || "";

    if (context?.isChildAccount) {
      responseText = responseText.replace(
        /aggressive|dangerous/gi,
        "be careful"
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          response: responseText,
          model: ai.model,
          tokensUsed: ai.usage,
          conversationId: `conv_${Date.now()}`,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}
