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

  try {
    console.log("⏳ Creating Replicate Prediction...");
    
    // Using the specific model version for Tattty
    const prediction = await replicate.predictions.create({
      version: "4e8f6c1dc77db77dabaf98318cde3679375a399b434ae2db0e698804ac84919c",
      input: {
        model: "dev",
        prompt: prompt, // The prompt from Baddie
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

    console.log("⏳ Prediction created, polling for results...", prediction.id);

    let finalPrediction = prediction;
    while (
      finalPrediction.status !== "succeeded" &&
      finalPrediction.status !== "failed" &&
      finalPrediction.status !== "canceled"
    ) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      finalPrediction = await replicate.predictions.get(finalPrediction.id);
    }

    if (finalPrediction.status === "succeeded") {
      console.log("✅ Prediction succeeded:", finalPrediction.output);
      return { success: true, output: finalPrediction.output };
    } else {
      console.error("❌ Prediction failed:", finalPrediction.error);
      return { success: false, error: "Prediction failed: " + finalPrediction.error };
    }

  } catch (error) {
    console.error("❌ Error generating tattoo:", error);
    return { success: false, error: "Failed to generate tattoo" };
  }
}
