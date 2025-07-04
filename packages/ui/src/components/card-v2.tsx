import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@workspace/ui/lib/utils";
import { spacing } from "../lib/design-system";

const cardVariants = cva(
  "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 transition-all duration-200",
  {
    variants: {
      variant: {
        default: "hover:border-gray-300 dark:hover:border-gray-600",
        interactive: "cursor-pointer hover:shadow-md hover:border-primary-300 dark:hover:border-primary-700",
        elevated: "shadow-md hover:shadow-lg border-transparent",
        ghost: "border-transparent hover:bg-gray-50 dark:hover:bg-gray-900",
      },
      size: {
        sm: "p-4",
        md: "p-6",
        lg: "p-8",
        xl: "p-10",
      },
      radius: {
        none: "rounded-none",
        sm: "rounded",
        md: "rounded-md",
        lg: "rounded-lg",
        xl: "rounded-xl",
        full: "rounded-2xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
      radius: "lg",
    },
  }
);

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  as?: React.ElementType;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, size, radius, as: Component = "div", ...props }, ref) => {
    return (
      <Component
        ref={ref}
        className={cn(cardVariants({ variant, size, radius }), className)}
        {...props}
      />
    );
  }
);
Card.displayName = "Card";

// Card Header
export const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("mb-4 pb-4 border-b border-gray-200 dark:border-gray-700", className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

// Card Title
export const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("text-lg font-semibold text-gray-900 dark:text-gray-100", className)}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

// Card Description
export const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-gray-600 dark:text-gray-400 mt-1", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

// Card Content
export const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("", className)} {...props} />
));
CardContent.displayName = "CardContent";

// Card Footer
export const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("mt-6 pt-4 border-t border-gray-200 dark:border-gray-700", className)}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

// Card Grid for layouts
export interface CardGridProps extends React.HTMLAttributes<HTMLDivElement> {
  cols?: 1 | 2 | 3 | 4;
  gap?: keyof typeof spacing;
}

export const CardGrid = React.forwardRef<HTMLDivElement, CardGridProps>(
  ({ className, cols = 3, gap = 6, children, ...props }, ref) => {
    const gridCols = {
      1: "grid-cols-1",
      2: "grid-cols-1 md:grid-cols-2",
      3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
      4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "grid",
          gridCols[cols],
          `gap-${gap}`,
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
CardGrid.displayName = "CardGrid";