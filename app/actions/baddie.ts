"use server";

import { openai, createOpenAI } from "@ai-sdk/openai";
import { generateText } from "ai";
import { getSettings } from "./settings";

import { writeLog } from "@/app/lib/logger";

interface BaddieInput {
  style: string;
  colors: string;
  placement: string;
  aspectRatio: string;
  mood: string;
  q1Answer: string;
  q2Answer: string;
  q1Question?: string; // Add question context
  q2Question?: string; // Add question context
  requestId?: string;
}

export async function askBaddie(input: BaddieInput) {
  const settings = await getSettings();
  const requestId = input.requestId || `req_${Math.random().toString(36).substring(7)}`;

  await writeLog({
      requestId,
      type: 'info',
      source: 'Baddie',
      message: 'Processing User Input',
      details: input
  });

  const apiKey = settings.providers.openai.apiKey || process.env.OPENAI_API_KEY;

  if (!apiKey) {
    const errorMsg = "OpenAI API key is missing";
    console.error("❌ " + errorMsg);
    await writeLog({ requestId, type: 'error', source: 'Baddie', message: errorMsg });
    return { success: false, error: errorMsg };
  }

  // Determine LLM Provider and Model
  const llmProvider = settings.tattty.llmProvider;
  const llmModel = settings.tattty.llmModel;
  const llmBaseUrl = settings.tattty.llmBaseUrl;

  if (!llmProvider) {
    const errorMsg = "LLM Provider is not configured in settings.";
    console.error("❌ " + errorMsg);
    await writeLog({ requestId, type: 'error', source: 'Baddie', message: errorMsg });
    return { success: false, error: errorMsg };
  }

  if (!llmModel) {
    const errorMsg = "LLM Model is not configured in settings.";
    console.error("❌ " + errorMsg);
    await writeLog({ requestId, type: 'error', source: 'Baddie', message: errorMsg });
    return { success: false, error: errorMsg };
  }

  console.log(`🧠 Baddie is thinking... Provider: ${llmProvider}, Model: ${llmModel}`);
  await writeLog({ requestId, type: 'info', source: 'Baddie', message: `Initializing LLM: ${llmProvider}/${llmModel}` });

  let modelInstance;
  // ... rest of the code ...

  if (llmProvider === "custom" && llmBaseUrl) {
    // Custom OpenAI-compatible provider (e.g. Groq, Together, Local)
    // We use the same API Key field for simplicity, or the user can rely on the Base URL if no key is needed (though apiKey is required by SDK usually)
    const customOpenAI = createOpenAI({
      baseURL: llmBaseUrl,
      apiKey: apiKey, 
    });
    modelInstance = customOpenAI(llmModel);
  } else {
    // Standard OpenAI
    // We must use createOpenAI to pass the dynamic apiKey
    const standardOpenAI = createOpenAI({
      apiKey: apiKey,
    });
    modelInstance = standardOpenAI(llmModel);
  }

  const systemPrompt = settings.tattty.systemPrompt;

  // Formatting user input to match the "Input:" format expected by the system prompt
  // REMOVED Aspect Ratio and Placement from here to prevent LLM from baking it into the visual prompt
  const userPrompt = `Input:
Style: ${input.style}.
Theme: ${input.mood}.
Question 1: ${input.q1Question || "Story 1 Context"}
Answer 1: ${input.q1Answer}.
Question 2: ${input.q2Question || "Story 2 Context"}
Answer 2: ${input.q2Answer}.
Palette: ${input.colors}.`;

  try {
    const { text } = await generateText({
      model: modelInstance,
      system: systemPrompt,
      prompt: userPrompt,
    });

    const generatedPrompt = text.trim();

    console.log("✨ Baddie generated prompt:", generatedPrompt);
    await writeLog({ requestId, type: 'prompt', source: 'Baddie', message: 'Prompt Generated Successfully', details: { prompt: generatedPrompt } });

    return { success: true, prompt: generatedPrompt };
  } catch (error: any) {
    console.error("❌ Baddie Connection Error:", error);
    const errorMessage = error?.message || "Unknown error";
    
    await writeLog({ requestId, type: 'error', source: 'Baddie', message: 'LLM Generation Failed', details: { error: errorMessage } });
    
    if (errorMessage.includes("401") || errorMessage.includes("API key")) {
      return { success: false, error: "🚨 API KEY INVALID! Check your settings." };
    }
    if (errorMessage.includes("429") || errorMessage.includes("rate limit")) {
      return { success: false, error: "🚨 RATE LIMIT EXCEEDED! Try again later." };
    }
    if (errorMessage.includes("404") || errorMessage.includes("model")) {
      return { success: false, error: `🚨 MODEL '${llmModel}' NOT FOUND! Check your settings.` };
    }
    
    return { success: false, error: `🚨 BADDIE FAILED: ${errorMessage}` };
  }
}
