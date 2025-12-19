"use server";

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
  // Default to localhost, but user should set this in .env for Tailscale
  const OLLAMA_URL = process.env.OLLAMA_BASE_URL || "http://localhost:11434";
  // Using the user's personal model as requested
  const MODEL = "tattzy2025/G7llama:latest"; 

  console.log("🧠 Baddie is thinking...", { model: MODEL, url: OLLAMA_URL });

  const systemPrompt = BADDIE_SYSTEM_PROMPT;

  // Formatting user input to match the "Input:" format expected by the new system prompt
  const userPrompt = `Input:
Style: ${input.style}.
Placement: ${input.placement}.
Theme: ${input.mood}.
Story 1: ${input.q1Answer}.
Story 2: ${input.q2Answer}.
Palette: ${input.colors}.
Aspect Ratio: ${input.aspectRatio}.`;

  try {
    const response = await fetch(`${OLLAMA_URL}/api/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        stream: false,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Ollama API Error:", errorText);
      throw new Error(`Ollama API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const generatedPrompt = data.message.content.trim();
    
    console.log("✨ Baddie generated prompt:", generatedPrompt);
    
    return { success: true, prompt: generatedPrompt };
  } catch (error) {
    console.error("❌ Baddie Connection Error:", error);
    return { success: false, error: "Baddie is unreachable. Check your connection." };
  }
}
