"use client";

import { FONTS_SUGGESTIONS, FONTS_UI_TEXT } from "@/app/tattty/constants";
import { PromptInputArea } from "@/components/prompt-input-area";
import { ScrollerHorizontal } from "@/components/horizontal-scroll";
import { ScrollerHidden } from "@/components/verticle-scroll";

export default function FontsPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] p-4 sm:p-8">
      {/* Consistent Header */}
      <div className="flex flex-col items-center justify-center space-y-8 text-center mb-8">
        <h2 className="text-4xl sm:text-6xl lg:text-8xl font-black tracking-tighter bg-clip-text text-transparent bg-linear-to-b from-foreground to-foreground/50 uppercase pt-3 sm:pt-4 md:pt-6 lg:pt-8">
          {FONTS_UI_TEXT.title}
        </h2>
        
        <p className="max-w-md text-muted-foreground text-lg sm:text-xl font-medium">
          {FONTS_UI_TEXT.description}
        </p>
      </div>

      {/* Reusable Prompt Input Area */}
      <PromptInputArea suggestions={FONTS_SUGGESTIONS} />
      <div className="w-full flex justify-center mt-6">
        <div className="w-full max-w-2xl">
          <ScrollerHorizontal />
          <div className="mt-2.5">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="w-full md:w-1/2">
                <ScrollerHidden />
              </div>
              <div className="w-full md:w-1/2">
                <ScrollerHidden />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
