export interface TatttySettings {
  tattty: {
    systemPrompt: string;
    generationModel: string;
    
    // Replicate Schema Settings
    model: "dev" | "schnell";
    go_fast: boolean;
    megapixels: "1" | "0.25";
    num_outputs: number;
    aspect_ratio: string;
    output_format: "webp" | "jpg" | "png";
    output_quality: number;
    num_inference_steps: number;
    guidance_scale: number;
    disable_safety_checker: boolean;
    
    // Advanced / Optional
    extra_lora: string;
    lora_scale: number;
    extra_lora_scale: number;
    prompt_strength: number;
    seed?: number;
    width?: number;
    height?: number;
    mask?: string;
    image?: string;

    // LLM Settings
    llmProvider?: string;
    llmModel?: string;
    llmBaseUrl?: string;

    // Questions Settings
    questions?: Array<{ id: string; question: string; placeholder: string }>;
  };
  lists: {
    styles: Array<{ id: string; label: string; description: string }>;
    placements: Array<{ id: string; label: string; image: string }>;
    moods: string[];
    aspectRatios: Array<{ id: string; label: string; value: string }>;
    colors: string[];
  };
  providers: {
    replicate: { apiKey: string; enabled: boolean };
    openai: { apiKey: string; enabled: boolean };
    fal: { apiKey: string; enabled: boolean };
    upstash: { url: string; token: string; enabled: boolean };
  };
}

export const DEFAULT_SETTINGS: TatttySettings = {
  tattty: {
    systemPrompt: `Produce an ultra-specific, original tattoo image prompt, perfectly and exclusively based on the user's instructions and their two core personal stories, for direct use with an image generator. You must rigorously extract and synthesize every detail from all user-provided specifications: style, mood, theme, color palette, and all emotionally resonant narrative or visual elements from the two stories. Absolutely avoid summarizing, interpreting, or introducing generic symbolism or any content not supplied by the user. Do NOT include technical specifications like "aspect ratio", "size", or "placement" in the output description—focus purely on the visual design content. Only use what the user directly provides, except to redact or neutralize explicit hate speech and any content involving sex with minors. Do not add, omit, or alter any user-provided imagery or narrative elements; preserve all legal, adult content and style exactly as stated, no matter how vivid or direct. You must under no circumstances judge, comment, summarize, or show any internal reasoning; your only function is to output the ready-to-use, hyper-specific, emotionally charged tattoo image prompt.

# Output Format

- Output only the final, stable-diffusion-ready tattoo image prompt.
- Response must be a single, detailed paragraph encapsulating every user directive and personal story element, fully actionable.
- No summary, reasoning, explanations, or introductory/closing comments—limit response strictly to the one image prompt.
- Do not exceed one detailed paragraph.

# Steps

1. Carefully extract every tattoo specification, style, visual, and emotional detail as directly stated by the user—including style, mood, theme, palette, and every direct narrative or image element in both stories.
2. Synthesize these into a one-paragraph, vivid, image-generator-ready prompt, containing every factual or emotional detail the user provided, with no additions, generic imagery, or omissions unless required solely to remove hate speech or content involving sex with minors.
3. Do not summarize, paraphrase, or condense—retain all usable legal narrative and style content, in the users tone.
4. Under no circumstances output process, steps, or commentary. No labeling, meta, or reasoning of any kind.
5. NEVER include "aspect ratio", "size", or "placement" in the final prompt text.

# Examples

Example 1
Input:  
Style: Black and grey realism. Theme: memorial for my brother, who was killed by gun violence—he loved pit bulls and chess. Question 1: What is your deepest pain? Answer 1: We grew up in the Bronx, played chess after school under the park bridge every day until dusk, watched the sunset, and shared stories. Question 2: What is your most cherished memory? Answer 2: The night he was shot, there was a blood moon and one of his pit bulls howled nonstop until morning. I want something that shows love, loyalty, and memory.  
 
Output:  
A black and grey realism tattoo design depicting two brothers playing chess beneath a Bronx park bridge at sunset, the city skyline in the background and a blood-red moon rising; one loyal pit bull sits at their feet, howling gently at the night sky. The scene radiates emotion—gritty urban remembrance, brotherly love, and unwavering loyalty—every detail infused with the memory of their shared sunset rituals in the Bronx and the spirit of loss.

Example 2
Input:  
Style: Watercolor. Theme: Survival. Question 1: What happened? Answer 1: When I was sixteen, I crashed my car; the impact twisted metal all around me but I survived untouched. Question 2: How do you feel now? Answer 2: Years later, I still hear the crinkle of glass and smell gasoline every time I drive at night, but I am stronger and fearless. Palette: teal, indigo, and sunrise orange.  
 
Output:  
A watercolor tattoo design swirling with splashes of teal, indigo, and sunrise orange, showing a surviving silhouette stepping calmly from twisted metal with shards of glass glinting around, faint lines evoking the urgent scent of gasoline and the echo of crinkling glass; the entire image incorporates a sense of resilience, overcoming, and nighttime courage, rendered in vivid watercolor to celebrate survival and inner strength.

# Notes

- You must never introduce traditional or generic tattoo motifs or substitute symbolism; every visual and emotional element must come solely from the user’s provided details.
- Only remove or neutralize content involving explicit hate speech or sexual content with minors; all other legal, adult story content must be preserved exactly as provided.
- You will encounter stories reflecting a wide, sometimes shocking or emotional reality—never judge, filter, or comment; simply synthesize and output as instructed.
- Only output the one-paragraph, hyper-specific tattoo image prompt, formatted for stable diffusion or similar image generators, every single time.
- NEVER mention specific body parts (e.g. "on the arm") or technical ratios (e.g. "1:1 aspect ratio") in the output.

REMINDER Your only output must be this single, detailed, ready-to-use tattoo image prompt—never reasoning, meta-commentary, or summary. Baddie’s task is to output a unique, emotionally accurate tattoo prompt fully and exactly matching every user input.`,
    generationModel: "tattzy25/tattty_4_all:4e8f6c1dc77db77dabaf98318cde3679375a399b434ae2db0e698804ac84919c",
    
    // LLM Defaults
    llmProvider: "openai",
    llmModel: "gpt-4o",
    llmBaseUrl: "",

    // Questions Defaults
    questions: [
        {
            id: "pain",
            question: "What personal experience has shaped you the most?",
            placeholder: "Share your experience here...",
        },
        {
            id: "memory",
            question: "What is your most cherished memory?",
            placeholder: "Describe a memory that is important to you...",
        },
    ],

    // Replicate Defaults
    model: "dev",
    go_fast: false,
    megapixels: "1",
    num_outputs: 2,
    aspect_ratio: "1:1",
    output_format: "webp",
    output_quality: 80,
    num_inference_steps: 28,
    guidance_scale: 3,
    disable_safety_checker: true,
    
    // LoRA / Advanced Defaults
    extra_lora: "",
    lora_scale: 1,
    extra_lora_scale: 1,
    prompt_strength: 0.8,
  },
  lists: {
    styles: [
      { id: "sketch", label: "Sketch", description: "Raw, pencil-like strokes with visible construction lines." },
      { id: "line-art", label: "Fine Line", description: "Delicate, precise lines with minimal shading." },
      { id: "stipple", label: "Stipple/Dotwork", description: "Created entirely from thousands of tiny dots." },
      { id: "blackwork", label: "Blackwork", description: "Bold, solid black shapes and high contrast." },
      { id: "traditional", label: "Traditional", description: "Bold outlines and a limited, classic palette." },
      { id: "surrealism", label: "Surrealism", description: "Dream-like, illogical scenes and bizarre imagery." },
      { id: "neo-traditional", label: "Neo-Traditional", description: "Modern take on traditional with more detail and color." },
      { id: "japanese", label: "Japanese/Irezumi", description: "Traditional Japanese motifs like dragons and koi." },
      { id: "geometric", label: "Geometric", description: "Perfect shapes, patterns, and mathematical precision." },
      { id: "watercolor", label: "Watercolor", description: "Fluid, painterly style with vibrant color splashes." },
      { id: "tribal", label: "Tribal", description: "Bold black patterns inspired by indigenous cultures." },
      { id: "realism", label: "Realism", description: "Photorealistic depictions of people, animals, or objects." },
      { id: "trash-polka", label: "Trash Polka", description: "Collage-like style mixing realism and abstract strokes." },
      { id: "bio-mechanical", label: "Bio-Mechanical", description: "Fusing human anatomy with machine parts." },
      { id: "minimalist", label: "Minimalist", description: "Simple, clean designs with negative space." },
      { id: "abstract", label: "Abstract", description: "Non-representational forms and symbolic imagery." },
      { id: "illustrative", label: "Illustrative", description: "Comic book style with bold colors and outlines." },
      { id: "cartoon", label: "Cartoon", description: "Playful, exaggerated features and vibrant hues." },
      { id: "gothic", label: "Gothic", description: "Dark, ornate designs with intricate details." },
      { id: "steampunk", label: "Steampunk", description: "Victorian-era machinery fused with organic elements." },
      { id: "cyberpunk", label: "Cyberpunk", description: "Neon lights, circuitry, and futuristic dystopia." },
      { id: "floral", label: "Floral", description: "Beautiful flowers and botanical motifs." },
      { id: "mandala", label: "Mandala", description: "Symmetrical patterns radiating from a center." },
      { id: "horror", label: "Horror", description: "Spooky, macabre themes with dark imagery." },
    ],
    placements: [
      { id: "forearm", label: "Forearm", image: "/placements/generated-image-1 (8).webp" },
      { id: "chest", label: "Chest", image: "/placements/generated-image-1 (9).webp" },
      { id: "back", label: "Back", image: "/placements/generated-image-1 (10).webp" },
      { id: "shoulder", label: "Shoulder", image: "/placements/generated-image-1 (11).webp" },
      { id: "leg", label: "Leg/Calf", image: "/placements/generated-image-1 (12).webp" },
      { id: "ribs", label: "Ribs", image: "/placements/generated-image-1 (13).webp" },
      { id: "neck", label: "Neck", image: "/placements/generated-image-1 (14).webp" },
      { id: "hand", label: "Hand", image: "/placements/generated-image-1 (15).webp" },
      { id: "wrist", label: "Wrist", image: "/placements/generated-image-1 (16).webp" },
      { id: "ankle", label: "Ankle", image: "/placements/generated-image-1 (17).webp" },
      { id: "thigh", label: "Thigh", image: "/placements/generated-image-1 (18).webp" },
      { id: "stomach", label: "Stomach", image: "/placements/generated-image-1 (19).webp" },
      { id: "spine", label: "Spine", image: "/placements/generated-image-2 (10).webp" },
      { id: "bicep", label: "Bicep", image: "" },
      { id: "tricep", label: "Tricep", image: "" },
      { id: "shin", label: "Shin", image: "" },
      { id: "foot", label: "Foot", image: "" },
      { id: "finger", label: "Finger", image: "" },
      { id: "hip", label: "Hip", image: "" },
      { id: "full-sleeve", label: "Full Sleeve", image: "" },
    ],
    moods: [
      "Melancholic",
      "Triumphant",
      "Chaotic",
      "Serene",
      "Aggressive",
      "Mystical",
      "Nostalgic",
      "Ethereal",
      "Dark",
      "Playful",
      "Stoic",
      "Romantic",
      "Futuristic",
      "Elegant",
    ],
    aspectRatios: [
      { id: "square", label: "Square", value: "1:1" },
      { id: "portrait", label: "Portrait", value: "3:4" },
      { id: "landscape", label: "Landscape", value: "4:3" },
      { id: "wide", label: "Wide", value: "16:9" },
    ],
    colors: [
      "Black & Grey",
      "Full Color",
      "Red Ink Accents",
      "Blue Ink",
      "Minimalist",
    ],
  },
  providers: {
    replicate: { apiKey: "", enabled: true },
    openai: { apiKey: "", enabled: true },
    fal: { apiKey: "", enabled: true },
    upstash: { url: "", token: "", enabled: true },
  },
};
