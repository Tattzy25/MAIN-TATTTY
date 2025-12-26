"use client";

import { COUPLES_PAGE_UI_TEXT, COUPLES_SUGGESTIONS } from "@/app/tattty/constants";
import { PromptInputArea } from "@/components/prompt-input-area";

export default function CouplesTattsPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] p-8">
      {/* Consistent Header */}
      <div className="flex flex-col items-center justify-center space-y-8 text-center mb-8">
        <h2 className="text-4xl sm:text-6xl lg:text-8xl font-black tracking-tighter bg-clip-text text-transparent bg-linear-to-b from-foreground to-foreground/50 uppercase pt-3 sm:pt-4 md:pt-6 lg:pt-8">
          {COUPLES_PAGE_UI_TEXT.title}
        </h2>
        
        <p className="max-w-md text-muted-foreground text-lg sm:text-xl font-medium">
          {COUPLES_PAGE_UI_TEXT.description}
        </p>
      </div>

      {/* Reusable Prompt Input Area */}
      <PromptInputArea suggestions={COUPLES_SUGGESTIONS} />
    </div>
  );
}
