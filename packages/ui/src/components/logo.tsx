import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@workspace/ui/lib/utils";

const logoVariants = cva(
  "group inline-flex items-center font-bold tracking-tight transition-all duration-300",
  {
    variants: {
      size: {
        default: "text-2xl",
        sm: "text-xl",
        lg: "text-3xl",
        xl: "text-4xl",
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
  primary?: string;
  secondary?: string;
  separator?: string;
  href?: string;
  asChild?: boolean;
}

const Logo = React.forwardRef<HTMLDivElement, LogoProps>(
  (
    {
      className,
      size,
      primary = "Nick Lewis",
      secondary = "The Blog",
      separator = ":",
      href,
      asChild,
      ...props
    },
    ref,
  ) => {
    const content = (
      <div className="relative">
        <div
          ref={ref}
          className={cn(logoVariants({ size, className }), "group-hover:tracking-wide")}
          {...props}
        >
          <span className="bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent">
            {primary}
          </span>
          <span className="mx-2 text-gray-400 dark:text-gray-600 font-light">
            {separator}
          </span>
          <span className="font-light text-gray-600 dark:text-gray-400">
            {secondary}
          </span>
        </div>
        <div className="absolute -bottom-1 left-0 h-0.5 w-0 bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300 group-hover:w-full" />
      </div>
    );

    if (href && !asChild) {
      return (
        <a href={href} className="group inline-flex">
          {content}
        </a>
      );
    }

    return content;
  },
);
Logo.displayName = "Logo";

export { Logo, logoVariants };
