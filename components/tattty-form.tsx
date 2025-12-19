"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { Loader2, Sparkles, RefreshCcw } from "lucide-react";
import { STYLES, PLACEMENTS, COLORS, ASPECT_RATIOS, MOODS, UI_TEXT, type TattooStyle, type TattooPlacement, type TattooColor, type AspectRatio, type Mood } from "@/app/tattty/constants";
import { askBaddie } from "@/app/actions/baddie";
import { generateTattoo } from "@/app/actions/generate-tattoo";
import { MediaModal } from "@/components/media-modal";
import { TattooVisuals, SoulSection } from "./tattty-form-sections";
import { cn } from "@/lib/utils";

export function TatttyForm() {
  const [style, setStyle] = useState<TattooStyle>(STYLES[0].id);
  const [placement, setPlacement] = useState<TattooPlacement>(PLACEMENTS[0].id);
  const [color, setColor] = useState<TattooColor>(COLORS[0]);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>(ASPECT_RATIOS[0].value);
  const [mood, setMood] = useState<Mood>(MOODS[0]);
  const [q1, setQ1] = useState("");
  const [q2, setQ2] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [status, setStatus] = useState<"idle" | "baddie" | "tattty">("idle");
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showSoul, setShowSoul] = useState(false);

  const handleGenerate = async () => {
    if (!q1 || !q2) return setError("Your soul is required for the ink.");
    setIsGenerating(true); setError(null); setStatus("baddie");
    try {
      const bResponse = await askBaddie({ style, colors: color, placement, aspectRatio, mood, q1Answer: q1, q2Answer: q2 });
      if (!bResponse.success || !bResponse.prompt) throw new Error(bResponse.error || "Baddie failed.");
      setStatus("tattty");
      const tResponse = await generateTattoo(bResponse.prompt, aspectRatio);
      if (!tResponse.success || !tResponse.output) throw new Error(tResponse.error || "Tattty failed.");
      setResult(Array.isArray(tResponse.output) ? tResponse.output[0] : tResponse.output);
    } catch (err: any) { setError(err.message); } finally { setIsGenerating(false); setStatus("idle"); }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 sm:p-10 space-y-20 pb-32">
      <div className="text-center space-y-8">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="text-6xl font-black tracking-tighter sm:text-8xl bg-clip-text text-transparent bg-linear-to-b from-foreground to-foreground/50 uppercase"
        >
          {UI_TEXT.title}
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          className="text-muted-foreground text-xl font-medium max-w-2xl mx-auto"
        >
          {UI_TEXT.subtitle}
        </motion.p>
      </div>

      <div className={cn(
        "grid grid-cols-1 gap-16 items-start transition-all duration-700",
        showSoul ? "lg:grid-cols-12" : "max-w-3xl mx-auto"
      )}>
        <div className={cn(
          "space-y-12 transition-all duration-700",
          showSoul ? "lg:col-span-7" : "w-full"
        )}>
          <TattooVisuals style={style} setStyle={setStyle} placement={placement} setPlacement={setPlacement} color={color} setColor={setColor} mood={mood} setMood={setMood} aspectRatio={aspectRatio} setAspectRatio={setAspectRatio} />
          {!showSoul && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="pt-8">
              <Button 
                className="w-full h-24 text-3xl font-black rounded-4xl uppercase shadow-2xl shadow-primary/20 group bg-primary hover:scale-[1.02] transition-transform" 
                onClick={() => setShowSoul(true)}
              >
                Getting Hotter <Sparkles className="ml-3 w-8 h-8 group-hover:animate-pulse" />
              </Button>
            </motion.div>
          )}
        </div>

        {showSoul && (
          <div className="lg:col-span-5 space-y-8 sticky top-8">
            <AnimatePresence mode="wait">
              <motion.section 
                initial={{ opacity: 0, x: 20 }} 
                animate={{ opacity: 1, x: 0 }} 
                exit={{ opacity: 0, x: 20 }} 
                className="space-y-8 p-10 rounded-[3rem] bg-muted/30 border border-border relative overflow-hidden shadow-2xl backdrop-blur-sm"
              >
                <SoulSection q1={q1} setQ1={setQ1} q2={q2} setQ2={setQ2} />
                <Button 
                  className="w-full h-20 text-2xl font-black shadow-2xl rounded-3xl uppercase hover:scale-[1.02] transition-transform" 
                  disabled={isGenerating} 
                  onClick={handleGenerate}
                >
                  {isGenerating ? (
                    <><Loader2 className="w-8 h-8 animate-spin mr-3" /> {status === "baddie" ? UI_TEXT.generating : UI_TEXT.inking}</>
                  ) : (
                    <><Sparkles className="w-8 h-8 mr-3" /> {UI_TEXT.generateButton}</>
                  )}
                </Button>
                {error && <p className="text-destructive text-sm text-center font-black uppercase tracking-widest animate-bounce">{error}</p>}
              </motion.section>
            </AnimatePresence>

            <AnimatePresence>
              {result && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9, y: 20 }} 
                  animate={{ opacity: 1, scale: 1, y: 0 }} 
                  className="space-y-6"
                >
                  <div className="relative aspect-square rounded-[3rem] overflow-hidden border-12 border-muted shadow-2xl ring-1 ring-border">
                    <MediaModal imgSrc={result} />
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-full h-16 rounded-2xl font-black uppercase tracking-widest text-lg" 
                    onClick={() => setResult(null)}
                  >
                    <RefreshCcw className="w-5 h-5 mr-3" /> New Journey
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}

