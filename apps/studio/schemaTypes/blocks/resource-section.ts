import { defineType, defineField } from "sanity";
import { Link } from "lucide-react";

export const resourceSection = defineType({
  name: "resourceSection",
  title: "Resource Section",
  type: "object",
  icon: Link,
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
      name: "technology",
      title: "Filter by Technology",
      type: "reference",
      to: [{ type: "technology" }],
      description: "Optional: Show resources for a specific technology only",
    }),
    defineField({
      name: "limit",
      title: "Number of Resources",
      type: "number",
      initialValue: 6,
      validation: (Rule) => Rule.min(1).max(20),
    }),
    defineField({
      name: "showTechnology",
      title: "Show Technology Badge",
      type: "boolean",
      initialValue: true,
      description: "Display the technology badge on each resource",
    }),
  ],
  preview: {
    select: {
      title: "title",
      technology: "technology.title",
      limit: "limit",
    },
    prepare({ title, technology, limit }) {
      const subtitle = technology
        ? `${technology} resources (${limit} max)`
        : `All resources (${limit} max)`;
      return {
        title: title || "Resource Section",
        subtitle,
      };
    },
  },
});
