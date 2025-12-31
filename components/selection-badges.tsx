"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import { useSelection } from "@/components/providers/selection-provider";
import { Badge } from "@/components/ui/badge";
import CreateButton from "@/components/Create Button/CreateButton";
import UserGenerations from "@/components/User Generations/user-generations";
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
	const { generatedUrl, isGenerating, error, generate, clearGenerated } =
		useGenerator();

	const pathname = usePathname();

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

		// Skip Q validation on routes that don't require Q1/Q2
		const qOptionalRoutes = [
			"/tattty/quick-ideas",
			"/tattty/fonts",
			"/tattty/ink-redemption",
			"/tattty/couples-tatttz",
		];
		const isQOptionalPage = pathname
			? qOptionalRoutes.some((r) => pathname.startsWith(r))
			: false;

		if (!isQOptionalPage) {
			// Validate Q1/Q2
			const { ok } = validateQTexts();
			if (!ok) {
				setLocalError(
					"Please provide answers for Q1 and Q2 (minimum 20 characters).",
				);
				return;
			}
		}

		// Ensure feature selections exist. If any feature is missing (e.g. user cleared them),
		// auto-select the sensible default (index 1) so generation can proceed without a hard error.
		// This keeps the UX smooth on pages like "quick-ideas" while still allowing the user to change selections.
		const featureNamespaces = ["styles", "colors", "aspect"];
		const missingFeatures = featureNamespaces.filter(
			(ns) => !getSelectedFor(ns),
		);
		if (missingFeatures.length > 0) {
			// Auto-select a sensible default for each missing namespace (index 1 mirrors the provider defaults).
			missingFeatures.forEach((ns) => {
				select(`${ns}-1`);
			});
			// Clear any previous local error so the UI doesn't show a blocking message.
			setLocalError(null);
		}

		// If Q1/Q2 texts exist in localStorage but the user hasn't opened the Q modals
		// on this page (so no selection was recorded), ensure we still mark q1/q2 as selected
		// — but only when Qs are required for this page. On Q-optional pages we must NOT
		// auto-select q1/q2 (that was causing "fake" Q badges to appear).
		if (!isQOptionalPage) {
			const qNamespaces: Array<"q1" | "q2"> = ["q1", "q2"];
			qNamespaces.forEach((ns) => {
				const saved = (savedQTexts[ns] ?? "").trim();
				if (!getSelectedFor(ns) && saved.length >= qMin) {
					// select the namespace key (Q selections are stored as "q1" / "q2" by the modals)
					select(ns);
				}
			});
		}

		// Build final selection payload. Exclude q1/q2 on pages where they're optional.
		const namespaces = isQOptionalPage
			? ["styles", "colors", "aspect"]
			: ["styles", "colors", "aspect", "q1", "q2"];

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
	const badgeItems: {
		id: string;
		label: string;
		variant?:
			| "destructive"
			| "default"
			| "outline"
			| "secondary"
			| null
			| undefined;
	}[] = visible.slice(0, maxVisible).map((id) => {
		const ns = id.split("-")[0];
		const isQ = ns === "q1" || ns === "q2";
		// ensure qText is always a string to avoid undefined/TS issues
		let qText: string = "";
		if (isQ) {
			if (ns === "q1") {
				qText = savedQTexts.q1 ?? "";
			} else {
				qText = savedQTexts.q2 ?? "";
			}
		}
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
				<div className="w-full flex justify-center">
					<div className="flex flex-wrap items-center justify-center gap-3">
						{badgeItems.map((b) => (
							<button
								key={b.id}
								type="button"
								onClick={() => handleRemove(b.id)}
								className="inline-flex items-center h-10"
							>
								<Badge
									variant={b.variant}
									size="lg"
									className="inline-flex items-center justify-center h-10 px-4 text-base"
								>
									<span className="select-none">{b.label}</span>
								</Badge>
							</button>
						))}

						{/* Clear button included inline with badges, matching height */}
						<button
							type="button"
							onClick={handleClearAll}
							className="inline-flex items-center h-10 px-4 rounded-md border bg-transparent text-sm"
							aria-disabled={selectedIds.length === 0}
						>
							Clear
						</button>
					</div>
				</div>

				<div className="w-full flex justify-center mt-2">
					<CreateButton
						onClick={handleGenerate}
						disabled={!selectedIds.length || isGenerating}
						isGenerating={isGenerating}
					/>
				</div>

				<UserGenerations
					generatedUrl={generatedUrl}
					localError={localError}
					error={error}
				/>
			</div>
		</div>
	);
}
