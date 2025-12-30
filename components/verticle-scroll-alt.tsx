"use client";

import { Scroller } from "@/components/ui/scroller";
import { useSelection } from "@/components/providers/selection-provider";

/**
 * Second vertical scroller file — different component so each column can evolve independently.
 * Default idPrefix is "aspect" to match the second column on the tattty page.
 */
export function ScrollerHiddenAlt({ idPrefix = "aspect" }: { idPrefix?: string }) {
  const { isSelected, toggle } = useSelection();

  const items = Array.from({ length: 12 }).map((_, index) => ({
    id: `${idPrefix}-${index}`,
    label: `Option ${index + 1}`,
  }));

  return (
    <Scroller className="flex h-80 w-full flex-col gap-2.5 p-4" hideScrollbar>
      {items.map((item) => {
        const selected = isSelected(item.id);
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => toggle(item.id)}
            className={
              "flex h-40 w-full flex-col rounded-md bg-accent p-4 text-left transition-all focus:outline-none " +
              (selected ? "ring-2 ring-primary" : "")
            }
          >
            <div className="font-medium text-lg">{item.label}</div>
            <span className="text-muted-foreground text-sm">Select this option</span>
          </button>
        );
      })}
    </Scroller>
  );
}
