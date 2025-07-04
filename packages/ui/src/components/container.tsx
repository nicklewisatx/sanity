import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@workspace/ui/lib/utils";

const containerVariants = cva("mx-auto w-full", {
  variants: {
    size: {
      default: "max-w-[1216px]",
      full: "max-w-none",
      narrow: "max-w-4xl",
      wide: "max-w-7xl",
      xs: "max-w-xs",
      sm: "max-w-sm",
      md: "max-w-md",
      lg: "max-w-lg",
      xl: "max-w-xl",
      "2xl": "max-w-2xl",
      "3xl": "max-w-3xl",
      "4xl": "max-w-4xl",
      "5xl": "max-w-5xl",
      "6xl": "max-w-6xl",
      "7xl": "max-w-7xl",
    },
    padding: {
      none: "",
      default: "px-4 sm:px-6 lg:px-8",
      sm: "px-2 sm:px-4 lg:px-6",
      lg: "px-6 sm:px-8 lg:px-10",
      xl: "px-8 sm:px-10 lg:px-12",
    },
  },
  defaultVariants: {
    size: "default",
    padding: "default",
  },
});

export interface ContainerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof containerVariants> {
  as?: React.ElementType;
}

const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, size, padding, as: Component = "div", ...props }, ref) => {
    return (
      <Component
        ref={ref}
        className={cn(containerVariants({ size, padding }), className)}
        {...props}
      />
    );
  },
);

Container.displayName = "Container";

export { Container, containerVariants };
