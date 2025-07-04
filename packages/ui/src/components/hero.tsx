import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@workspace/ui/lib/utils";
import { Button, type ButtonProps } from "./button";

const heroVariants = cva("relative overflow-hidden", {
  variants: {
    variant: {
      default: "bg-background text-foreground",
      gradient: "bg-gradient-to-b from-muted/50 to-muted",
      dark: "bg-gray-900 text-white",
      "background-image": "text-white", // New variant for background images
    },
    size: {
      default: "py-24 md:py-32",
      sm: "py-16 md:py-20",
      lg: "py-32 md:py-48",
    },
    alignment: {
      left: "text-left",
      center: "text-center",
      right: "text-right",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
    alignment: "center",
  },
});

export interface HeroProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof heroVariants> {
  title?: string;
  subtitle?: string;
  description?: string;
  actions?: Array<ButtonProps & { text: string }>;
  backgroundImage?: string;
  overlay?: boolean;
}

const Hero = React.forwardRef<HTMLElement, HeroProps>(
  (
    {
      className,
      variant,
      size,
      alignment,
      title,
      subtitle,
      description,
      actions,
      backgroundImage,
      overlay = false,
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <section
        ref={ref}
        className={cn(heroVariants({ variant, size, alignment, className }))}
        {...props}
      >
        {backgroundImage && (
          <>
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${backgroundImage})` }}
            />
            {overlay && <div className="absolute inset-0 bg-black/50" />}
          </>
        )}

        <div className="container relative mx-auto px-4">
          <div
            className={cn(
              "mx-auto",
              alignment === "center" && "max-w-4xl",
              alignment === "left" && "max-w-2xl",
              alignment === "right" && "ml-auto max-w-2xl",
            )}
          >
            {subtitle && (
              <p className="mb-4 text-sm font-medium uppercase tracking-wide text-muted-foreground">
                {subtitle}
              </p>
            )}

            {title && (
              <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                {title}
              </h1>
            )}

            {description && (
              <p className="mb-8 text-lg text-muted-foreground md:text-xl">
                {description}
              </p>
            )}

            {actions && actions.length > 0 && (
              <div
                className={cn(
                  "flex flex-wrap gap-4",
                  alignment === "center" && "justify-center",
                  alignment === "right" && "justify-end",
                )}
              >
                {actions.map((action, index) => {
                  const { text, ...buttonProps } = action;
                  return (
                    <Button key={index} {...buttonProps}>
                      {text}
                    </Button>
                  );
                })}
              </div>
            )}

            {children}
          </div>
        </div>
      </section>
    );
  },
);
Hero.displayName = "Hero";

export { Hero, heroVariants };
