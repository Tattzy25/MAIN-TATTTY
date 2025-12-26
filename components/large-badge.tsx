import { cn } from "@/lib/utils";

interface LargeBadgeProps {
  title: string;
  description?: string;
  className?: string;
  titleClassName?: string;
  descriptionClassName?: string;
}

export function LargeBadge({
  title,
  description,
  className,
  titleClassName,
  descriptionClassName,
}: LargeBadgeProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center space-y-8 text-center mb-8",
        className
      )}
    >
      <h2
        className={cn(
          "text-4xl sm:text-6xl lg:text-8xl font-black tracking-tighter bg-clip-text text-transparent bg-linear-to-b from-foreground to-foreground/50 uppercase pt-3 sm:pt-4 md:pt-6 lg:pt-8",
          titleClassName
        )}
      >
        {title}
      </h2>

      {description && (
        <p
          className={cn(
            "max-w-md text-muted-foreground text-lg sm:text-xl font-medium",
            descriptionClassName
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}
