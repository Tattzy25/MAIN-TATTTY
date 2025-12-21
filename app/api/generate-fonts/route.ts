import { createOpenAI } from "@ai-sdk/openai";
import { generateText } from "ai";
import { type NextRequest, NextResponse } from "next/server";
import { getSettings } from "@/app/actions/settings";

// Helper for timeouts
const withTimeout = <T>(promise: Promise<T>, ms: number): Promise<T> => {
	return Promise.race([
		promise,
		new Promise<T>((_, reject) =>
			setTimeout(() => reject(new Error("Timeout")), ms),
		),
	]);
};

const TIMEOUT_MILLIS = 30000; // 30 seconds

export async function POST(req: NextRequest) {
	const requestId = Math.random().toString(36).substring(7);

	try {
        const settings = await getSettings();
        const apiKey = settings.providers.openai.apiKey || process.env.OPENAI_API_KEY;

		const { text, style } = await req.json();

		if (!text || typeof text !== "string") {
			console.error(`Text is required [requestId=${requestId}]`);
			return NextResponse.json({ error: "Text is required" }, { status: 400 });
		}

		const stylePrompt = style
			? `in a ${style} style`
			: "in various creative and artistic styles";

		const prompt = `Generate 5 creative font variations of the following text ${stylePrompt}. 
Each variation should use different Unicode characters, symbols, or styling to create visually distinct versions.
Return only the styled text variations, one per line, without numbering or additional explanation.

Original text: "${text}"`;

		const startstamp = performance.now();

        const customOpenAI = createOpenAI({
            apiKey: apiKey,
        });

		const generatePromise = generateText({
			model: customOpenAI("gpt-4o-mini"),
			prompt,
		}).then((result) => {
			console.log(
				`Completed font generation [requestId=${requestId}, elapsed=${(
					(performance.now() - startstamp) / 1000
				).toFixed(1)}s]`,
			);

			const fonts = result.text
				.split("\n")
				.filter((line) => line.trim())
				.slice(0, 5);

			if (fonts.length === 0) {
				return { fonts: [text] };
			}

			return { fonts };
		});

		const result = await withTimeout(generatePromise, TIMEOUT_MILLIS);
		return NextResponse.json(result, { status: 200 });
	} catch (error) {
		console.error(`Error generating fonts [requestId=${requestId}]:`, error);
		return NextResponse.json(
			{ error: "Failed to generate fonts. Please try again later." },
			{ status: 500 },
		);
	}
}
