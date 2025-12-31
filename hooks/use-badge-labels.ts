"use client";

import { useEffect, useMemo, useState } from "react";
import { basicLabelFromId, getNamespaceFromId, truncate } from "@/lib/helpers";

/**
 * useBadgeLabels
 *
 * Centralizes all label & overflow logic for selection badges.
 * - Takes the list of selected ids from SelectionProvider.
 * - Handles Q1/Q2 text loading from localStorage.
 * - Returns visible ids (for current page), overflow count, and a label resolver.
 */

type SavedQTexts = {
	q1?: string;
	q2?: string;
};

export type UseBadgeLabelsResult = {
	visible: string[];
	overflowCount: number;
	labelFor: (id: string) => string;
	savedQTexts: SavedQTexts;
};

export function useBadgeLabels(
	selectedIds: string[],
	maxVisible = 5,
): UseBadgeLabelsResult {
	const [savedQTexts, setSavedQTexts] = useState<SavedQTexts>({});

	// Load Q1/Q2 saved texts from localStorage so their badges can display user input.
	useEffect(() => {
		if (typeof window === "undefined") return;
		const q1 = window.localStorage.getItem("tattty:q1") ?? undefined;
		const q2 = window.localStorage.getItem("tattty:q2") ?? undefined;
		setSavedQTexts({ q1, q2 });
	}, [selectedIds]);

	const visible = useMemo(
		() => selectedIds.slice(0, maxVisible),
		[selectedIds, maxVisible],
	);

	const overflowCount = Math.max(0, selectedIds.length - maxVisible);

	const labelFor = (id: string) => {
		const ns = getNamespaceFromId(id);
		if ((ns === "q1" || ns === "q2") && savedQTexts[ns as keyof SavedQTexts]) {
			const text = savedQTexts[ns as keyof SavedQTexts] as string;
			return truncate(text, 40);
		}
		return basicLabelFromId(id);
	};

	return { visible, overflowCount, labelFor, savedQTexts };
}
