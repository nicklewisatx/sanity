import { Badge } from "@workspace/ui/components/badge";
import { Hero } from "@workspace/ui/components/hero";
import { urlFor } from "@/lib/sanity/client";

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
  // Build background image URL if image is provided
  const backgroundImage = image && image.asset
    ? urlFor(image.asset).width(1920).height(1080).url()
    : undefined;

  // For heroes with images, use the background-image variant
  if (image && image.asset) {
    return (
      <Hero
        id="hero"
        title={title || undefined}
        subtitle={badge || undefined}
        alignment="center"
        variant="background-image"
        backgroundImage={backgroundImage}
        overlay={true}
        className="mt-4 md:my-16"
      >
        {/* Rich text content as children */}
        {richText && (
          <div className="mt-6">
            <RichText
              richText={richText}
              className="text-base md:text-lg font-normal text-white/90"
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

  // For heroes without images, use the background-image variant with a default image
  return (
    <Hero
      id="hero"
      title={title || undefined}
      subtitle={badge || undefined}
      alignment="center"
      variant="background-image"
      backgroundImage="https://images.unsplash.com/photo-1557683316-973673baf926?w=1920&h=1080&fit=crop"
      overlay={true}
      className="mt-4 md:my-16"
    >
      {/* Rich text content as children */}
      {richText && (
        <div className="mt-6">
          <RichText
            richText={richText}
            className="text-base md:text-lg font-normal text-white/90"
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
