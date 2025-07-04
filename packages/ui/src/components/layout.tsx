import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@workspace/ui/lib/utils";

// Section Component
const sectionVariants = cva("", {
  variants: {
    spacing: {
      none: "",
      sm: "py-8 md:py-12",
      default: "py-12 md:py-16 lg:py-20",
      lg: "py-16 md:py-24 lg:py-32",
      xl: "py-20 md:py-32 lg:py-40",
    },
  },
  defaultVariants: {
    spacing: "default",
  },
});

export interface SectionProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof sectionVariants> {
  as?: React.ElementType;
}

const Section = React.forwardRef<HTMLElement, SectionProps>(
  ({ className, spacing, as: Component = "section", ...props }, ref) => {
    return (
      <Component
        ref={ref}
        className={cn(sectionVariants({ spacing }), className)}
        {...props}
      />
    );
  },
);

Section.displayName = "Section";

// Grid Component
const gridVariants = cva("grid", {
  variants: {
    cols: {
      1: "grid-cols-1",
      2: "grid-cols-1 md:grid-cols-2",
      3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
      4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
      5: "grid-cols-1 md:grid-cols-2 lg:grid-cols-5",
      6: "grid-cols-1 md:grid-cols-3 lg:grid-cols-6",
      auto: "grid-cols-[repeat(auto-fit,minmax(250px,1fr))]",
    },
    gap: {
      none: "gap-0",
      sm: "gap-2 md:gap-4",
      default: "gap-4 md:gap-6",
      lg: "gap-6 md:gap-8",
      xl: "gap-8 md:gap-12",
    },
    align: {
      start: "items-start",
      center: "items-center",
      end: "items-end",
      stretch: "items-stretch",
    },
    justify: {
      start: "justify-start",
      center: "justify-center",
      end: "justify-end",
      between: "justify-between",
      around: "justify-around",
      evenly: "justify-evenly",
    },
  },
  defaultVariants: {
    cols: 1,
    gap: "default",
    align: "stretch",
    justify: "start",
  },
});

export interface GridProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof gridVariants> {}

const Grid = React.forwardRef<HTMLDivElement, GridProps>(
  ({ className, cols, gap, align, justify, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(gridVariants({ cols, gap, align, justify }), className)}
        {...props}
      />
    );
  },
);

Grid.displayName = "Grid";

// Flex Component
const flexVariants = cva("flex", {
  variants: {
    direction: {
      row: "flex-row",
      col: "flex-col",
      rowReverse: "flex-row-reverse",
      colReverse: "flex-col-reverse",
    },
    wrap: {
      nowrap: "flex-nowrap",
      wrap: "flex-wrap",
      wrapReverse: "flex-wrap-reverse",
    },
    align: {
      start: "items-start",
      center: "items-center",
      end: "items-end",
      stretch: "items-stretch",
      baseline: "items-baseline",
    },
    justify: {
      start: "justify-start",
      center: "justify-center",
      end: "justify-end",
      between: "justify-between",
      around: "justify-around",
      evenly: "justify-evenly",
    },
    gap: {
      none: "gap-0",
      sm: "gap-2",
      default: "gap-4",
      lg: "gap-6",
      xl: "gap-8",
    },
  },
  defaultVariants: {
    direction: "row",
    wrap: "nowrap",
    align: "stretch",
    justify: "start",
    gap: "default",
  },
});

export interface FlexProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof flexVariants> {}

const Flex = React.forwardRef<HTMLDivElement, FlexProps>(
  ({ className, direction, wrap, align, justify, gap, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          flexVariants({ direction, wrap, align, justify, gap }),
          className,
        )}
        {...props}
      />
    );
  },
);

Flex.displayName = "Flex";

// Stack Component (vertical flex with gap)
const stackVariants = cva("flex flex-col", {
  variants: {
    gap: {
      none: "gap-0",
      xs: "gap-1",
      sm: "gap-2",
      default: "gap-4",
      lg: "gap-6",
      xl: "gap-8",
    },
    align: {
      start: "items-start",
      center: "items-center",
      end: "items-end",
      stretch: "items-stretch",
    },
  },
  defaultVariants: {
    gap: "default",
    align: "stretch",
  },
});

export interface StackProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof stackVariants> {}

const Stack = React.forwardRef<HTMLDivElement, StackProps>(
  ({ className, gap, align, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(stackVariants({ gap, align }), className)}
        {...props}
      />
    );
  },
);

Stack.displayName = "Stack";

export {
  Section,
  sectionVariants,
  Grid,
  gridVariants,
  Flex,
  flexVariants,
  Stack,
  stackVariants,
};
