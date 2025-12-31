"use client";

import { useSelection } from "@/components/providers/selection-provider";
import { Scroller } from "@/components/ui/scroller";

export function ScrollerHorizontal({
	idPrefix = "styles",
}: {
	idPrefix?: string;
}) {
	const { isSelected, toggle } = useSelection();

	const items = Array.from({ length: 10 }).map((_, index) => ({
		id: `${idPrefix}-${index}`,
		label: `Style ${index + 1}`,
	}));

	return (
		<Scroller
			orientation="horizontal"
			hideScrollbar
			className="w-full p-4"
			asChild
		>
			<div className="flex items-center gap-2.5">
				{items.map((item) => {
					const selected = isSelected(item.id);
					return (
						<div
							key={item.id}
							role="button"
							tabIndex={0}
							onClick={() => toggle(item.id)}
							onKeyDown={(e) => {
								if (e.key === "Enter" || e.key === " ") {
									e.preventDefault();
									toggle(item.id);
								}
							}}
							className={
								"flex h-32 w-[180px] shrink-0 flex-col items-center justify-center rounded-md bg-accent p-4 cursor-pointer transition-all " +
								(selected ? "ring-2 ring-primary" : "")
							}
						>
							<div className="font-medium text-lg">{item.label}</div>
							<span className="text-muted-foreground text-sm">
								Scroll horizontally
							</span>
						</div>
					);
				})}
			</div>
		</Scroller>
	);
}
