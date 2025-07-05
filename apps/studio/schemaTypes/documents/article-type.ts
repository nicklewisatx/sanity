import { TagIcon } from "@heroicons/react/24/outline";
import { defineField, defineType } from "sanity";

import { GROUP, GROUPS } from "../../utils/constant";

export default defineType({
  name: "articleType",
  title: "Article Type",
  type: "document",
  icon: TagIcon,
  groups: GROUPS,
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      group: GROUP.MAIN_CONTENT,
      validation: (Rule) =>
        Rule.required().error("Article type name is required"),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      group: GROUP.MAIN_CONTENT,
      options: {
        source: "name",
        maxLength: 50,
        slugify: (input) =>
          input
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^\w\-]+/g, ""),
      },
      validation: (Rule) =>
        Rule.required().error("Slug is required for URL generation"),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 2,
      group: GROUP.MAIN_CONTENT,
      description: "Brief description of this article type",
    }),
    defineField({
      name: "color",
      title: "Badge Color",
      type: "string",
      group: GROUP.MAIN_CONTENT,
      options: {
        list: [
          {
            title: "Blue - Technology, tutorials, development guides",
            value: "blue",
          },
          { title: "Green - News, updates, success stories", value: "green" },
          {
            title: "Purple - Deep dives, advanced topics, research",
            value: "purple",
          },
          {
            title: "Red - Breaking news, alerts, important updates",
            value: "red",
          },
          {
            title: "Orange - Opinions, editorials, community content",
            value: "orange",
          },
          { title: "Yellow - Tips, quick wins, productivity", value: "yellow" },
          { title: "Pink - Reviews, comparisons, evaluations", value: "pink" },
          {
            title: "Indigo - Guides, how-tos, step-by-step content",
            value: "indigo",
          },
          {
            title: "Gray - Archive, legacy content, neutral topics",
            value: "gray",
          },
        ],
        layout: "radio",
      },
      initialValue: "blue",
      validation: (Rule) =>
        Rule.required().error("Color is required for badge display"),
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "description",
      color: "color",
    },
    prepare(selection) {
      const { title, subtitle, color } = selection;

      // Color emoji mapping for visual preview
      const colorEmoji: Record<string, string> = {
        blue: "🔵",
        green: "🟢",
        purple: "🟣",
        red: "🔴",
        orange: "🟠",
        yellow: "🟡",
        pink: "🩷",
        indigo: "🔮",
        gray: "⚪",
      };

      const colorDisplay = colorEmoji[color as string] || "⚫";

      return {
        title: `${colorDisplay} ${title}`,
        subtitle: subtitle || "No description",
      };
    },
  },
  orderings: [
    {
      title: "Name A-Z",
      name: "nameAsc",
      by: [{ field: "name", direction: "asc" }],
    },
    {
      title: "Color",
      name: "colorAsc",
      by: [{ field: "color", direction: "asc" }],
    },
  ],
});
