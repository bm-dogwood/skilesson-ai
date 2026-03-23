import fs from "fs";
import path from "path";

export function buildPrompt(context: any, analysisText: string) {
  const system = fs.readFileSync(
    path.join(process.cwd(), "src/ai-prompts/coach-system.md"),
    "utf-8"
  );

  const sportFile =
    context?.sport === "snowboard" ? "snowboarding.md" : "skiing.md";

  const sport = fs.readFileSync(
    path.join(process.cwd(), `src/ai-prompts/${sportFile}`),
    "utf-8"
  );

  return `
${system}

${sport}

Student Context:
- Skill Level: ${context?.skillLevel || "beginner"}
- Current Module: ${context?.currentModule || "unknown"}
- Completed Lessons: ${context?.completedLessons || 0}

Student Message:
${analysisText}

Respond as a coach:
`;
}
