import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@workspace/ui/lib/utils";
import { components, spacing, typography, animation } from "../lib/design-system";

const buttonVariants = cva(
  [
    // Base styles
    "inline-flex items-center justify-center gap-2",
    "font-medium rounded-md",
    "transition-all duration-200 ease-out",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
    "disabled:pointer-events-none disabled:opacity-50",
    "select-none",
  ].join(" "),
  {
    variants: {
      variant: {
        primary: [
          "bg-primary-600 text-white",
          "hover:bg-primary-700",
          "active:bg-primary-800",
          "focus-visible:ring-primary-600",
        ].join(" "),
        secondary: [
          "bg-gray-100 text-gray-900",
          "hover:bg-gray-200",
          "active:bg-gray-300",
          "focus-visible:ring-gray-400",
          "dark:bg-gray-800 dark:text-gray-100",
          "dark:hover:bg-gray-700",
          "dark:active:bg-gray-600",
        ].join(" "),
        outline: [
          "border border-gray-300 bg-transparent text-gray-900",
          "hover:bg-gray-50",
          "active:bg-gray-100",
          "focus-visible:ring-gray-400",
          "dark:border-gray-600 dark:text-gray-100",
          "dark:hover:bg-gray-800",
          "dark:active:bg-gray-700",
        ].join(" "),
        ghost: [
          "text-gray-900",
          "hover:bg-gray-100",
          "active:bg-gray-200",
          "focus-visible:ring-gray-400",
          "dark:text-gray-100",
          "dark:hover:bg-gray-800",
          "dark:active:bg-gray-700",
        ].join(" "),
        danger: [
          "bg-error-500 text-white",
          "hover:bg-error-600",
          "active:bg-error-700",
          "focus-visible:ring-error-500",
        ].join(" "),
        success: [
          "bg-success-500 text-white",
          "hover:bg-success-600",
          "active:bg-success-700",
          "focus-visible:ring-success-500",
        ].join(" "),
      },
      size: {
        sm: [
          `h-8 px-3 text-sm`,
          "rounded-md",
        ].join(" "),
        md: [
          `h-10 px-4 text-base`,
          "rounded-md",
        ].join(" "),
        lg: [
          `h-12 px-6 text-lg`,
          "rounded-lg",
        ].join(" "),
        xl: [
          `h-14 px-8 text-xl`,
          "rounded-lg",
        ].join(" "),
      },
      fullWidth: {
        true: "w-full",
        false: "w-auto",
      },
      loading: {
        true: "relative text-transparent",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
      fullWidth: false,
      loading: false,
    },
  }
);

const loadingSpinnerVariants = cva(
  [
    "absolute inset-0 flex items-center justify-center",
  ].join(" "),
  {
    variants: {
      variant: {
        primary: "text-white",
        secondary: "text-gray-900 dark:text-gray-100",
        outline: "text-gray-900 dark:text-gray-100",
        ghost: "text-gray-900 dark:text-gray-100",
        danger: "text-white",
        success: "text-white",
      },
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const ButtonV2 = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      fullWidth,
      loading,
      asChild = false,
      disabled,
      leftIcon,
      rightIcon,
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";
    const isDisabled = disabled || loading;

    // When using asChild, we can't have multiple children
    // The child component should handle icons and loading state
    if (asChild) {
      return (
        <Slot
          className={cn(
            buttonVariants({ variant, size, fullWidth, loading, className })
          )}
          ref={ref}
          disabled={isDisabled}
          {...props}
        >
          {children}
        </Slot>
      );
    }

    return (
      <button
        className={cn(
          buttonVariants({ variant, size, fullWidth, loading, className })
        )}
        ref={ref}
        disabled={isDisabled}
        {...props}
      >
        {loading && (
          <span className={loadingSpinnerVariants({ variant })}>
            <LoadingSpinner />
          </span>
        )}
        {leftIcon && !loading && (
          <span className="inline-flex shrink-0">{leftIcon}</span>
        )}
        {children}
        {rightIcon && !loading && (
          <span className="inline-flex shrink-0">{rightIcon}</span>
        )}
      </button>
    );
  }
);
ButtonV2.displayName = "ButtonV2";

// Loading spinner component
const LoadingSpinner = () => (
  <svg
    className="animate-spin h-4 w-4"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
);

export { ButtonV2, buttonVariants };