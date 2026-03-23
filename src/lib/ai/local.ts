export async function getLocalAIResponse(prompt: string) {
  const res = await fetch("http://localhost:11434/api/generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "llama3",
      prompt,
      stream: false,
    }),
  });

  const data = await res.json();

  console.log("OLLAMA RAW:", data); // 👈 DEBUG

  return {
    text: data.response || data.message || "No response from model",
    model: "llama3-local",
    usage: null,
  };
}
