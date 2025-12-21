"use server";

import Replicate from "replicate";
import { getSettings } from "./settings";

import { writeLog } from "@/app/lib/logger";

export async function generateTattoo(prompt: string, aspectRatio: string = "1:1", requestId?: string) {
  const settings = await getSettings();
  const rId = requestId || `req_${Math.random().toString(36).substring(7)}`;

  await writeLog({
      requestId: rId,
      type: 'info',
      source: 'Replicate',
      message: 'Starting Image Generation',
      details: { prompt, aspectRatio }
  });

  const token = settings.providers.replicate.apiKey;

  if (!token) {
    const errorMsg = "Replicate API token is missing";
    console.error("❌ " + errorMsg);
    await writeLog({ requestId: rId, type: 'error', source: 'Replicate', message: errorMsg });
    return { success: false, error: errorMsg };
  }

  if (!settings.tattty.generationModel) {
    const errorMsg = "Replicate generation model is not configured in settings.";
    console.error("❌ " + errorMsg);
    await writeLog({ requestId: rId, type: 'error', source: 'Replicate', message: errorMsg });
    return { success: false, error: errorMsg };
  }

  console.log("🚀 Tattty Generation started with prompt:", prompt);
  await writeLog({ requestId: rId, type: 'info', source: 'Replicate', message: `Model: ${settings.tattty.generationModel}` });

  const fullPrompt = prompt;

  const replicateAspectRatio = aspectRatio;

  if (!replicateAspectRatio) {
    const errorMsg = "Aspect Ratio is missing in request.";
    console.error("❌ " + errorMsg);
    await writeLog({ requestId: rId, type: 'error', source: 'Replicate', message: errorMsg });
    return { success: false, error: "Configuration Error: Aspect Ratio is missing." };
  }

  try {
    console.log(`⏳ Running custom LoRA model on Replicate... (Ratio: ${replicateAspectRatio})`);

    const replicate = new Replicate({
      auth: token,
    });
    
    const input: any = {
      prompt: fullPrompt,
      aspect_ratio: replicateAspectRatio,
      model: settings.tattty.model,
      guidance_scale: settings.tattty.guidance_scale,
      num_inference_steps: settings.tattty.num_inference_steps,
      num_outputs: settings.tattty.num_outputs,
      output_format: settings.tattty.output_format,
      output_quality: settings.tattty.output_quality,
      disable_safety_checker: settings.tattty.disable_safety_checker,
      go_fast: settings.tattty.go_fast,
      megapixels: settings.tattty.megapixels,
      lora_scale: settings.tattty.lora_scale,
      extra_lora_scale: settings.tattty.extra_lora_scale,
      prompt_strength: settings.tattty.prompt_strength,
    };

    if (settings.tattty.extra_lora) input.extra_lora = settings.tattty.extra_lora;
    if (settings.tattty.seed) input.seed = settings.tattty.seed;
    if (settings.tattty.mask) input.mask = settings.tattty.mask;
    if (settings.tattty.image) input.image = settings.tattty.image;
    
    if (replicateAspectRatio === 'custom') {
        if (settings.tattty.width) input.width = settings.tattty.width;
        if (settings.tattty.height) input.height = settings.tattty.height;
    }

    const result = await replicate.run(settings.tattty.generationModel as any, {
      input: input
    });

    console.log("✅ Generation succeeded:", result);

    const output = result as any[];
    if (output && output.length > 0) {
      const imageUrls = output.map(item => item.url());
      await writeLog({ requestId: rId, type: 'image', source: 'Replicate', message: 'Images Generated', details: { urls: imageUrls } });
      return { success: true, output: imageUrls };
    } else {
      await writeLog({ requestId: rId, type: 'error', source: 'Replicate', message: 'No image returned from model' });
      return { success: false, error: "No image generated" };
    }

  } catch (error: any) {
    console.error("❌ Error generating tattoo:", error);
    const errorMessage = error?.message;
    
    await writeLog({ requestId: rId, type: 'error', source: 'Replicate', message: 'Generation Failed', details: { error: errorMessage } });

    if (errorMessage?.includes("API key") || errorMessage?.includes("auth")) {
      return { success: false, error: "🚨 REPLICATE API KEY INVALID! Check your settings." };
    }
    if (errorMessage?.includes("model")) {
      return { success: false, error: "🚨 CUSTOM LORA MODEL UNAVAILABLE! Check Replicate for model status." };
    }
    if (errorMessage?.includes("rate limit")) {
      return { success: false, error: "🚨 REPLICATE RATE LIMIT EXCEEDED! Try again later." };
    }
    return { success: false, error: `🚨 TATTOO GENERATION FAILED: ${errorMessage}. Check API key and model.` };
  }
}
