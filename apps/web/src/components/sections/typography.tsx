import { Typography } from "@workspace/ui/components/typography";

import type { PagebuilderType } from "@/types";

type TypographyBlockProps = PagebuilderType<"typography">;

export function TypographyBlock({
  variant = "body",
  text,
  align = "left",
  color,
}: TypographyBlockProps) {
  if (!text) return null;

  return (
    <Typography
      variant={variant}
      className={`text-${align}${color ? ` text-${color}` : ""}`}
    >
      {text}
    </Typography>
  );
}
