import { Badge } from "@workspace/ui/components/badge";
import { Hero } from "@workspace/ui/components/hero";

import type { PagebuilderType } from "@/types";

import { RichText } from "../richtext";
import { SanityButtons } from "../sanity-buttons";
import { SanityImage } from "../sanity-image";

type HeroBlockProps = PagebuilderType<"hero">;

/**
 * Adapter component that bridges Sanity data with the UI Hero component
 * Maintains backward compatibility while leveraging shared UI components
 */
export function HeroBlock({
  title,
  buttons,
  badge,
  image,
  richText,
}: HeroBlockProps) {
  // For layouts with images, we'll keep the custom implementation
  // For simpler heroes without images, we can use the UI component
  if (image) {
    return (
      <section id="hero" className="mt-4 md:my-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid items-center gap-8 lg:grid-cols-2">
            <div className="grid h-full grid-rows-[auto_1fr_auto] gap-4 items-center justify-items-center text-center lg:items-start lg:justify-items-start lg:text-left">
              {badge && <Badge variant="secondary">{badge}</Badge>}
              <div className="grid gap-4">
                <h1 className="text-4xl lg:text-6xl font-semibold text-balance">
                  {title}
                </h1>
                <RichText
                  richText={richText}
                  className="text-base md:text-lg font-normal"
                />
              </div>

              <SanityButtons
                buttons={buttons}
                buttonClassName="w-full sm:w-auto"
                className="w-full sm:w-fit grid gap-2 sm:grid-flow-col lg:justify-start mb-8"
              />
            </div>

            <div className="h-96 w-full">
              <SanityImage
                asset={image}
                loading="eager"
                width={800}
                height={800}
                priority
                quality={80}
                className="max-h-96 w-full rounded-3xl object-cover"
              />
            </div>
          </div>
        </div>
      </section>
    );
  }

  // For heroes without images, use the UI component
  return (
    <Hero
      id="hero"
      title={title || undefined}
      subtitle={badge || undefined}
      alignment="center"
      className="mt-4 md:my-16"
    >
      {/* Rich text content as children */}
      {richText && (
        <div className="mt-6">
          <RichText
            richText={richText}
            className="text-base md:text-lg font-normal text-muted-foreground"
          />
        </div>
      )}

      {/* Buttons section */}
      {buttons && buttons.length > 0 && (
        <div className="mt-8">
          <SanityButtons
            buttons={buttons}
            buttonClassName="w-full sm:w-auto"
            className="w-full sm:w-fit grid gap-2 sm:grid-flow-col justify-center"
          />
        </div>
      )}
    </Hero>
  );
}
