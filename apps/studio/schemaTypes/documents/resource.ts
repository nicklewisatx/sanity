import { defineType, defineField } from "sanity";
import { Link } from "lucide-react";

export const resource = defineType({
  name: "resource",
  title: "Resource",
  type: "document",
  icon: Link,
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "link",
      title: "Resource Link",
      type: "url",
      validation: (Rule) =>
        Rule.required().uri({
          scheme: ["http", "https"],
        }),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "richText",
    }),
    defineField({
      name: "date",
      title: "Date",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: "technology",
      title: "Technology",
      type: "reference",
      to: [{ type: "technology" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      of: [{ type: "string" }],
      options: {
        layout: "tags",
      },
    }),
  ],
  preview: {
    select: {
      title: "title",
      technology: "technology.title",
      date: "date",
    },
    prepare({ title, technology, date }) {
      return {
        title,
        subtitle: `${technology || "No technology"} - ${new Date(date).toLocaleDateString()}`,
      };
    },
  },
});
