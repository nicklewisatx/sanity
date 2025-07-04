import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@workspace/ui/lib/utils";
// Removed unused import

const inputVariants = cva(
  "w-full rounded-md border bg-white dark:bg-gray-900 px-3 py-2 text-sm transition-colors duration-200 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "border-gray-300 dark:border-gray-700 focus:border-primary-500 focus:ring-primary-500 dark:focus:ring-primary-400",
        error: "border-error-500 dark:border-error-400 focus:border-error-500 focus:ring-error-500 dark:focus:ring-error-400",
        success: "border-success-500 dark:border-success-400 focus:border-success-500 focus:ring-success-500 dark:focus:ring-success-400",
      },
      size: {
        sm: "h-8 text-xs",
        md: "h-10 text-sm",
        lg: "h-12 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant, size, type = "text", ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(inputVariants({ variant, size }), className)}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

// Textarea component
const textareaVariants = cva(
  "w-full rounded-md border bg-white dark:bg-gray-900 px-3 py-2 text-sm transition-colors duration-200 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-y min-h-[80px]",
  {
    variants: {
      variant: {
        default: "border-gray-300 dark:border-gray-700 focus:border-primary-500 focus:ring-primary-500 dark:focus:ring-primary-400",
        error: "border-error-500 dark:border-error-400 focus:border-error-500 focus:ring-error-500 dark:focus:ring-error-400",
        success: "border-success-500 dark:border-success-400 focus:border-success-500 focus:ring-success-500 dark:focus:ring-success-400",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    VariantProps<typeof textareaVariants> {}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <textarea
        className={cn(textareaVariants({ variant }), className)}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";

// Select component
const selectVariants = cva(
  "w-full rounded-md border bg-white dark:bg-gray-900 px-3 py-2 text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none bg-no-repeat bg-[length:16px] bg-[position:right_12px_center]",
  {
    variants: {
      variant: {
        default: "border-gray-300 dark:border-gray-700 focus:border-primary-500 focus:ring-primary-500 dark:focus:ring-primary-400",
        error: "border-error-500 dark:border-error-400 focus:border-error-500 focus:ring-error-500 dark:focus:ring-error-400",
        success: "border-success-500 dark:border-success-400 focus:border-success-500 focus:ring-success-500 dark:focus:ring-success-400",
      },
      size: {
        sm: "h-8 text-xs",
        md: "h-10 text-sm",
        lg: "h-12 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

export interface SelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'>,
    VariantProps<typeof selectVariants> {}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, variant, size, children, ...props }, ref) => {
    return (
      <select
        className={cn(
          selectVariants({ variant, size }),
          "bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg%20xmlns%3d%22http%3a%2f%2fwww.w3.org%2f2000%2fsvg%22%20width%3d%2212%22%20height%3d%2212%22%20viewBox%3d%220%200%2012%2012%22%3e%3cpath%20fill%3d%22%23666%22%20d%3d%22M10.293%203.293%206%207.586%201.707%203.293A1%201%200%200%200%20.293%204.707l5%205a1%201%200%200%200%201.414%200l5-5a1%201%200%201%200-1.414-1.414z%22%2f%3e%3c%2fsvg%3e')]",
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </select>
    );
  }
);
Select.displayName = "Select";

// Checkbox component
export interface CheckboxProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, id, ...props }, ref) => {
    const generatedId = React.useId();
    const inputId = id || generatedId;
    
    return (
      <div className="flex items-center">
        <input
          type="checkbox"
          id={inputId}
          ref={ref}
          className={cn(
            "h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-800",
            className
          )}
          {...props}
        />
        {label && (
          <label
            htmlFor={inputId}
            className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            {label}
          </label>
        )}
      </div>
    );
  }
);
Checkbox.displayName = "Checkbox";

// Radio component
export interface RadioProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
  ({ className, label, id, ...props }, ref) => {
    const generatedId = React.useId();
    const inputId = id || generatedId;
    
    return (
      <div className="flex items-center">
        <input
          type="radio"
          id={inputId}
          ref={ref}
          className={cn(
            "h-4 w-4 border-gray-300 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-800",
            className
          )}
          {...props}
        />
        {label && (
          <label
            htmlFor={inputId}
            className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            {label}
          </label>
        )}
      </div>
    );
  }
);
Radio.displayName = "Radio";

// Form Field wrapper for consistent spacing and layout
export interface FormFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string;
  error?: string;
  hint?: string;
  required?: boolean;
}

export const FormField = React.forwardRef<HTMLDivElement, FormFieldProps>(
  ({ className, label, error, hint, required, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("space-y-2", className)} {...props}>
        {label && (
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {label}
            {required && <span className="text-error-500 ml-1">*</span>}
          </label>
        )}
        {children}
        {hint && !error && (
          <p className="text-xs text-gray-500 dark:text-gray-400">{hint}</p>
        )}
        {error && (
          <p className="text-xs text-error-600 dark:text-error-400">{error}</p>
        )}
      </div>
    );
  }
);
FormField.displayName = "FormField";

// Form Group for related fields
export const FormGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("space-y-4", className)} {...props} />
));
FormGroup.displayName = "FormGroup";

// Form Section for organizing forms
export interface FormSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
}

export const FormSection = React.forwardRef<HTMLDivElement, FormSectionProps>(
  ({ className, title, description, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("space-y-4", className)} {...props}>
        {(title || description) && (
          <div className="mb-4">
            {title && (
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                {title}
              </h3>
            )}
            {description && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {description}
              </p>
            )}
          </div>
        )}
        {children}
      </div>
    );
  }
);
FormSection.displayName = "FormSection";