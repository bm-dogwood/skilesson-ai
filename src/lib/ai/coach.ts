export async function generateCoachFeedback(description: string) {
  const res = await fetch(`${process.env.OLLAMA_URL}/api/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "llama3",
      prompt: `
  You are an elite ski coach.
  
  Analyze:
  ${description}
  
  Return JSON:
  {
    "positive": "",
    "issue": "",
    "correction": "",
    "analogy": "",
    "drill": "",
    "focusArea": "balance | posture | turning | control"
  }
        `,
      stream: false,
    }),
  });

  const data = await res.json();

  try {
    return JSON.parse(data.response);
  } catch {
    return null;
  }
}
