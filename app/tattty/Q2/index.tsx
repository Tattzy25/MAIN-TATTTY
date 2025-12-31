"use client";

import { useId, useState } from "react";
import { useSelection } from "@/components/providers/selection-provider";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { useQText } from "@/hooks/use-q-text";

export default function Q2Modal() {
	const textareaId = useId();
	const { value: initial, save } = useQText("q2");
	const [text, setText] = useState(initial ?? "");
	const { select } = useSelection();

	const handleSave = () => {
		save(text);
		// mark question selection in provider
		select("q2");
	};

	return (
		<Dialog>
			<DialogTrigger asChild>
				<button
					type="button"
					className="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-hidden focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
				>
					Open modal 2
				</button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Question 2</DialogTitle>
				</DialogHeader>
				<div className="p-1">
					<label
						htmlFor={textareaId}
						className="block text-sm font-medium mb-2 dark:text-white"
					>
						Your answer
					</label>
					<textarea
						id={textareaId}
						value={text}
						onChange={(e) => setText(e.target.value)}
						className="mt-1 py-2 px-3 sm:py-3 sm:px-4 block w-full border-gray-200 rounded-lg sm:text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
						rows={3}
						placeholder="Write your answer..."
					/>
				</div>
				<DialogFooter>
					<DialogClose asChild>
						<button
							type="button"
							className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-2xs hover:bg-gray-50 focus:outline-hidden focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
						>
							Close
						</button>
					</DialogClose>
					<DialogClose asChild>
						<button
							onClick={handleSave}
							type="button"
							className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-hidden focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
						>
							Save
						</button>
					</DialogClose>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
