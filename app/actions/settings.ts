"use server";

import fs from "fs/promises";
import path from "path";
import { DEFAULT_SETTINGS, type TatttySettings } from "@/app/lib/settings-schema";

const SETTINGS_FILE = path.join(process.cwd(), "tattty-settings.json");

export async function getSettings(): Promise<TatttySettings> {
  try {
    const data = await fs.readFile(SETTINGS_FILE, "utf-8");
    const parsed = JSON.parse(data);

    const settings: TatttySettings = {
      ...DEFAULT_SETTINGS,
      tattty: { ...DEFAULT_SETTINGS.tattty, ...parsed.tattty },
      lists: { ...DEFAULT_SETTINGS.lists, ...parsed.lists },
      providers: { ...DEFAULT_SETTINGS.providers, ...parsed.providers },
    };

    return settings;
  } catch (error) {
    // If settings file doesn't exist or is invalid, return default settings
    if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
      // Settings file doesn't exist, return default settings
      return DEFAULT_SETTINGS;
    }
    
    // For other errors (like JSON parse errors), still return default settings
    console.error('Error loading settings:', error);
    return DEFAULT_SETTINGS;
  }
}

export async function saveSettings(settings: TatttySettings) {
  const settingsToSave = JSON.parse(JSON.stringify(settings));

  await fs.writeFile(SETTINGS_FILE, JSON.stringify(settingsToSave, null, 2));
  return { success: true };
}
