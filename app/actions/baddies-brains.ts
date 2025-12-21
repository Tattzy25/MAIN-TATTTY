"use server";

import { getSettings } from "./settings";
import { DEFAULT_SETTINGS } from "@/app/lib/settings-schema";

export async function getBaddieSystemPrompt() {
  const settings = await getSettings();
  return settings.tattty.systemPrompt || DEFAULT_SETTINGS.tattty.systemPrompt;
}
