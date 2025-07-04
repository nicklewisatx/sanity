import { Badge } from "@workspace/ui/components/badge";
import { Container } from "@workspace/ui/components/container";

import type { PagebuilderType } from "@/types";

import { RichText } from "../richtext";
import { SanityButtons } from "../sanity-buttons";

export type CTABlockProps = PagebuilderType<"cta">;

export function CTABlock({ richText, title, eyebrow, buttons }: CTABlockProps) {
  return (
    <section id="features" className="my-6 md:my-16">
      <Container>
        <div className="bg-gradient-to-br from-secondary/30 via-muted to-accent/20 py-16 rounded-3xl px-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,hsl(var(--accent))_0%,transparent_50%)] opacity-20"></div>
          <div className="text-center max-w-3xl mx-auto space-y-8 relative z-10">
            {eyebrow && (
              <Badge className="bg-accent text-accent-foreground border-0 px-4 py-1 shadow-sm">
                {eyebrow}
              </Badge>
            )}
            <h2 className="text-3xl font-semibold md:text-5xl text-balance">
              {title}
            </h2>
            <div className="text-lg text-muted-foreground">
              <RichText richText={richText} className="text-balance" />
            </div>
            <div className="flex justify-center">
              <SanityButtons
                buttons={buttons}
                buttonClassName="w-full sm:w-auto"
                className="w-full sm:w-fit grid gap-2 sm:grid-flow-col lg:justify-start mb-8"
              />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
