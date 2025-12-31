"use client";
import { AnimatePresence, type HTMLMotionProps, motion } from "motion/react";
import * as React from "react";
import {
	type UseWordCarouselOptions,
	useWordCarousel,
} from "@/lib/use-word-carousel";
import { cn } from "@/lib/utils";
export interface TextWordCarouselProps
	extends Omit<HTMLMotionProps<"span">, "children">,
		UseWordCarouselOptions {
	duration?: number;
}
export function TextWordCarousel({
	words,
	interval,
	className,
	duration = 0.3,
	...props
}: TextWordCarouselProps) {
	const { currentWord, key } = useWordCarousel({ words, interval });
	const longestWord = React.useMemo(
		() => words.reduce((a, b) => (a.length > b.length ? a : b), ""),
		[words],
	);

	return (
		<span className={cn("inline-grid relative text-center", className)}>
			{/* Invisible spacer to reserve width */}
			<span className="invisible col-start-1 row-start-1">{longestWord}</span>

			<AnimatePresence mode="wait">
				<motion.span
					key={key}
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: -20 }}
					transition={{ duration }}
					className="col-start-1 row-start-1 inline-block"
					{...props}
				>
					{currentWord}
				</motion.span>
			</AnimatePresence>
		</span>
	);
}
