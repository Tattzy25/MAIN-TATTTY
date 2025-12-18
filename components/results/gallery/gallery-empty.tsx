"use client";

import { FileIcon, ImageIcon, ImageUpIcon, UploadIcon } from "lucide-react";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";

export const GalleryEmpty = () => {
  return (
    <Empty className="h-full min-h-[50vh] rounded-lg border">
      <EmptyHeader className="max-w-none">
        <div className="relative isolate mb-8 flex">
          <div className="-rotate-12 translate-x-2 translate-y-2 rounded-full border bg-background p-3 shadow-xs">
            <ImageIcon className="size-5 text-muted-foreground" />
          </div>
          <div className="z-10 rounded-full border bg-background p-3 shadow-xs">
            <UploadIcon className="size-5 text-muted-foreground" />
          </div>
          <div className="-translate-x-2 translate-y-2 rotate-12 rounded-full border bg-background p-3 shadow-xs">
            <FileIcon className="size-5 text-muted-foreground" />
          </div>
        </div>
        <EmptyTitle>No images found</EmptyTitle>
        <EmptyDescription>
          Upload some images with the <ImageUpIcon className="inline size-4" />{" "}
          button below to get started!
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
};
