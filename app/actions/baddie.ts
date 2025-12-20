"use server";

import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";
import { BADDIE_SYSTEM_PROMPT } from "./baddies-brains";

interface BaddieInput {
  style: string;
  colors: string;
  placement: string;
  aspectRatio: string;
  mood: string;
  q1Answer: string; // Pain
  q2Answer: string; // Memory
}

export async function askBaddie(input: BaddieInput) {
  if (!process.env.OPENAI_API_KEY) {
    console.error("❌ OpenAI API key is missing");
    return { success: false, error: "OpenAI API key is missing" };
  }

  const MODEL = "gpt-4o";

  console.log("🧠 Baddie is thinking with OpenAI...", { model: MODEL });

  const systemPrompt = BADDIE_SYSTEM_PROMPT;

  // Formatting user input to match the "Input:" format expected by the system prompt
  const userPrompt = `Input:
Style: ${input.style}.
Placement: ${input.placement}.
Theme: ${input.mood}.
Story 1: ${input.q1Answer}.
Story 2: ${input.q2Answer}.
Palette: ${input.colors}.
Aspect Ratio: ${input.aspectRatio}.`;

  try {
    const { text } = await generateText({
      model: openai(MODEL),
      system: systemPrompt,
      prompt: userPrompt,
    });

    const generatedPrompt = text.trim();

    console.log("✨ Baddie generated prompt:", generatedPrompt);

    return { success: true, prompt: generatedPrompt };
  } catch (error: any) {
    console.error("❌ Baddie Connection Error:", error);
    const errorMessage = error?.message || "Unknown error";
    if (errorMessage.includes("API key")) {
      return { success: false, error: "🚨 OPENAI API KEY INVALID! Check your .env.local file for OPENAI_API_KEY." };
    }
    if (errorMessage.includes("rate limit")) {
      return { success: false, error: "🚨 OPENAI RATE LIMIT EXCEEDED! Try again later." };
    }
    if (errorMessage.includes("model")) {
      return { success: false, error: "🚨 GPT-4O MODEL UNAVAILABLE! Contact support." };
    }
    return { success: false, error: `🚨 BADDIE FAILED: ${errorMessage}. Check connection and API key.` };
  }
}
