export async function analyzeImageUrl(imageUrl: string) {
  const res = await fetch(`${process.env.OLLAMA_URL}/api/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "llava:latest",
      prompt: "Describe ski posture issues briefly.",
      images: [imageUrl],
      stream: false,
    }),
  });

  const data = await res.json();
  return data.response;
}
