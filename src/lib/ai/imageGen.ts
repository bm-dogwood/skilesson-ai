export async function generateCorrectionImage(correction: string) {
  const res = await fetch(`${process.env.OLLAMA_URL}/api/generate`, {
    method: "POST",
    body: JSON.stringify({
      model: "stable-diffusion",
      prompt: `ski technique correction: ${correction}`,
    }),
  });

  return res;
}
