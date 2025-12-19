"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { Loader2, Sparkles, RefreshCcw } from "lucide-react";
import { UI_TEXT } from "@/app/tattty/fonts/constants";
import { generateFontAction } from "@/app/actions/generate-font";
import { useToast } from "@/hooks/use-toast";
import { MediaModal } from "@/components/media-modal";
import { FontVisuals } from "./font-form-sections";
import { cn } from "@/lib/utils";

export function FontForgeCard() {
  const [text, setText] = useState("");
  const [color, setColor] = useState<'black' | 'colors'>('black');
  const [style, setStyle] = useState("");
  const [customization, setCustomization] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [results, setResults] = useState<string[]>([]);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!text || !style) return toast({ title: "Missing Info", description: "Text and style required.", variant: "destructive" });
    setIsGenerating(true); setResults([]);
    try {
      const res = await generateFontAction({ text, style, color, customization });
      if (res.success && Array.isArray(res.output)) {
        setResults(res.output as string[]);
        toast({ title: "Success!", description: "Font forged." });
      } else throw new Error(res.error || "Failed.");
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally { setIsGenerating(false); }
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
        results.length > 0 ? "lg:grid-cols-12" : "max-w-3xl mx-auto"
      )}>
        <div className={cn(
          "space-y-12 transition-all duration-700",
          results.length > 0 ? "lg:col-span-7" : "w-full"
        )}>
          <FontVisuals text={text} setText={setText} color={color} setColor={setColor} style={style} setStyle={setStyle} customization={customization} setCustomization={setCustomization} />
          <Button 
            className="w-full h-24 text-3xl font-black rounded-4xl uppercase shadow-2xl shadow-primary/20 group bg-primary hover:scale-[1.02] transition-transform" 
            disabled={isGenerating} 
            onClick={handleGenerate}
          >
            {isGenerating ? (
              <><Loader2 className="w-8 h-8 animate-spin mr-3" /> {UI_TEXT.generating}</>
            ) : (
              <><Sparkles className="w-8 h-8 mr-3" /> {UI_TEXT.generateButton}</>
            )}
          </Button>
        </div>

        {results.length > 0 && (
          <div className="lg:col-span-5 space-y-8 sticky top-8">
            <AnimatePresence>
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }} 
                animate={{ opacity: 1, scale: 1, y: 0 }} 
                className="space-y-6"
              >
                <div className="grid grid-cols-1 gap-6">
                  {results.map((img) => (
                    <div key={img} className="relative aspect-square rounded-[3rem] overflow-hidden border-12 border-muted shadow-2xl ring-1 ring-border">
                      <MediaModal imgSrc={img} />
                    </div>
                  ))}
                </div>
                <Button 
                  variant="outline" 
                  className="w-full h-16 rounded-2xl font-black uppercase tracking-widest text-lg" 
                  onClick={() => setResults([])}
                >
                  <RefreshCcw className="w-5 h-5 mr-3" /> New Forge
                </Button>
              </motion.div>
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
