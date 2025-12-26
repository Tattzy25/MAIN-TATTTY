import React from "react";

import { ScrollArea } from "@/components/ui/scroll-area";

interface ReusableScrollAreaProps {
  items: number;
  label: string;
}

const ReusableScrollArea = ({ items, label }: ReusableScrollAreaProps) => {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-10">
      <div className="rounded-xl border">
        <ScrollArea className="w-62 h-72 rounded-xl [&>div>div]:!scrollbar-hide">
          <div className="space-y-1 p-1">
            {Array.from({ length: items }).map((_, index) => (
              <div
                key={index}
                className="text-foreground/30 hover:bg-foreground/10 bg-foreground/5 flex h-10 w-full items-center gap-2 rounded-lg px-4"
              >
                00{index} <div className="bg-foreground/10 h-px flex-1"></div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export { ReusableScrollArea };
