import { Type } from "lucide-react";
import { defineField, defineType } from "sanity";

import { capitalize, createRadioListLayout } from "../../utils/helper";

const typographyVariants = ["h1", "h2", "h3", "h4", "h5", "h6", "body", "lead", "small", "muted"];
const typographyAlign = ["left", "center", "right"];

export const typography = defineType({
  name: "typography",
  title: "Typography",
  icon: Type,
  type: "object",
  fields: [
    defineField({
      name: "variant",
      type: "string",
      title: "Typography Style",
      description:
        "Choose the text style - h1 through h6 for headings, body for regular text, lead for emphasized text, small for fine print, and muted for less prominent text",
      initialValue: () => "body",
      options: createRadioListLayout(typographyVariants, {
        direction: "horizontal",
      }),
    }),
    defineField({
      name: "text",
      type: "string",
      title: "Text Content",
      description:
        "The actual text to display. For longer content, consider using the Rich Text block instead",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "align",
      type: "string",
      title: "Text Alignment",
      description:
        "How to align the text horizontally - left (default), center, or right",
      initialValue: () => "left",
      options: createRadioListLayout(typographyAlign, {
        direction: "horizontal",
      }),
    }),
    defineField({
      name: "color",
      type: "string",
      title: "Text Color",
      description:
        "Optional custom color. Leave empty to use default theme colors. Supports Tailwind color classes (e.g., 'blue-600') or hex values",
    }),
  ],
  preview: {
    select: {
      text: "text",
      variant: "variant",
      align: "align",
    },
    prepare: ({ text, variant, align }) => {
      const truncatedText = text?.length > 50 ? `${text.substring(0, 50)}...` : text;
      
      return {
        title: truncatedText || "Empty Text",
        subtitle: `${capitalize(variant ?? "body")} • ${capitalize(align ?? "left")} aligned`,
      };
    },
  },
});