import { defineType, defineField } from "sanity";
import { Package } from "lucide-react";
import { seoFields } from "../../utils/seo-fields";
import { GROUP, GROUPS } from "../../utils/constant";

export const technology = defineType({
  name: "technology",
  title: "Technology",
  type: "document",
  icon: Package,
  groups: GROUPS,
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
      group: GROUP.MAIN_CONTENT,
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
      group: GROUP.MAIN_CONTENT,
    }),
    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      of: [{ type: "string" }],
      options: {
        layout: "tags",
      },
      group: GROUP.MAIN_CONTENT,
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "richText",
      group: GROUP.MAIN_CONTENT,
    }),
    defineField({
      name: "logo",
      title: "Logo",
      type: "image",
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: "alt",
          type: "string",
          title: "Alternative text",
          description: "Important for SEO and accessibility.",
        }),
      ],
      group: GROUP.MAIN_CONTENT,
    }),
    defineField({
      name: "homepage",
      title: "Homepage URL",
      type: "url",
      validation: (Rule) =>
        Rule.uri({
          scheme: ["http", "https"],
        }),
      group: GROUP.MAIN_CONTENT,
    }),
    defineField({
      name: "buzzRating",
      title: "Buzz Rating",
      type: "string",
      options: {
        list: [
          { title: "Bummer", value: "bummer" },
          { title: "Meh", value: "meh" },
          { title: "Good", value: "good" },
          { title: "Exciting", value: "exciting" },
          { title: "Fire", value: "fire" },
        ],
        layout: "radio",
      },
      group: GROUP.MAIN_CONTENT,
    }),
    ...seoFields,
  ],
  preview: {
    select: {
      title: "title",
      media: "logo",
      buzzRating: "buzzRating",
    },
    prepare({ title, media, buzzRating }) {
      const buzzEmoji: Record<string, string> = {
        bummer: "👎",
        meh: "😐",
        good: "👍",
        exciting: "🎉",
        fire: "🔥",
      };
      return {
        title,
        subtitle: buzzRating
          ? `${buzzEmoji[buzzRating]} ${buzzRating}`
          : undefined,
        media,
      };
    },
  },
});
