"use client";

import { motion } from "motion/react";
import AutoScroll from "embla-carousel-auto-scroll";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { QUESTIONS } from "@/app/tattty/constants";

export const TattooVisuals = ({ lists, style, setStyle, placement, setPlacement, color, setColor, mood, setMood, aspectRatio, setAspectRatio }: any) => {
  const { styles, placements, moods, aspectRatios } = lists;

  return (
    <div className="space-y-16">
      <PillCarouselSection title="Style" items={styles} selected={style} onSelect={setStyle} />
      <PillCarouselSection title="Placement" items={placements} selected={placement} onSelect={setPlacement} />
      <PillCarouselSection title="Color Palette" items={lists.colors ? lists.colors.map((c: any) => ({ id: c, label: c })) : []} selected={color} onSelect={setColor} />
      <PillCarouselSection title="Mood & Theme" items={moods.map((m: any) => ({ id: m, label: m }))} selected={mood} onSelect={setMood} />
      
      <div className="space-y-12 pt-8">
        <UniformBadgeSection 
            title="Frame Aspect" 
            items={aspectRatios.map((ar: any) => `${ar.label} (${ar.value})`)} 
            selected={`${aspectRatios.find((ar: any) => ar.value === aspectRatio)?.label} (${aspectRatio})`} 
            onSelect={(label: string) => {
                const match = label.match(/(.+) \((.+)\)/);
                if (match) {
                    setAspectRatio(match[2]);
                }
            }} 
            aspectRatios={aspectRatios} // Pass raw objects for lookup if needed
        />
      </div>
    </div>
  );
};

export const PillCarouselSection = ({ title, items, selected, onSelect }: any) => (
  <section className="space-y-6">
    <div className="flex flex-col items-center gap-2 text-center">
      <h2 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground/50">{title}</h2>
      <Badge variant="outline" className="font-black uppercase rounded-full px-4 py-1 border-primary/20 text-primary bg-primary/5">{items.find((i: any) => i.id === selected)?.label || selected}</Badge>
    </div>
    <div className="w-full px-4 md:px-12">
      <Carousel 
        opts={{ align: "center", loop: true, dragFree: true }} 
        plugins={[
          AutoScroll({
            speed: 1,
            startDelay: 0,
            stopOnInteraction: false,
            stopOnMouseEnter: true,
          }),
        ]}
        className="w-full"
      >
        <CarouselContent className="-ml-4 py-8 px-4">
          {items.map((item: any) => (
            <CarouselItem key={item.id} className="pl-4 basis-auto">
              <motion.div 
                whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}
                onClick={() => onSelect(item.id)}
              >
                <div className={cn(
                  "cursor-pointer px-8 py-3 rounded-full border-2 transition-all duration-300 whitespace-nowrap shadow-sm flex items-center justify-center",
                  selected === item.id 
                    ? "border-primary bg-primary text-primary-foreground shadow-md shadow-primary/10 scale-105" 
                    : "border-border/40 bg-card/50 hover:border-primary/30 hover:bg-muted/30 hover:shadow-sm"
                )}>
                  <span className="text-xl sm:text-2xl font-black uppercase tracking-tighter">{item.label}</span>
                </div>
              </motion.div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  </section>
);

export const UniformBadgeSection = ({ title, items, selected, onSelect, aspectRatios }: any) => (
  <section className="space-y-8">
    <div className="flex flex-col items-center gap-2 text-center">
      <h2 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground/50">{title}</h2>
      <Badge variant="outline" className="font-black uppercase rounded-full px-4 py-1 border-primary/20 text-primary bg-primary/5">{selected}</Badge>
    </div>
    <div className="flex flex-wrap justify-center gap-6">
      {items.map((item: any) => {
        const isSelected = selected === item;

        // Extract value for ratio
        let ratioValue = 1;
        const match = item.match(/\((.+)\)/);
        if (match) {
            const [w, h] = match[1].split(':').map(Number);
            if (w && h) ratioValue = w / h;
        }

        return (
          <motion.div
            key={item}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelect(item)}
            className={cn(
              "group cursor-pointer relative flex flex-col items-center justify-center w-32 h-32 rounded-3xl border-2 transition-all duration-300 bg-card",
              isSelected
                ? "border-primary bg-primary/5 shadow-md shadow-primary/10 ring-1 ring-primary"
                : "border-border/40 hover:border-primary/30 hover:bg-muted/20 hover:shadow-sm"
            )}
          >
            {/* Visual Ratio Box */}
            <div className="flex-1 w-full flex items-center justify-center p-4">
                <div 
                    className={cn(
                        "rounded border-2 transition-all duration-300",
                        isSelected ? "border-primary bg-primary/20" : "border-muted-foreground/30 group-hover:border-primary/50"
                    )}
                    style={{ 
                        width: ratioValue >= 1 ? '48px' : `${48 * ratioValue}px`,
                        height: ratioValue <= 1 ? '48px' : `${48 / ratioValue}px`
                    }}
                />
            </div>
            
            {/* Label */}
             <div className="pb-4 flex flex-col items-center gap-1.5">
                  <span className="text-xs font-black uppercase tracking-wider text-muted-foreground group-hover:text-primary transition-colors">
                    {item.split(' (')[0]}
                  </span>
                  {item.match(/\((.+)\)/) && (
                    <Badge variant="secondary" className={cn(
                        "text-[10px] px-2 py-0 h-5 font-bold pointer-events-none",
                        isSelected ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
                    )}>
                        {item.match(/\((.+)\)/)[1]}
                    </Badge>
                  )}
             </div>
           </motion.div>
        );
      })}
    </div>
  </section>
);

export const QuestionSection = ({ q1, setQ1, q2, setQ2, questions }: any) => {
  const displayQuestions = (questions && questions.length > 0) ? questions : QUESTIONS;
  
  return (
  <div className="flex flex-col gap-6">
    {displayQuestions.map((q: any, i: number) => (
      <Card key={q.id || i} className="group relative overflow-hidden border-border/50 bg-card/50 transition-all hover:border-primary/50 hover:shadow-md hover:shadow-primary/5">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
        <CardHeader className="relative">
          <CardTitle className="flex items-center gap-2 text-sm font-medium leading-none text-muted-foreground group-hover:text-primary transition-colors">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
              0{i + 1}
            </span>
            {q.question}
          </CardTitle>
        </CardHeader>
        <CardContent className="relative">
          <Textarea
            id={q.id || `q-${i}`}
            placeholder={q.placeholder}
            className="min-h-[120px] resize-y overflow-y-auto bg-background/50 focus:bg-background transition-colors"
            value={i === 0 ? q1 : q2}
            onChange={(e) => (i === 0 ? setQ1(e.target.value) : setQ2(e.target.value))}
          />
        </CardContent>
      </Card>
    ))}
  </div>
  );
};
