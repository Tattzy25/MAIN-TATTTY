"use client";

import { useCallback, useEffect, useState } from "react";

/**
 * useQText
 *
 * Manages the text value for a question (q1 or q2) and syncs it with localStorage.
 * Keeps all localStorage details out of the UI components.
 */
export function useQText(key: "q1" | "q2") {
	const storageKey = `tattty:${key}`;
	const [value, setValue] = useState("");

	useEffect(() => {
		if (typeof window === "undefined") return;
		const existing = window.localStorage.getItem(storageKey);
		if (existing) {
			setValue(existing);
		}
	}, [storageKey]);

	const save = useCallback(
		(text: string) => {
			setValue(text);
			if (typeof window !== "undefined") {
				window.localStorage.setItem(storageKey, text);
			}
		},
		[storageKey],
	);

	return { value, save };
}
