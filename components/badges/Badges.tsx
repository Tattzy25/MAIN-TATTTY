"use client";

import { XIcon } from "lucide-react";
import React from "react";
import { Badge } from "@/components/ui/badge";

export type BadgeItem = {
	id: string;
	label: string;
	variant?: "default" | "outline" | "secondary" | "destructive";
};

type BadgesProps = {
	items: BadgeItem[];
	onRemove: (id: string) => void;
	maxVisible?: number;
};

export default function Badges({
	items,
	onRemove,
	maxVisible = 5,
}: BadgesProps) {
	const visible = items.slice(0, maxVisible);
	const overflow = items.length - visible.length;

	return (
		<div className="flex flex-wrap justify-center gap-3">
			{visible.map((it) => (
				<Badge
					key={it.id}
					variant={it.variant as any}
					size="lg"
					className="inline-flex items-center gap-2"
				>
					<span className="select-none">{it.label}</span>
					<button
						type="button"
						aria-label={`Remove ${it.id}`}
						onClick={() => onRemove(it.id)}
						className="inline-flex items-center justify-center rounded-full p-1 hover:bg-accent/60 focus:outline-none"
					>
						<XIcon className="size-3" />
					</button>
				</Badge>
			))}


			{overflow > 0 && (
				<Badge className="px-3 py-1.5 text-base" variant="secondary">
					+{overflow} more
				</Badge>
			)}
		</div>
	);
}
