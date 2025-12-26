"use client";

import { useState, useEffect, useId } from "react";
import { motion, AnimatePresence, MotionConfig } from "motion/react";

const transition = {
  type: "spring",
  bounce: 0.05,
  duration: 0.3,
  mass: 0.5,
} as const;

interface IMediaModal {
  imgSrc?: string;
  videoSrc?: string;
  className?: string;
}

export function MediaModal({ imgSrc, videoSrc, className }: IMediaModal) {
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  const uniqueId = useId();

  useEffect(() => {
    if (isMediaModalOpen) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMediaModalOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMediaModalOpen]);

  return (
    <MotionConfig transition={transition}>
      <motion.div
        className={`cursor-pointer w-full h-full ${className || ''}`}
        layoutId={`dialog-${uniqueId}`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => {
          setIsMediaModalOpen(true);
        }}
      >
        {imgSrc && (
          <img
            src={imgSrc}
            alt="Tattoo preview"
            className="w-full h-full object-cover"
            loading="lazy"
          />
        )}
        {videoSrc && (
          <video
            src={videoSrc}
            className="w-full h-full object-cover"
            muted
            loop
            autoPlay
            playsInline
          />
        )}
      </motion.div>

      <AnimatePresence initial={false} mode="popLayout">
        {isMediaModalOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/80 z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setIsMediaModalOpen(false);
              }}
            />
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="relative max-w-[90vw] max-h-[90vh] bg-white rounded-2xl overflow-hidden shadow-2xl"
                layoutId={`dialog-${uniqueId}`}
                layout={isMediaModalOpen}
                tabIndex={-1}
                style={{
                  borderRadius: "16px",
                }}
              >
                {imgSrc && (
                  <motion.div
                    layoutId={`dialog-img-${uniqueId}`}
                    className="w-full h-full"
                    onClick={() => setIsMediaModalOpen(false)}
                  >
                    <img
                      src={imgSrc}
                      alt="Tattoo full view"
                      className="w-full h-full object-contain max-w-[90vw] max-h-[90vh]"
                      loading="lazy"
                    />
                  </motion.div>
                )}
                {videoSrc && (
                  <motion.div
                    layoutId={`dialog-video-${uniqueId}`}
                    className="w-full h-full"
                    onClick={() => setIsMediaModalOpen(false)}
                  >
                    <video
                      src={videoSrc}
                      className="w-full h-full object-contain max-w-[90vw] max-h-[90vh]"
                      controls
                      autoPlay
                      playsInline
                    />
                  </motion.div>
                )}
                {videoSrc && (
                  <button
                    onClick={() => setIsMediaModalOpen(false)}
                    className="absolute right-6 top-6 p-3 text-zinc-50 cursor-pointer dark:bg-gray-900 bg-gray-400 hover:bg-gray-500 rounded-xl dark:hover:bg-gray-800"
                    type="button"
                    aria-label="Close modal"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </MotionConfig>
  );
}
