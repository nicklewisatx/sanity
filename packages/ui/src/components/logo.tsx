import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@workspace/ui/lib/utils";

const logoVariants = cva(
  "inline-flex items-center justify-center font-semibold",
  {
    variants: {
      size: {
        default: "text-2xl",
        sm: "text-lg",
        lg: "text-4xl",
        xl: "text-6xl",
      },
    },
    defaultVariants: {
      size: "default",
    },
  },
);

export interface LogoProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof logoVariants> {
  src?: string;
  alt?: string;
  text?: string;
}

const Logo = React.forwardRef<HTMLDivElement, LogoProps>(
  ({ className, size, src, alt, text, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(logoVariants({ size, className }))}
        {...props}
      >
        {src ? (
          <img
            src={src}
            alt={alt || "Logo"}
            className="h-full w-auto object-contain"
          />
        ) : (
          <span>{text || "Logo"}</span>
        )}
      </div>
    );
  },
);
Logo.displayName = "Logo";

export { Logo, logoVariants };