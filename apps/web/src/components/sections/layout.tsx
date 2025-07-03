"use client";
import { Container } from "@workspace/ui/components/container";
import { Flex, Grid, Section, Stack } from "@workspace/ui/components/layout";
import { useOptimistic } from "@sanity/visual-editing/react";
import { createDataAttribute, type SanityDocument } from "next-sanity";
import type { ComponentType } from "react";

import { dataset, projectId, studioUrl } from "@/lib/sanity/api";
import type { PagebuilderType } from "@/types";

import { CTABlock } from "./cta";
import { FaqAccordion } from "./faq-accordion";
import { FeatureCardsWithIcon } from "./feature-cards-with-icon";
import { HeroBlock } from "./hero";
import { ImageLinkCards } from "./image-link-cards";
import { SubscribeNewsletter } from "./subscribe-newsletter";
import { TypographyBlock } from "./typography";
import { RichText } from "../richtext";

type LayoutBlockProps = PagebuilderType<"layout">;

const BLOCK_COMPONENTS = {
  cta: CTABlock,
  faqAccordion: FaqAccordion,
  hero: HeroBlock,
  featureCardsIcon: FeatureCardsWithIcon,
  subscribeNewsletter: SubscribeNewsletter,
  imageLinkCards: ImageLinkCards,
  typography: TypographyBlock,
  layout: LayoutBlock as ComponentType<any>,
} as const;

type BlockType = keyof typeof BLOCK_COMPONENTS;

export function LayoutBlock({
  type = "section",
  sectionSpacing,
  containerSize,
  gridColumns,
  gridGap,
  flexDirection,
  flexAlign,
  flexJustify,
  flexGap,
  stackSpacing,
  background,
  content = [],
  _id,
  _type,
}: LayoutBlockProps & { _id?: string; _type?: string }) {
  const optimisticContent = useOptimistic<typeof content, SanityDocument<{ content: typeof content }>>(
    content,
    (currentContent, action) => {
      if (_id && action.id === _id && action.document.content) {
        return action.document.content;
      }
      return currentContent;
    }
  );

  const renderContent = () => {
    return optimisticContent.map((block: any) => {
      if (block._type === "richText") {
        return (
          <div
            key={block._key}
            data-sanity={_id ? createDataAttribute({
              id: _id,
              baseUrl: studioUrl,
              projectId: projectId,
              dataset: dataset,
              type: _type || "layout",
              path: `content[_key=="${block._key}"]`,
            }).toString() : undefined}
          >
            <RichText richText={block} />
          </div>
        );
      }

      const Component = BLOCK_COMPONENTS[block._type as BlockType];
      if (!Component) {
        return (
          <div
            key={block._key}
            className="flex items-center justify-center p-8 text-center text-muted-foreground bg-muted rounded-lg"
          >
            Component not found for block type: <code>{block._type}</code>
          </div>
        );
      }

      return (
        <div
          key={block._key}
          data-sanity={_id ? createDataAttribute({
            id: _id,
            baseUrl: studioUrl,
            projectId: projectId,
            dataset: dataset,
            type: _type || "layout",
            path: `content[_key=="${block._key}"]`,
          }).toString() : undefined}
        >
          <Component {...block} />
        </div>
      );
    });
  };

  const baseClassName = background ? `bg-${background}` : "";

  switch (type) {
    case "section":
      return (
        <Section spacing={sectionSpacing === "md" || sectionSpacing === "2xl" ? "lg" : sectionSpacing} className={baseClassName}>
          {renderContent()}
        </Section>
      );

    case "container":
      return (
        <Container 
          size={containerSize === "small" || containerSize === "medium" || containerSize === "large" ? "default" : containerSize} 
          className={baseClassName}
        >
          {renderContent()}
        </Container>
      );

    case "grid":
      const colsValue = gridColumns === "auto-fit" || gridColumns === "auto-fill" 
        ? "auto" 
        : (parseInt(gridColumns || "1") || 1) as 1 | 2 | 3 | 4 | 5 | 6 | "auto";
      
      return (
        <Grid 
          cols={colsValue}
          gap={gridGap === "md" || gridGap === "2xl" ? "lg" : gridGap}
          className={baseClassName}
        >
          {renderContent()}
        </Grid>
      );

    case "flex":
      return (
        <Flex
          direction={flexDirection === "column" ? "col" : flexDirection}
          align={flexAlign}
          justify={flexJustify}
          gap={flexGap === "md" || flexGap === "2xl" ? "lg" : flexGap}
          className={baseClassName}
        >
          {renderContent()}
        </Flex>
      );

    case "stack":
      return (
        <Stack 
          gap={stackSpacing === "md" || stackSpacing === "2xl" ? "lg" : stackSpacing}
          className={baseClassName}
        >
          {renderContent()}
        </Stack>
      );

    default:
      return <div className={baseClassName}>{renderContent()}</div>;
  }
}