"use client";

import { ImageUpIcon, XIcon } from "lucide-react";
import { type ChangeEventHandler, useId, useRef, useState } from "react";
import { useToast } from "@/components/providers/toast-provider";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useUploadedImages } from "@/components/uploaded-images-provider";

export const UploadButton = () => {
	const { toast, info, error, success, dismiss } = useToast();
	const { addImage } = useUploadedImages();
	const id = useId();
	const inputRef = useRef<HTMLInputElement>(null);
	const abortControllerRef = useRef<AbortController | null>(null);
	const [isUploading, setIsUploading] = useState(false);
	const isDemo =
		typeof window !== "undefined" &&
		window.location.hostname.includes("vectr.store");

	const cancelUpload = () => {
		if (abortControllerRef.current) {
			abortControllerRef.current.abort();
			abortControllerRef.current = null;
			info("Upload cancelled");
		}
	};

	const validateFiles = (files: File[]) => {
		if (isDemo) {
			error("Uploads are disabled in demo mode");
			return false;
		}
		const maxSize = 4.5 * 1024 * 1024; // 4.5MB
		const oversized = files.filter((f) => f.size > maxSize);
		if (oversized.length > 0) {
			error(
				`${oversized.length} file${oversized.length > 1 ? "s" : ""} exceed the 4.5MB limit`,
				{ description: "Please use smaller files for server uploads" },
			);
			return false;
		}
		return true;
	};

	const createTempBlobs = (files: File[]) =>
		files.map((file) => {
			const tempUrl = URL.createObjectURL(file);
			return {
				file,
				tempUrl,
				blob: {
					url: tempUrl,
					downloadUrl: tempUrl,
					pathname: file.name,
					contentType: file.type,
					contentDisposition: `attachment; filename="${file.name}"`,
				},
			};
		});

	// Small helper to render the progress toast body
	const renderProgressBody = (completed: number, total: number, onCancel: () => void) => (
		<div className="flex flex-col gap-2">
			<div className="flex items-center justify-between">
				<div className="font-medium text-sm">
					Uploading {total} file{total > 1 ? "s" : ""}...
				</div>
				<Button className="size-6" onClick={onCancel} size="icon" variant="ghost">
					<XIcon className="size-3" />
				</Button>
			</div>
			<div className="flex items-center gap-2">
				<Progress className="flex-1" value={(completed / total) * 100} />
				<span className="text-muted-foreground text-xs">
					{completed}/{total}
				</span>
			</div>
		</div>
	);

	// Extracted upload logic for a single file
	const processFile = async ({
		file,
		tempUrl,
	}: {
		file: File;
		tempUrl: string;
	}) => {
		try {
			const formData = new FormData();
			formData.append("file", file);

			const response = await fetch("/api/upload", {
				method: "POST",
				body: formData,
				signal: abortControllerRef.current?.signal,
			});

			if (!response.ok) {
				const body = (await response.json()) as { error: string };
				throw new Error(body.error);
			}
			return { success: true, fileName: file.name };
		} catch (err) {
			if (err instanceof Error && err.name === "AbortError") {
				throw new Error("Upload cancelled");
			}
			throw err;
		} finally {
			URL.revokeObjectURL(tempUrl);
		}
	};

	// Upload in batches and update progress toast
	const uploadInBatches = async (tempBlobs: { file: File; tempUrl: string; blob: any }[], toastId: string) => {
		const BATCH_SIZE = 10;
		const results: PromiseSettledResult<{ success: boolean; fileName: string }>[] = [];
		let completed = 0;
		const total = tempBlobs.length;

		for (let i = 0; i < tempBlobs.length; i += BATCH_SIZE) {
			if (abortControllerRef.current?.signal.aborted) break;

			const batch = tempBlobs.slice(i, i + BATCH_SIZE);
			const batchResults = await Promise.allSettled(batch.map(processFile));
			results.push(...batchResults);
			completed += batch.length;

			// update existing toast
			toast(renderProgressBody(completed, total, cancelUpload), "default", {
				id: toastId,
				duration: Number.POSITIVE_INFINITY,
			});
		}

		return results;
	};

	const handleChange: ChangeEventHandler<HTMLInputElement> = async (event) => {
		const files = Array.from(event.target.files || []);
		if (files.length === 0) return;
		if (!validateFiles(files)) return;

		abortControllerRef.current = new AbortController();
		setIsUploading(true);

		const tempBlobs = createTempBlobs(files);
		for (const { blob } of tempBlobs) addImage(blob);

		let completed = 0;
		const total = tempBlobs.length;

		// create toast once and reuse its id to update
		const toastId = toast(renderProgressBody(completed, total, cancelUpload), "default", {
			duration: Number.POSITIVE_INFINITY,
		});

		let results: PromiseSettledResult<{ success: boolean; fileName: string }>[] = [];
		try {
			results = await uploadInBatches(tempBlobs, toastId);
		} finally {
			abortControllerRef.current = null;
			dismiss(toastId);

			const successful = results.filter((r) => r.status === "fulfilled");
			const failed = results.filter((r) => r.status === "rejected");

			if (successful.length > 0) {
				success(`${successful.length} file${successful.length > 1 ? "s" : ""} uploaded successfully`);
			}

			if (failed.length > 0) {
				const firstError = failed[0];
				const message =
					firstError.status === "rejected" && firstError.reason instanceof Error
						? firstError.reason.message
						: "Unknown error";
				error(`Failed to upload ${failed.length} file${failed.length > 1 ? "s" : ""}`, {
					description: message,
				});
			}

			if (inputRef.current) inputRef.current.value = "";
			setIsUploading(false);
		}
	};

	return (
		<>
			<input
				accept="image/*"
				className="hidden"
				id={id}
				multiple
				onChange={handleChange}
				ref={inputRef}
				type="file"
			/>
			<Button
				className="hidden shrink-0 rounded-full disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
				disabled={isUploading || isDemo}
				onClick={() => inputRef.current?.click()}
				size="icon"
				type="button"
				variant="ghost"
				aria-hidden={true}
				tabIndex={-1}
			>
				<ImageUpIcon className="size-4" />
			</Button>
		</>
	);
};
