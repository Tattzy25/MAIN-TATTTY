"use client";

import type { ListBlobResult } from "@vercel/blob";
import useEmblaCarousel from "embla-carousel-react";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ChevronUpIcon,
  CopyIcon,
  DownloadIcon,
  FileIcon,
  HeartIcon,
  ImageIcon,
  ImageUpIcon,
  Loader2Icon,
  SendIcon,
  UploadIcon,
  XIcon,
} from "lucide-react";
import Image from "next/image";
import {
  useActionState,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { toast } from "sonner";
import { loadMoreImages } from "@/app/actions/load-more-images";
import { search } from "@/app/actions/search";
import { Preview } from "./preview";
import { ReactionDock } from "./reaction-dock";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogTitle } from "./ui/dialog";
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "./ui/empty";
import { Input } from "./ui/input";
import { Separator } from "./ui/separator";
import { UploadButton } from "./upload-button";
import { useUploadedImages } from "./uploaded-images-provider";

type ResultsClientProps = {
  defaultData: ListBlobResult["blobs"];
  initialCursor?: string;
  initialHasMore?: boolean;
};

type LightboxItem = {
  url: string;
  name?: string;
  description?: string;
  size?: number;
  prompt?: string;
};

const PRIORITY_COUNT = 12;

const getBlobUrl = (blob: { url?: string; downloadUrl?: string }) =>
  blob.downloadUrl ?? blob.url ?? "";

const getFilenameFromUrl = (url: string): string => {
  try {
    const pathname = new URL(url).pathname;
    const filename = pathname.split("/").pop() || "Untitled";
    // Remove file extension and clean up
    return decodeURIComponent(
      filename.replace(/\.[^/.]+$/, "").replaceAll("-", " ")
    );
  } catch {
    return "Untitled";
  }
};

const formatFileSize = (bytes?: number): string => {
  if (!bytes) return "Unknown size";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export const ResultsClient = ({
  defaultData,
  initialCursor,
  initialHasMore = false,
}: ResultsClientProps) => {
  const { images } = useUploadedImages();
  const [state, formAction, isPending] = useActionState(search, { data: [] });
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  // Infinite scroll state
  const [blobs, setBlobs] = useState(defaultData);
  const [cursor, setCursor] = useState(initialCursor);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Load more images function
  const loadMore = useCallback(async () => {
    if (isLoadingMore || !hasMore || !cursor) return;

    setIsLoadingMore(true);
    try {
      const result = await loadMoreImages(cursor);
      setBlobs((prev) => [...prev, ...result.blobs]);
      setCursor(result.cursor);
      setHasMore(result.hasMore);
    } catch (error) {
      console.error("Failed to load more images:", error);
      toast.error("Failed to load more images");
    } finally {
      setIsLoadingMore(false);
    }
  }, [cursor, hasMore, isLoadingMore]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoadingMore) {
          loadMore();
        }
      },
      { rootMargin: "200px" }
    );

    const currentRef = loadMoreRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [hasMore, isLoadingMore, loadMore]);

  useEffect(() => {
    if ("error" in state) {
      toast.error(state.error);
    }
  }, [state]);

  const reset = () => {
    window.location.reload();
  };

  const isShowingSearchResults =
    "data" in state && Array.isArray(state.data) && state.data.length > 0;

  const remoteBlobs = isShowingSearchResults ? state.data ?? [] : blobs;

  const galleryItems = useMemo<LightboxItem[]>(() => {
    const optimistic = images
      .map((image) => ({
        url: image.url,
        name: getFilenameFromUrl(image.url),
        size: undefined,
      }))
      .filter((item) => item.url);

    const persisted = (remoteBlobs ?? [])
      .map((blob) => ({
        url: getBlobUrl(blob),
        name: getFilenameFromUrl(getBlobUrl(blob)),
        size: "size" in blob ? blob.size : undefined,
      }))
      .filter((item) => item.url);

    return [...optimistic, ...persisted];
  }, [images, remoteBlobs]);

  const hasImages = galleryItems.length > 0;

  const openLightbox = useCallback((index: number) => {
    setLightboxIndex(index);
    setSelectedIndex(index);
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxIndex(null);
    // Keep selectedIndex so highlight persists in gallery
  }, []);

  const handleLightboxSelect = useCallback((index: number) => {
    setLightboxIndex(index);
    setSelectedIndex(index);
  }, []);

  return (
    <div className="h-[calc(100svh-var(--header-height))] w-full overflow-hidden md:h-[calc(100svh-var(--header-height)-1rem)]">
      <div className="relative h-full w-full">
        <div className="h-full w-full overflow-y-auto p-1 pb-24 md:p-2">
          {hasImages ? (
            <>
              <div className="grid grid-cols-2 gap-1 md:grid-cols-4 md:gap-2">
                {galleryItems.map((item: LightboxItem, index: number) => (
                  <Preview
                    key={`${item.url}-${index}`}
                    onClick={(): void => openLightbox(index)}
                    priority={index < PRIORITY_COUNT}
                    selected={selectedIndex === index}
                    url={item.url}
                  />
                ))}
              </div>
              {/* Infinite scroll trigger */}
              {!isShowingSearchResults && (
                <div ref={loadMoreRef} className="flex justify-center py-8">
                  {isLoadingMore && (
                    <Loader2Icon className="size-6 animate-spin text-muted-foreground" />
                  )}
                  {!hasMore && galleryItems.length > 0 && (
                    <p className="text-sm text-muted-foreground">
                      No more images to load
                    </p>
                  )}
                </div>
              )}
            </>
          ) : (
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
                  Upload some images with the{" "}
                  <ImageUpIcon className="inline size-4" /> button below to get
                  started!
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          )}
        </div>

        <form
          action={formAction}
          className="-translate-x-1/2 absolute bottom-8 left-1/2 z-10 flex w-full max-w-sm items-center gap-1 rounded-full bg-background p-1 shadow-xl sm:max-w-lg"
        >
          {isShowingSearchResults && (
            <Button
              className="shrink-0 rounded-full"
              disabled={isPending}
              onClick={reset}
              size="icon"
              type="button"
              variant="ghost"
            >
              <ArrowLeftIcon className="size-4" />
            </Button>
          )}
          <Input
            className="w-full rounded-full border-none bg-secondary shadow-none outline-none"
            disabled={isPending || !hasImages}
            id="search"
            name="search"
            placeholder="Search by description"
            required
          />
          {isPending ? (
            <Button className="shrink-0" disabled size="icon" variant="ghost">
              <Loader2Icon className="size-4 animate-spin" />
            </Button>
          ) : (
            <UploadButton />
          )}
        </form>
      </div>

      <ImageLightbox
        activeIndex={lightboxIndex}
        items={galleryItems}
        onClose={closeLightbox}
        onSelect={handleLightboxSelect}
      />
    </div>
  );
};

type ImageLightboxProps = {
  items: LightboxItem[];
  activeIndex: number | null;
  onClose: () => void;
  onSelect: (index: number) => void;
};

const ImageLightbox = ({
  items,
  activeIndex,
  onClose,
  onSelect,
}: ImageLightboxProps) => {
  const open = activeIndex !== null && items.length > 0;
  const [showInfo, setShowInfo] = useState(false); // Start collapsed on mobile
  const [isFavorited, setIsFavorited] = useState(false);
  const [copied, setCopied] = useState(false);
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    skipSnaps: false,
    loop: items.length > 1,
  });

  const currentItem = activeIndex !== null ? items[activeIndex] : null;

  useEffect(() => {
    if (!emblaApi || activeIndex === null) {
      return;
    }
    emblaApi.scrollTo(activeIndex, true);
  }, [emblaApi, activeIndex]);

  useEffect(() => {
    if (!emblaApi) {
      return;
    }

    const handleSelect = () => {
      const selected = emblaApi.selectedScrollSnap();
      onSelect(selected);
    };

    emblaApi.on("select", handleSelect);
    return () => {
      emblaApi.off("select", handleSelect);
    };
  }, [emblaApi, onSelect]);

  const scrollPrev = useCallback(() => {
    emblaApi?.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    emblaApi?.scrollNext();
  }, [emblaApi]);

  const handleDownload = useCallback(async () => {
    if (!currentItem?.url) return;
    try {
      const response = await fetch(currentItem.url);
      const blob = await response.blob();
      const url = globalThis.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = currentItem.name || "image";
      document.body.appendChild(a);
      a.click();
      globalThis.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success("Image downloaded!");
    } catch {
      toast.error("Failed to download image");
    }
  }, [currentItem]);

  const handleLike = useCallback(() => {
    setIsFavorited(!isFavorited);
    if (!isFavorited) {
      toast.success("Added to My Tatttz!");
    } else {
      toast.info("Removed from My Tatttz");
    }
  }, [isFavorited]);

  const handleShareToFriend = useCallback(async () => {
    if (!currentItem?.url) return;
    if (navigator.share) {
      try {
        await navigator.share({
          title: currentItem.name || "Check out this tattoo design",
          text:
            currentItem.description || "I found this amazing tattoo design!",
          url: currentItem.url,
        });
      } catch {
        // User cancelled or error
      }
    } else {
      // Fallback: copy link
      try {
        await navigator.clipboard.writeText(currentItem.url);
        toast.success("Link copied to clipboard!");
      } catch {
        toast.error("Failed to share");
      }
    }
  }, [currentItem]);

  const handleToggleInfo = useCallback(() => {
    setShowInfo(!showInfo);
  }, [showInfo]);

  const handleCopyPrompt = useCallback(async () => {
    const prompt = currentItem?.prompt || currentItem?.description;
    if (!prompt) {
      toast.error("No prompt available for this image");
      return;
    }
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      toast.success("Prompt copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy prompt");
    }
  }, [currentItem]);

  // Dock items configuration - Desktop (no info icon)
  const desktopDockItems = useMemo(
    () => [
      {
        icon: <HeartIcon className="size-6" />,
        label: "Like",
        onClick: handleLike,
      },
      {
        icon: <SendIcon className="size-6" />,
        label: "Share",
        onClick: handleShareToFriend,
      },
      {
        icon: <CopyIcon className="size-6" />,
        label: "Copy Prompt",
        onClick: handleCopyPrompt,
      },
    ],
    [handleLike, handleShareToFriend, handleCopyPrompt]
  );

  // Dock items configuration - Mobile (with info icon)
  const mobileDockItems = useMemo(
    () => [
      {
        icon: <HeartIcon className="size-6" />,
        label: "Like",
        onClick: handleLike,
      },
      {
        icon: <SendIcon className="size-6" />,
        label: "Share",
        onClick: handleShareToFriend,
      },
      {
        icon: <ChevronUpIcon className="size-6" />,
        label: "Info",
        onClick: handleToggleInfo,
      },
      {
        icon: <CopyIcon className="size-6" />,
        label: "Copy Prompt",
        onClick: handleCopyPrompt,
      },
    ],
    [handleLike, handleShareToFriend, handleToggleInfo, handleCopyPrompt]
  );

  if (!open) {
    return null;
  }

  return (
    <Dialog onOpenChange={(isOpen) => !isOpen && onClose()} open={open}>
      <DialogContent
        className="h-[100dvh] max-h-[100dvh] w-full max-w-full gap-0 border-none bg-background p-0 shadow-none md:h-[90vh] md:max-h-[90vh] md:max-w-6xl md:rounded-lg"
        showCloseButton={false}
      >
        <DialogTitle className="sr-only">Image preview</DialogTitle>
        <div className="relative flex h-full w-full flex-col overflow-hidden md:flex-row">
          {/* Close button - only visible on desktop OR when info panel is closed on mobile */}
          <Button
            aria-label="Close image viewer"
            className={`absolute top-4 right-4 z-30 ${
              showInfo ? "hidden md:flex" : "flex"
            }`}
            onClick={onClose}
            size="icon"
            variant="ghost"
          >
            <XIcon className="size-5" />
          </Button>

          {/* Image carousel area */}
          <div
            className={`relative flex-1 overflow-hidden ${
              showInfo ? "hidden md:flex" : "flex"
            } flex-col`}
          >
            <div className="h-full flex-1" ref={emblaRef}>
              <div className="flex h-full">
                {items.map((item, index) => {
                  const isNearActive =
                    activeIndex !== null && Math.abs(index - activeIndex) <= 1;
                  return (
                    <div
                      className="relative flex h-full w-full flex-[0_0_100%] items-center justify-center p-4 md:p-8"
                      key={`${item.url}-${index}`}
                    >
                      <div className="relative h-full w-full">
                        <Image
                          alt={item.name || "Image"}
                          className="object-contain"
                          fill
                          loading={isNearActive ? "eager" : "lazy"}
                          priority={index === activeIndex}
                          sizes="(max-width: 768px) 100vw, 70vw"
                          src={item.url}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Navigation arrows */}
            {items.length > 1 && (
              <div className="pointer-events-none absolute inset-0 flex items-center justify-between p-4">
                <Button
                  aria-label="Previous image"
                  className="pointer-events-auto rounded-full bg-background/80 backdrop-blur-sm"
                  onClick={scrollPrev}
                  size="icon"
                  variant="ghost"
                >
                  <ArrowLeftIcon className="size-5" />
                </Button>
                <Button
                  aria-label="Next image"
                  className="pointer-events-auto rounded-full bg-background/80 backdrop-blur-sm"
                  onClick={scrollNext}
                  size="icon"
                  variant="ghost"
                >
                  <ArrowRightIcon className="size-5" />
                </Button>
              </div>
            )}

            {/* Reaction Dock - Mobile version with Info icon */}
            <div className="absolute inset-x-0 bottom-4 z-30 flex justify-center md:hidden">
              <ReactionDock items={mobileDockItems} />
            </div>
            {/* Reaction Dock - Desktop version without Info icon */}
            <div className="absolute inset-x-0 bottom-4 z-30 hidden justify-center md:flex">
              <ReactionDock items={desktopDockItems} />
            </div>
          </div>

          {/* Info panel - Full screen on mobile, side panel on desktop */}
          <div
            className={`${
              showInfo ? "flex" : "hidden md:flex"
            } absolute inset-0 z-10 flex-col bg-background md:static md:inset-auto md:w-80 md:border-l`}
          >
            {/* Mobile header with back button */}
            <div className="flex items-center gap-3 border-b px-4 py-3 md:hidden">
              <Button
                aria-label="Back to image"
                onClick={() => setShowInfo(false)}
                size="icon"
                variant="ghost"
              >
                <ArrowLeftIcon className="size-5" />
              </Button>
              <span className="flex-1 text-sm font-medium">Image Details</span>
              <Button
                aria-label="Close"
                onClick={onClose}
                size="icon"
                variant="ghost"
              >
                <XIcon className="size-5" />
              </Button>
            </div>

            <div className="flex flex-1 flex-col overflow-y-auto p-4 pb-24 md:p-6 md:pb-6">
              {/* Title */}
              <h3 className="mb-2 line-clamp-2 text-lg font-semibold capitalize">
                {currentItem?.name || "Untitled"}
              </h3>

              {/* Description/Prompt */}
              <p className="mb-4 text-sm text-muted-foreground">
                {currentItem?.prompt ||
                  currentItem?.description ||
                  "No description available"}
              </p>

              <Separator className="my-4" />

              {/* Metadata */}
              <div className="mb-4 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Aspect Ratio</span>
                  <span className="font-medium">1:1</span>
                </div>
              </div>

              <Separator className="my-4" />

              {/* Download Action - above dock on mobile */}
              <div className="mt-auto">
                <Button
                  className="w-full gap-2"
                  onClick={handleDownload}
                  variant="default"
                >
                  <DownloadIcon className="size-4" />
                  Download Image
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
