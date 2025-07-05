import { Badge } from "@workspace/ui/components/badge";
import { cn } from "@workspace/ui/lib/utils";

import type { PagebuilderType } from "@/types";

import { CTACard } from "../image-link-card";
import { RichText } from "../richtext";

export type ImageLinkCardsProps = PagebuilderType<"imageLinkCards">;

export function ImageLinkCards({
  richText,
  title,
  eyebrow,
  cards,
}: ImageLinkCardsProps) {
  return (
    <section id="image-link-cards">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex w-full flex-col items-center">
          <div className="flex flex-col items-center space-y-4 text-center sm:space-y-6 md:text-center">
            <Badge className="bg-secondary text-secondary-foreground border-0 px-4 py-1">
              {eyebrow}
            </Badge>
            <h2 className="text-3xl font-semibold md:text-5xl text-balance">
              {title}
            </h2>
            <RichText richText={richText} className="text-balance" />
          </div>

          {/* Social Media Grid */}
          {Array.isArray(cards) && cards.length > 0 && (
            <div className="mt-12 grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {cards?.map((card, idx) => (
                <CTACard
                  key={card._key}
                  card={card}
                  className="bg-card hover:bg-muted/50 dark:bg-card dark:hover:bg-muted/30 transition-colors duration-300 rounded-2xl border border-border/50 hover:border-primary/30"
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
