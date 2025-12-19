export const FONT_STYLES = [
  "Gothic/Blackletter",
  "Chicano/LA Style",
  "Traditional/Old School",
  "Script/Cursive",
  "Graffiti/Street",
  "Tribal",
  "Japanese Brush",
  "Victorian/Ornate",
  "Minimalist/Fine Line",
  "Hand-poked/Stick & Poke"
] as const;

export type FontStyle = typeof FONT_STYLES[number];

export const UI_TEXT = {
  title: "Font Forge",
  subtitle: "Your words, forged into timeless ink. Precision lettering for the bold.",
  enterTextLabel: "The Words You Carry",
  enterTextPlaceholder: "What needs to be written?",
  selectColorLabel: "Ink Palette",
  selectStyleLabel: "Calligraphy Style",
  selectStylePlaceholder: "Choose your script...",
  black: "Pure Black",
  colors: "Vivid Color",
  customizeLabel: "The Soul of the Script",
  customizePlaceholder: "Describe the weight, the flow, the hidden details...",
  generateButton: "Forge the Ink",
  generating: "Forging...",
} as const;
