import { ButtonV2 } from "@workspace/ui/components/button-v2";
import { cn } from "@workspace/ui/lib/utils";
import Link from "next/link";
import type { ComponentProps } from "react";

import type { SanityButtonProps } from "@/types";

type SanityButtonsProps = {
  buttons: SanityButtonProps[] | null;
  className?: string;
  buttonClassName?: string;
  size?: "sm" | "md" | "lg" | "xl" | null | undefined;
};

function SanityButton({
  text,
  href,
  variant = "default",
  openInNewTab,
  className,
  ...props
}: Omit<SanityButtonProps, "variant"> & {
  variant?: SanityButtonProps["variant"];
} & Omit<ComponentProps<typeof ButtonV2>, "variant">) {
  if (!href) {
    console.log("Link Broken", { text, href, variant, openInNewTab });
    return <ButtonV2 variant="outline">Link Broken</ButtonV2>;
  }

  // Map Sanity button variants to ButtonV2 variants
  let buttonVariant: "primary" | "secondary" | "outline" | "ghost" = "primary";
  if (variant === "default") {
    buttonVariant = "primary";
  } else if (variant === "secondary") {
    buttonVariant = "secondary";
  } else if (variant === "outline") {
    buttonVariant = "outline";
  } else if (variant === "link" || variant === "ghost") {
    buttonVariant = "ghost";
  }

  return (
    <ButtonV2
      variant={buttonVariant}
      {...props}
      asChild
      className={cn(className)}
    >
      <Link
        href={href || "#"}
        target={openInNewTab ? "_blank" : "_self"}
        aria-label={`Navigate to ${text}`}
        title={`Click to visit ${text}`}
      >
        {text}
      </Link>
    </ButtonV2>
  );
}

export function SanityButtons({
  buttons,
  className,
  buttonClassName,
  size = "md",
}: SanityButtonsProps) {
  if (!buttons?.length) return null;

  return (
    <div className={cn("flex flex-col sm:flex-row gap-4", className)}>
      {buttons.map((button) => (
        <SanityButton
          key={`button-${button._key}`}
          size={size}
          {...button}
          className={buttonClassName}
        />
      ))}
    </div>
  );
}
