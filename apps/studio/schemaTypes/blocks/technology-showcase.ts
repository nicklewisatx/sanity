import { defineType, defineField } from "sanity";
import { Package } from "lucide-react";

export const technologyShowcase = defineType({
  name: "technologyShowcase",
  title: "Technology Showcase",
  type: "object",
  icon: Package,
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
    }),
    defineField({
      name: "subtitle",
      title: "Subtitle",
      type: "string",
    }),
    defineField({
      name: "technologies",
      title: "Technologies",
      type: "array",
      of: [{ type: "reference", to: [{ type: "technology" }] }],
      validation: (Rule) => Rule.min(1).max(12),
    }),
    defineField({
      name: "columns",
      title: "Columns",
      type: "number",
      initialValue: 3,
      options: {
        list: [
          { title: "2 Columns", value: 2 },
          { title: "3 Columns", value: 3 },
          { title: "4 Columns", value: 4 },
        ],
      },
    }),
  ],
  preview: {
    select: {
      title: "title",
      technologies: "technologies",
    },
    prepare({ title, technologies }) {
      return {
        title: title || "Technology Showcase",
        subtitle: `${technologies?.length || 0} technologies`,
      };
    },
  },
});
