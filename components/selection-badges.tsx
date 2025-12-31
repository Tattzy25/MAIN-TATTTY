"use client";

import React, { useState } from "react";
import Image from "next/image";
import Badges, { type BadgeItem } from "@/components/badges/Badges";
import GenerateButton from "@/components/generate-button/GenerateButton";
import { useSelection } from "@/components/providers/selection-provider";
import { useBadgeLabels } from "@/hooks/use-badge-labels";
import { useGenerator } from "@/hooks/use-generator";

/**
 * SelectionBadges (cleaned)
 *
 * - Thin composition that uses:
 *   - useSelection for selection state
 *   - useBadgeLabels for label/overflow logic and saved Q1/Q2 texts
 *   - useGenerator for generation
 *
 * Responsibilities:
 * - Build badgeItems (id, label, variant) and pass to Badges (presentational)
 * - Handle generate/clear/remove actions by wiring to hooks
 * - Display preview and errors
 */

export default function SelectionBadges() {
  const { selectedIds, toggle, clear, getSelectedFor, select } = useSelection();
  const { visible, labelFor, savedQTexts } = useBadgeLabels(selectedIds);
  const { generatedUrl, isGenerating, error, generate, clearGenerated } = useGenerator();

  const [localError, setLocalError] = useState<string | null>(null);
  const maxVisible = 5;
  const qMin = 20;

  const handleRemove = (id: string) => {
    toggle(id);
    setLocalError(null);
    clearGenerated();
  };

  const handleClearAll = () => {
    clear();
    clearGenerated();
    setLocalError(null);
  };

  const validateQTexts = (): { ok: boolean; invalid: string[] } => {
    const invalid: string[] = [];
    const q1 = savedQTexts.q1;
    const q2 = savedQTexts.q2;
    if (!q1 || q1.trim().length < qMin) invalid.push("q1");
    if (!q2 || q2.trim().length < qMin) invalid.push("q2");
    return { ok: invalid.length === 0, invalid };
  };

  const handleGenerate = async () => {
    setLocalError(null);

    // Validate Q1/Q2
    const { ok } = validateQTexts();
    if (!ok) {
      setLocalError("Please provide answers for Q1 and Q2 (minimum 20 characters).");
      return;
    }

    // Ensure feature selections exist. If any feature is missing (e.g. user cleared them),
    // auto-select the sensible default (index 1) so generation can proceed without a hard error.
    // This keeps the UX smooth on pages like "quick-ideas" while still allowing the user to change selections.
    const featureNamespaces = ["styles", "colors", "aspect"];
    const missingFeatures = featureNamespaces.filter((ns) => !getSelectedFor(ns));
    if (missingFeatures.length > 0) {
      // Auto-select a sensible default for each missing namespace (index 1 mirrors the provider defaults).
      missingFeatures.forEach((ns) => {
        select(`${ns}-1`);
      });
      // Clear any previous local error so the UI doesn't show a blocking message.
      setLocalError(null);
    }

    // If Q1/Q2 texts exist in localStorage but the user hasn't opened the Q modals
    // on this page (so no selection was recorded), ensure we still mark q1/q2 as selected.
    // This allows the generation flow to proceed on pages like "quick-ideas" without
    // requiring the Q modals to be present on that page.
    const qNamespaces: Array<"q1" | "q2"> = ["q1", "q2"];
    qNamespaces.forEach((ns) => {
      const saved = (savedQTexts[ns] ?? "").trim();
      if (!getSelectedFor(ns) && saved.length >= qMin) {
        // select the namespace key (Q selections are stored as "q1" / "q2" by the modals)
        select(ns);
      }
    });

    // Build final selection payload
    const namespaces = ["styles", "colors", "aspect", "q1", "q2"];
    const finalSelected: string[] = [];
    for (const ns of namespaces) {
      const s = getSelectedFor(ns);
      if (s) finalSelected.push(s);
    }

    if (finalSelected.length < namespaces.length) {
      setLocalError("Unable to collect all required selections.");
      return;
    }

    try {
      await generate(finalSelected);
      setLocalError(null);
    } catch (err) {
      setLocalError((err as Error)?.message ?? "Generation failed");
    }
  };

  // Build presentational badge items
  const badgeItems: BadgeItem[] = visible.slice(0, maxVisible).map((id) => {
    const ns = id.split("-")[0];
    const isQ = ns === "q1" || ns === "q2";
    // ensure qText is always a string to avoid undefined/TS issues
    const qText: string = isQ ? (savedQTexts[ns as "q1" | "q2"] ?? "") : "";
    const invalidQ = isQ ? qText.trim().length < qMin : false;
    return {
      id,
      label: isQ ? ns.toUpperCase() : labelFor(id),
      variant: invalidQ ? "destructive" : undefined,
    };
  });

  return (
    <div className="w-full max-w-2xl mx-auto mt-6">
      <div className="flex flex-col items-center gap-4">
        <div className="w-full flex flex-wrap items-center justify-between gap-3">
          <div className="flex-1 min-w-0">
            <Badges items={badgeItems} onRemove={handleRemove} maxVisible={maxVisible} />
          </div>

          <div className="ml-3">
            <button
              type="button"
              onClick={handleClearAll}
              className="inline-flex items-center px-3 py-1.5 rounded-md border bg-transparent text-sm"
              aria-disabled={selectedIds.length === 0}
            >
              Clear
            </button>
          </div>
        </div>

        <div className="w-full flex justify-center mt-2">
          <GenerateButton onClick={handleGenerate} loading={isGenerating} disabled={!selectedIds.length} />
        </div>

        {(localError || error) && (
          <p className="text-sm text-destructive mt-1 text-center px-4">
            {localError ?? error}
          </p>
        )}

        {generatedUrl && (
          <div className="mt-6 rounded-md overflow-hidden border border-muted p-2 max-w-full w-full">
            <Image
              src={generatedUrl}
              alt="Generated preview"
              width={1024}
              height={1024}
              className="w-full h-auto object-cover rounded"
            />
          </div>
        )}
      </div>
    </div>
  );
}
