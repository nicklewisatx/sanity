import { cn } from "@workspace/ui/lib/utils";
import Image from "next/image";
import Link from "next/link";

interface BrandedLogoProps {
  className?: string;
  priority?: boolean;
  variant?: "horizontal" | "stacked";
}

export function BrandedLogo({
  className,
  priority = false,
  variant = "horizontal",
}: BrandedLogoProps) {
  return (
    <Link
      href="/"
      className={cn(
        "flex items-center gap-3 hover:opacity-80 transition-opacity",
        variant === "stacked" && "flex-col gap-1 text-center",
        className,
      )}
    >
      <Image
        src="/logo.png"
        alt="Nick Lewis Logo"
        width={48}
        height={34}
        priority={priority}
        className={cn(
          "h-8 w-auto sm:h-10",
          // Dark mode: invert the logo colors for better visibility
          "dark:invert dark:brightness-0 dark:contrast-200",
        )}
      />
      <div
        className={cn(
          "flex flex-col justify-center",
          variant === "horizontal" && "items-start",
          variant === "stacked" && "items-center",
        )}
      >
        <span className="font-bold text-lg sm:text-xl leading-none tracking-tight">
          The Blog
        </span>
      </div>
    </Link>
  );
}
