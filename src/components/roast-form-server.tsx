"use server";

import { redirect } from "next/navigation";
import { db } from "@/db";
import { roasts, submissions } from "@/db/schema";
import { RoastFormClient } from "./roast-form-client";

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_MODEL = "nvidia/nemotron-3-super-120b-a12b:free";

interface RoastResult {
  content: string;
  suggestedFix: string;
  score: number;
}

async function generateRoastWithAI(
  code: string,
  language: string,
  roastMode: string,
): Promise<RoastResult> {
  const systemPrompt =
    roastMode === "helpful"
      ? `You are a helpful code review assistant. Analyze the user's code and provide constructive, educational feedback. Focus on explaining what's wrong, why it's problematic, and how to improve it. Be encouraging and educational.`
      : `You are a "roast" style code reviewer. Your job is to humorously, sarcastically, but still accurately roast terrible code. Be brutally honest, use humor, and make it entertaining. Use programming jokes and memes. But still point out real issues.`;

  const userPrompt = `Analyze this ${language} code and provide a roast (or helpful review):

\`\`\`${language}
${code}
\`\`\`

Respond in JSON format with exactly this structure:
{
  "roast": "your roast message here (2-3 sentences)",
  "score": a number from 0-10 based on code quality (0 = worst, 10 = perfect),
  "suggestedFix": "improved version of the code with fixes applied (in the same language as the original)"
}`;

  try {
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          "HTTP-Referer": "http://localhost:3000",
          "X-Title": "devroast",
        },
        body: JSON.stringify({
          model: OPENROUTER_MODEL,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
          response_format: {
            type: "json_schema",
            json_schema: {
              name: "roast_response",
              schema: {
                type: "object",
                properties: {
                  roast: { type: "string" },
                  suggestedFix: { type: "string" },
                  score: { type: "integer" },
                },
                required: ["roast", "suggestedFix", "score"],
              },
            },
          },
        }),
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenRouter API error:", response.status, errorText);
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    const parsed = JSON.parse(content);

    return {
      content: parsed.roast,
      suggestedFix: parsed.suggestedFix || "",
      score: Math.min(10, Math.max(0, parsed.score)),
    };
  } catch (error) {
    console.error("AI roast generation failed:", error);
    throw error;
  }
}

export async function submitRoastAction(formData: FormData) {
  const code = formData.get("code") as string;
  const language = (formData.get("language") as string) || "javascript";
  const roastMode = (formData.get("roastMode") as string) || "sarcastic";

  if (!code || code.trim().length === 0) {
    return { error: "Code is required" };
  }

  const [submission] = await db
    .insert(submissions)
    .values({
      code,
      language: language as (typeof submissions.language.enumValues)[number],
      roastMode: roastMode as (typeof submissions.roastMode.enumValues)[number],
    })
    .returning();

  let roastContent: string;
  let suggestedFix: string;
  let score: number;

  try {
    const aiResult = await generateRoastWithAI(code, language, roastMode);
    roastContent = aiResult.content;
    suggestedFix = aiResult.suggestedFix;
    score = aiResult.score;
  } catch {
    roastContent =
      roastMode === "helpful"
        ? "I tried to analyze your code but something went wrong. Please try again!"
        : "Wow, even the AI refused to review this code. That's saying something.";
    suggestedFix = "";
    score = 0;
  }

  const [roast] = await db
    .insert(roasts)
    .values({
      submissionId: submission.id,
      roastContent,
      suggestedFix,
      score,
      roastMode: roastMode as (typeof roasts.roastMode.enumValues)[number],
    })
    .returning();

  redirect(`/roast/${roast.id}`);
}

export async function RoastFormServer() {
  return <RoastFormClient action="/api/roast" />;
}
