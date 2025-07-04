import { LayoutGrid } from "lucide-react";
import { defineField, defineType } from "sanity";

import { capitalize, createRadioListLayout } from "../../utils/helper";

const layoutTypes = ["section", "container", "grid", "flex", "stack"];
const containerSizes = [
  "default",
  "full",
  "narrow",
  "wide",
  "small",
  "medium",
  "large",
];
const sectionSpacing = ["default", "sm", "md", "lg", "xl", "2xl"];
const gridColumns = ["1", "2", "3", "4", "5", "6", "auto-fit", "auto-fill"];
const flexDirection = ["row", "column"];
const flexAlign = ["start", "center", "end", "stretch", "baseline"];
const flexJustify = ["start", "center", "end", "between", "around", "evenly"];
const stackSpacing = ["default", "sm", "md", "lg", "xl", "2xl"];

export const layout = defineType({
  name: "layout",
  title: "Layout",
  icon: LayoutGrid,
  type: "object",
  fields: [
    defineField({
      name: "type",
      type: "string",
      title: "Layout Type",
      description:
        "Choose the layout structure - section for page sections, container for content width, grid for columns, flex for flexible layouts, or stack for vertical spacing",
      initialValue: () => "section",
      options: createRadioListLayout(layoutTypes, {
        direction: "horizontal",
      }),
      validation: (Rule) => Rule.required(),
    }),
    // Section-specific fields
    defineField({
      name: "sectionSpacing",
      type: "string",
      title: "Section Spacing",
      description: "Vertical padding for the section",
      initialValue: () => "default",
      options: createRadioListLayout(sectionSpacing, {
        direction: "horizontal",
      }),
      hidden: ({ parent }) => parent?.type !== "section",
    }),
    // Container-specific fields
    defineField({
      name: "containerSize",
      type: "string",
      title: "Container Size",
      description:
        "Maximum width of the container - full for edge-to-edge, default for standard width, or other sizes for specific layouts",
      initialValue: () => "default",
      options: createRadioListLayout(containerSizes, {
        direction: "horizontal",
      }),
      hidden: ({ parent }) => parent?.type !== "container",
    }),
    // Grid-specific fields
    defineField({
      name: "gridColumns",
      type: "string",
      title: "Grid Columns",
      description:
        "Number of columns in the grid. Use auto-fit or auto-fill for responsive grids that adjust to content",
      initialValue: () => "3",
      options: createRadioListLayout(gridColumns, {
        direction: "horizontal",
      }),
      hidden: ({ parent }) => parent?.type !== "grid",
    }),
    defineField({
      name: "gridGap",
      type: "string",
      title: "Grid Gap",
      description: "Space between grid items",
      initialValue: () => "default",
      options: createRadioListLayout(stackSpacing, {
        direction: "horizontal",
      }),
      hidden: ({ parent }) => parent?.type !== "grid",
    }),
    // Flex-specific fields
    defineField({
      name: "flexDirection",
      type: "string",
      title: "Flex Direction",
      description:
        "Direction of flex items - row for horizontal, column for vertical",
      initialValue: () => "row",
      options: createRadioListLayout(flexDirection, {
        direction: "horizontal",
      }),
      hidden: ({ parent }) => parent?.type !== "flex",
    }),
    defineField({
      name: "flexAlign",
      type: "string",
      title: "Align Items",
      description: "How to align items on the cross axis",
      initialValue: () => "start",
      options: createRadioListLayout(flexAlign, {
        direction: "horizontal",
      }),
      hidden: ({ parent }) => parent?.type !== "flex",
    }),
    defineField({
      name: "flexJustify",
      type: "string",
      title: "Justify Content",
      description: "How to distribute items along the main axis",
      initialValue: () => "start",
      options: createRadioListLayout(flexJustify, {
        direction: "horizontal",
      }),
      hidden: ({ parent }) => parent?.type !== "flex",
    }),
    defineField({
      name: "flexGap",
      type: "string",
      title: "Flex Gap",
      description: "Space between flex items",
      initialValue: () => "default",
      options: createRadioListLayout(stackSpacing, {
        direction: "horizontal",
      }),
      hidden: ({ parent }) => parent?.type !== "flex",
    }),
    // Stack-specific fields
    defineField({
      name: "stackSpacing",
      type: "string",
      title: "Stack Spacing",
      description: "Vertical space between stacked items",
      initialValue: () => "default",
      options: createRadioListLayout(stackSpacing, {
        direction: "horizontal",
      }),
      hidden: ({ parent }) => parent?.type !== "stack",
    }),
    // Common fields
    defineField({
      name: "background",
      type: "string",
      title: "Background Color",
      description:
        "Optional background color. Leave empty for transparent. Supports Tailwind color classes (e.g., 'gray-50') or hex values",
    }),
    defineField({
      name: "content",
      type: "array",
      title: "Content",
      description: "Add content blocks inside this layout",
      of: [
        { type: "hero" },
        { type: "cta" },
        { type: "featureCardsIcon" },
        { type: "faqAccordion" },
        { type: "imageLinkCards" },
        { type: "subscribeNewsletter" },
        { type: "typography" },
        { type: "layout" }, // Allow nested layouts
        { type: "richText" },
      ],
    }),
  ],
  preview: {
    select: {
      type: "type",
      containerSize: "containerSize",
      gridColumns: "gridColumns",
      flexDirection: "flexDirection",
      content: "content",
    },
    prepare: ({ type, containerSize, gridColumns, flexDirection, content }) => {
      let subtitle = capitalize(type ?? "section");

      if (type === "container") {
        subtitle += ` • ${capitalize(containerSize ?? "default")} width`;
      } else if (type === "grid") {
        subtitle += ` • ${gridColumns ?? "3"} columns`;
      } else if (type === "flex") {
        subtitle += ` • ${capitalize(flexDirection ?? "row")} direction`;
      }

      const contentCount = content?.length ?? 0;
      if (contentCount > 0) {
        subtitle += ` • ${contentCount} item${contentCount === 1 ? "" : "s"}`;
      }

      return {
        title: "Layout Block",
        subtitle,
      };
    },
  },
});
