import { Text, Heading } from "@workspace/ui/components/typography";

import type { PagebuilderType } from "@/types";

type TypographyBlockProps = PagebuilderType<"typography">;

export function TypographyBlock({
  variant = "body",
  text,
  align = "left",
  color,
}: TypographyBlockProps) {
  if (!text) return null;

  // Map variants to the appropriate component
  const isHeading = variant && ["h1", "h2", "h3", "h4", "h5", "h6"].includes(variant);
  
  if (isHeading) {
    const level = parseInt(variant.charAt(1)) as 1 | 2 | 3 | 4 | 5 | 6;
    return (
      <Heading
        level={level}
        align={align}
        color={color === "primary" || color === "muted" ? color : "default"}
      >
        {text}
      </Heading>
    );
  }

  // Map body variants to Text component sizes
  const sizeMap: Record<string, "xs" | "sm" | "base" | "lg" | "xl"> = {
    "body-xs": "xs",
    "body-sm": "sm",
    "body": "base",
    "body-lg": "lg",
    "body-xl": "xl",
  };

  return (
    <Text
      size={sizeMap[variant] || "base"}
      align={align}
      color={(color as any) || "default"}
    >
      {text}
    </Text>
  );
}
