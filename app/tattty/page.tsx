"use client";

import { TATTTY_UI_TEXT } from "@/app/tattty/constants";
import { TextWordCarousel } from "@/components/word-carousel";
import { ScrollerHorizontal } from "@/components/horizontal-scroll";
import { ScrollerHidden } from "@/components/verticle-scroll";
import Q1Modal from "./Q1";
import Q2Modal from "./Q2";

export default function Ai02() {
  return (
    <div className="flex flex-col items-center p-4 sm:p-8 gap-24">
      <div className="flex flex-col items-center">
        <h2 className="text-4xl sm:text-6xl lg:text-8xl font-black tracking-tighter bg-clip-text text-transparent bg-linear-to-b from-foreground to-foreground/50 uppercase pt-3 sm:pt-4 md:pt-6 lg:pt-8">
          INK'D MEMORIES
        </h2>

        <p className="text-2xl sm:text-4xl lg:text-5xl font-semibold text-muted-foreground space-x-2 mt-8">
          <span>Your</span>
          <TextWordCarousel
            words={TATTTY_UI_TEXT.carouselWords}
            interval={2}
            duration={0.3}
            className="text-white font-bold"
          />
          <span>Our Ink</span>
        </p>
      </div>

      <div className="flex gap-12 w-full justify-center items-stretch">
        <div className="w-full flex justify-center">
          <div className="w-full max-w-2xl">
            <ScrollerHorizontal />

            <div className="mt-2.5">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-1/2">
                  <ScrollerHidden />
                </div>

                <div className="w-full md:w-1/2">
                  <ScrollerHidden />
                </div>
              </div>
            </div>

            {/* Two modals side-by-side using Radix Dialog (no hardcoded IDs) */}
            <div className="mt-6 w-full flex justify-center">
              <div className="w-full max-w-2xl">
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  {/* Modal 1 */}
                  <div className="flex-1 flex flex-col items-center">
                    <Q1Modal />
                  </div>

                  {/* Modal 2 */}
                  <div className="flex-1 flex flex-col items-center">
                    <Q2Modal />
                  </div>
                </div>
              </div>
            </div>
            {/* End two modals */}
          </div>
        </div>
      </div>
    </div>
  );
}
