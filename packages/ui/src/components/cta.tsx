import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@workspace/ui/lib/utils.js";
import { Button, type ButtonProps } from "./button.js";

const ctaVariants = cva("relative overflow-hidden rounded-lg", {
  variants: {
    variant: {
      default: "bg-muted/50",
      primary: "bg-primary text-primary-foreground",
      gradient:
        "bg-gradient-to-r from-primary to-primary/80 text-primary-foreground",
      bordered: "border-2 border-primary bg-background",
      dark: "bg-gray-900 text-white",
    },
    size: {
      default: "p-8 md:p-12",
      sm: "p-6 md:p-8",
      lg: "p-12 md:p-16",
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

export interface CTAProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof ctaVariants> {
  heading?: string;
  description?: string;
  actions?: Array<ButtonProps & { text: string }>;
  backgroundPattern?: boolean;
}

const CTA = React.forwardRef<HTMLElement, CTAProps>(
  (
    {
      className,
      variant,
      size,
      alignment,
      heading,
      description,
      actions,
      backgroundPattern = false,
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <section
        ref={ref}
        className={cn(ctaVariants({ variant, size, alignment, className }))}
        {...props}
      >
        {backgroundPattern && (
          <div className="absolute inset-0 opacity-10">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              }}
            />
          </div>
        )}

        <div className="relative">
          <div
            className={cn(
              "mx-auto",
              alignment === "center" && "max-w-3xl",
              alignment === "left" && "max-w-2xl",
              alignment === "right" && "ml-auto max-w-2xl",
            )}
          >
            {heading && (
              <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
                {heading}
              </h2>
            )}

            {description && (
              <p
                className={cn(
                  "mb-8 text-lg",
                  variant === "primary" ||
                    variant === "gradient" ||
                    variant === "dark"
                    ? "text-inherit opacity-90"
                    : "text-muted-foreground",
                )}
              >
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
                  // Adjust button variant for dark CTA backgrounds
                  const adjustedProps =
                    (variant === "primary" ||
                      variant === "gradient" ||
                      variant === "dark") &&
                    buttonProps.variant === "default"
                      ? { ...buttonProps, variant: "secondary" as const }
                      : buttonProps;

                  return (
                    <Button key={index} {...adjustedProps}>
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
CTA.displayName = "CTA";

export { CTA, ctaVariants };
