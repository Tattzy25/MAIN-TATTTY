"use client";

import { useState } from "react";

/**
 * useGenerator
 *
 * Encapsulates the "generate" behavior for InK Me Up.
 * For now it returns a placeholder image URL. Later you can
 * replace the internals with a real webhook / Upstash call.
 */

export type UseGeneratorResult = {
	generatedUrl: string | null;
	isGenerating: boolean;
	error: string | null;
	generate: (selectedIds: string[]) => Promise<void>;
	clearGenerated: () => void;
};

export function useGenerator(): UseGeneratorResult {
	const [generatedUrl, setGeneratedUrl] = useState<string | null>(null);
	const [isGenerating, setIsGenerating] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const generate = async (selectedIds: string[]) => {
		try {
			setIsGenerating(true);
			setError(null);

			// TODO: Replace this with your actual webhook or Upstash call.
			// For example:
			// const res = await fetch("/api/generate-images", { method: "POST", body: JSON.stringify({ selectedIds }) });
			// const data = await res.json();
			// setGeneratedUrl(data.url);
			// For now, just show a local placeholder so the flow can be tested.
			if (selectedIds.length === 0) {
				throw new Error("No selections to generate from");
			}

			setGeneratedUrl("/v.jpg");
		} catch (err) {
			setError(err instanceof Error ? err.message : "Unknown error");
		} finally {
			setIsGenerating(false);
		}
	};

	const clearGenerated = () => {
		setGeneratedUrl(null);
		setError(null);
	};

	return { generatedUrl, isGenerating, error, generate, clearGenerated };
}
