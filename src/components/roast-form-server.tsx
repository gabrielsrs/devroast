"use server";

import { redirect } from "next/navigation";
import { db } from "@/db";
import { roasts, submissions } from "@/db/schema";
import { RoastFormClient } from "./roast-form-client";

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

  const mockRoastContent = generateMockRoast(code, roastMode);
  const mockScore = Math.floor(Math.random() * 10);

  const [roast] = await db
    .insert(roasts)
    .values({
      submissionId: submission.id,
      roastContent: mockRoastContent,
      score: mockScore,
      roastMode: roastMode as (typeof roasts.roastMode.enumValues)[number],
    })
    .returning();

  redirect(`/roast/${roast.id}`);
}

function generateMockRoast(_code: string, mode: string): string {
  if (mode === "helpful") {
    return "Here's a helpful analysis of your code: Consider using more modern JavaScript patterns and avoid imperative loops when functional alternatives are available.";
  }
  return "Oh wow, I've seen better code written by a cat walking on a keyboard during an earthquake. Please, for the love of all that is holy, use const instead of whatever this is.";
}

export async function RoastFormServer() {
  return <RoastFormClient action="/api/roast" />;
}
