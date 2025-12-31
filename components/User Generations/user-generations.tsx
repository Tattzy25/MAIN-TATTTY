"use client";

import Image from "next/image";
import React from "react";

interface UserGenerationsProps {
  readonly generatedUrl?: string | null;
  readonly localError?: string | null;
  readonly error?: string | null;
}

/**
 * UserGenerations
 *
 * Presentational wrapper for displaying generation errors and the generated preview.
 * This file extracts the UI that used to be inline in selection-badges.tsx so the
 * selection component remains focused on state/logic while this component handles
 * rendering the generation result.
 */
export default function UserGenerations({
  generatedUrl,
  localError,
  error,
}: UserGenerationsProps) {
  return (
    <>
      {(localError || error) && (
        <p className="text-sm text-destructive mt-1 text-center px-4">
          {localError ?? error}
        </p>
      )}

      {generatedUrl && (
        <div className="mt-6 rounded-md overflow-hidden border border-muted p-2 max-w-full w-full">
          <Image
            src={generatedUrl}
            alt="Generated preview"
            width={1024}
            height={1024}
            className="w-full h-auto object-cover rounded"
          />
        </div>
      )}
    </>
  );
}
