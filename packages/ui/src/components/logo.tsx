import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@workspace/ui/lib/utils";

const DEFAULT_LOGO_URL =
  "https://cdn.sanity.io/images/s6kuy1ts/production/68c438f68264717e93c7ba1e85f1d0c4b58b33c2-1200x621.svg";

const logoVariants = cva(
  "inline-flex items-center justify-center font-semibold",
  {
    variants: {
      size: {
        default: "h-10",
        sm: "h-8",
        lg: "h-12",
        xl: "h-16",
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
  href?: string;
  asChild?: boolean;
}

const Logo = React.forwardRef<HTMLDivElement, LogoProps>(
  (
    {
      className,
      size,
      src = DEFAULT_LOGO_URL,
      alt = "Logo",
      text,
      href,
      asChild,
      ...props
    },
    ref,
  ) => {
    const content = (
      <div
        ref={ref}
        className={cn(logoVariants({ size, className }))}
        {...props}
      >
        {src || text ? (
          src ? (
            <img
              src={src}
              alt={alt}
              className="h-full w-auto object-contain dark:invert"
              loading="eager"
              decoding="sync"
            />
          ) : (
            <span>{text}</span>
          )
        ) : null}
      </div>
    );

    if (href && !asChild) {
      return (
        <a href={href} className="inline-flex">
          {content}
        </a>
      );
    }

    return content;
  },
);
Logo.displayName = "Logo";

export { Logo, logoVariants };
