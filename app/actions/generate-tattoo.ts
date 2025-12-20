"use server";

import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export async function generateTattoo(prompt: string, aspectRatio: string = "1:1") {
  if (!process.env.REPLICATE_API_TOKEN) {
    console.error("❌ Replicate API token is missing");
    return { success: false, error: "Replicate API token is missing" };
  }

  console.log("🚀 Tattty Generation started with prompt:", prompt);

  const fullPrompt = `${prompt}, white background`;

  try {
    console.log("⏳ Running Replicate model...");

    const output = await replicate.run("tattzy25/tattty_4_all:4e8f6c1dc77db77dabaf98318cde3679375a399b434ae2db0e698804ac84919c", {
      input: {
        model: "dev",
        prompt: fullPrompt, // The prompt from Baddie with white background
        go_fast: false,
        lora_scale: 1,
        megapixels: "1",
        num_outputs: 1, // Core experience generates 1 unique masterpiece
        aspect_ratio: aspectRatio, // Dynamic based on user input
        output_format: "webp",
        guidance_scale: 3,
        output_quality: 90, // High quality for the masterpiece
        prompt_strength: 0.8,
        extra_lora_scale: 1,
        num_inference_steps: 28,
        disable_safety_checker: true,
      },
    });

    console.log("✅ Generation succeeded:", output);

    // Handle Replicate output - could be URL array or stream
    let finalOutput: string = '';
    if (Array.isArray(output)) {
      const item = output[0];
      if (typeof item === 'object' && 'url' in item && typeof item.url === 'function') {
        finalOutput = item.url().toString();
      } else if (typeof item === 'string') {
        finalOutput = item;
      } else {
        finalOutput = String(item);
      }
    } else if (typeof output === 'object' && 'url' in output && typeof output.url === 'function') {
      finalOutput = output.url().toString();
    } else if (typeof output === 'string') {
      finalOutput = output;
    } else if (output instanceof ReadableStream) {
      // Convert stream to data URL
      const chunks: Uint8Array[] = [];
      const reader = output.getReader();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
      }
      const buffer = Buffer.concat(chunks);
      const base64 = buffer.toString('base64');
      finalOutput = `data:image/webp;base64,${base64}`;
    } else {
      finalOutput = String(output);
    }

    return { success: true, output: finalOutput };

  } catch (error: any) {
    console.error("❌ Error generating tattoo:", error);
    const errorMessage = error?.message || "Unknown error";
    if (errorMessage.includes("API token")) {
      return { success: false, error: "🚨 REPLICATE API TOKEN INVALID! Check your .env.local file for REPLICATE_API_TOKEN." };
    }
    if (errorMessage.includes("model")) {
      return { success: false, error: "🚨 TATTTY MODEL UNAVAILABLE! Check Replicate for model status." };
    }
    if (errorMessage.includes("rate limit")) {
      return { success: false, error: "🚨 REPLICATE RATE LIMIT EXCEEDED! Try again later." };
    }
    return { success: false, error: `🚨 TATTTY GENERATION FAILED: ${errorMessage}. Check API token and model.` };
  }
}
