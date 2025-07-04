import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@workspace/ui/lib/utils";
import { typography as designSystemTypography, colors } from "../lib/design-system";

// Heading variants
const headingVariants = cva("font-semibold", {
  variants: {
    level: {
      1: "text-5xl leading-tight tracking-tight", // 61px
      2: "text-4xl leading-tight tracking-tight", // 48.8px
      3: "text-3xl leading-snug", // 39px
      4: "text-2xl leading-snug", // 31.25px
      5: "text-xl leading-normal", // 25px
      6: "text-lg leading-normal", // 20px
    },
    color: {
      default: "text-gray-900 dark:text-gray-100",
      primary: "text-primary-600 dark:text-primary-400",
      muted: "text-gray-600 dark:text-gray-400",
    },
    align: {
      left: "text-left",
      center: "text-center",
      right: "text-right",
    },
    weight: {
      normal: "font-normal",
      medium: "font-medium",
      semibold: "font-semibold",
      bold: "font-bold",
    },
  },
  defaultVariants: {
    level: 1,
    color: "default",
    align: "left",
    weight: "semibold",
  },
});

// Text variants
const textVariants = cva("", {
  variants: {
    size: {
      xs: "text-xs", // 12px
      sm: "text-sm", // 14px
      base: "text-base", // 16px
      lg: "text-lg", // 20px
      xl: "text-xl", // 25px
    },
    color: {
      default: "text-gray-700 dark:text-gray-300",
      primary: "text-primary-600 dark:text-primary-400",
      muted: "text-gray-500 dark:text-gray-400",
      error: "text-error-600 dark:text-error-400",
      success: "text-success-600 dark:text-success-400",
      warning: "text-warning-600 dark:text-warning-400",
    },
    weight: {
      normal: "font-normal",
      medium: "font-medium",
      semibold: "font-semibold",
      bold: "font-bold",
    },
    align: {
      left: "text-left",
      center: "text-center",
      right: "text-right",
      justify: "text-justify",
    },
    lineHeight: {
      tight: "leading-tight",
      snug: "leading-snug",
      normal: "leading-normal",
      relaxed: "leading-relaxed",
    },
    decoration: {
      none: "no-underline",
      underline: "underline",
      "line-through": "line-through",
    },
  },
  defaultVariants: {
    size: "base",
    color: "default",
    weight: "normal",
    align: "left",
    lineHeight: "normal",
    decoration: "none",
  },
});

// Heading component
export interface HeadingProps
  extends Omit<React.HTMLAttributes<HTMLHeadingElement>, 'color'>,
    VariantProps<typeof headingVariants> {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
}

export const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ className, level, color, align, weight, as, ...props }, ref) => {
    const Component = as || `h${level}`;
    
    return React.createElement(
      Component,
      {
        ref,
        className: cn(headingVariants({ level, color, align, weight }), className),
        ...props
      }
    );
  }
);
Heading.displayName = "Heading";

// Text component
export interface TextProps
  extends Omit<React.HTMLAttributes<HTMLParagraphElement>, 'color'>,
    VariantProps<typeof textVariants> {
  as?: "p" | "span" | "div" | "label";
}

export const Text = React.forwardRef<HTMLParagraphElement, TextProps>(
  (
    { 
      className, 
      size, 
      color, 
      weight, 
      align, 
      lineHeight, 
      decoration, 
      as: Component = "p", 
      ...props 
    }, 
    ref
  ) => {
    return React.createElement(
      Component,
      {
        ref,
        className: cn(
          textVariants({ size, color, weight, align, lineHeight, decoration }),
          className
        ),
        ...props
      }
    );
  }
);
Text.displayName = "Text";

// Specialized text components
export const Label = React.forwardRef<
  HTMLLabelElement,
  React.LabelHTMLAttributes<HTMLLabelElement> & VariantProps<typeof textVariants>
>(({ className, ...props }, ref) => (
  <label
    ref={ref}
    className={cn(
      textVariants({ size: "sm", weight: "medium", color: "default" }),
      "block",
      className
    )}
    {...props}
  />
));
Label.displayName = "Label";

export const Caption = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement> & VariantProps<typeof textVariants>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn(
      textVariants({ size: "xs", color: "muted" }),
      className
    )}
    {...props}
  />
));
Caption.displayName = "Caption";

export const Lead = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement> & VariantProps<typeof textVariants>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn(
      textVariants({ size: "xl", lineHeight: "relaxed", color: "muted" }),
      className
    )}
    {...props}
  />
));
Lead.displayName = "Lead";

// Link component
export interface LinkProps
  extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'color'>,
    VariantProps<typeof textVariants> {
  external?: boolean;
  underline?: boolean;
}

export const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  (
    { 
      className, 
      size, 
      color = "primary", 
      weight, 
      external, 
      underline = true,
      ...props 
    }, 
    ref
  ) => {
    const externalProps = external
      ? { target: "_blank", rel: "noopener noreferrer" }
      : {};

    return (
      <a
        ref={ref}
        className={cn(
          textVariants({ size, color, weight }),
          "transition-colors duration-200",
          underline && "underline decoration-1 underline-offset-2",
          "hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded-sm",
          className
        )}
        {...externalProps}
        {...props}
      />
    );
  }
);
Link.displayName = "Link";

// Code component
export interface CodeProps extends React.HTMLAttributes<HTMLElement> {
  block?: boolean;
}

export const Code = React.forwardRef<HTMLElement, CodeProps>(
  ({ className, block = false, ...props }, ref) => {
    const Component = block ? "pre" : "code";
    
    return React.createElement(
      Component,
      {
        ref,
        className: cn(
          "font-mono text-sm",
          block
            ? "block overflow-x-auto rounded-md bg-gray-900 p-4 text-gray-100"
            : "inline-block rounded bg-gray-100 px-1 py-0.5 text-gray-900 dark:bg-gray-800 dark:text-gray-100",
          className
        ),
        ...props
      }
    );
  }
);
Code.displayName = "Code";

// Export all variants for use in other components
export { headingVariants, textVariants };