import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function translateToSpanish(texts: Record<string, string>) {
  const entries = Object.entries(texts);

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `You are a professional translator for a ski coaching platform. 
Translate the given fields to Spanish. Keep ski/sports terminology accurate.
Return ONLY valid JSON with the same keys, no extra text.`,
      },
      {
        role: "user",
        content: `Translate these to Spanish:\n${JSON.stringify(texts)}`,
      },
    ],
  });

  const raw = response.choices[0].message.content ?? "{}";
  const clean = raw.replace(/```json|```/g, "").trim();

  try {
    return JSON.parse(clean) as Record<string, string>;
  } catch {
    return {};
  }
}
