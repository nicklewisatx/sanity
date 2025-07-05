import { CpuChipIcon } from "@heroicons/react/24/outline";
import { defineField, defineType } from "sanity";

import { GROUP, GROUPS } from "../../utils/constant";
import { ogFields } from "../../utils/og-fields";
import { seoFields } from "../../utils/seo-fields";

export default defineType({
  name: "technology",
  title: "Technology",
  type: "document",
  icon: CpuChipIcon,
  groups: GROUPS,
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      group: GROUP.MAIN_CONTENT,
      validation: (Rule) =>
        Rule.required().error("Technology name is required"),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
      group: GROUP.MAIN_CONTENT,
      validation: (Rule) =>
        Rule.required()
          .min(10)
          .max(500)
          .error("Description must be between 10-500 characters"),
    }),
    defineField({
      name: "github",
      title: "GitHub URL",
      type: "url",
      group: GROUP.MAIN_CONTENT,
      validation: (Rule) =>
        Rule.uri({
          scheme: ["https"],
          allowRelative: false,
        }).custom((url) => {
          if (url && !url.includes("github.com")) {
            return "URL must be a GitHub repository";
          }
          return true;
        }),
    }),
    defineField({
      name: "dateAdded",
      title: "Date Added",
      type: "date",
      group: GROUP.MAIN_CONTENT,
      initialValue: () => new Date().toISOString().split("T")[0],
      validation: (Rule) => Rule.required().error("Date added is required"),
    }),
    defineField({
      name: "overallRating",
      title: "Overall Rating",
      type: "number",
      group: GROUP.MAIN_CONTENT,
      options: {
        list: [
          { title: "👎 Thumbs Down", value: -1 },
          { title: "👌 Thumbs Sideways", value: 0 },
          { title: "👍 Thumbs Up", value: 1 },
        ],
        layout: "radio",
      },
      initialValue: 0,
      validation: (Rule) =>
        Rule.required().custom((value) => {
          if (value !== -1 && value !== 0 && value !== 1) {
            return "Rating must be -1 (thumbs down), 0 (thumbs sideways), or 1 (thumbs up)";
          }
          return true;
        }),
    }),
    defineField({
      name: "logo",
      title: "Logo",
      type: "image",
      group: GROUP.MAIN_CONTENT,
      options: {
        hotspot: true,
        accept: ".png,.jpg,.jpeg,.svg,.webp",
      },
      fields: [
        {
          name: "alt",
          title: "Alternative Text",
          type: "string",
          validation: (Rule) =>
            Rule.required().error("Alt text is required for accessibility"),
        },
      ],
      validation: (Rule) => Rule.required().error("Logo is required"),
    }),
    // SEO fields
    ...seoFields,
    // Open Graph fields
    ...ogFields,
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "description",
      media: "logo",
      rating: "overallRating",
      github: "github",
    },
    prepare(selection) {
      const { title, subtitle, media, rating, github } = selection;

      // Rating emoji mapping
      const ratingEmoji: Record<number, string> = {
        [-1]: "👎",
        [0]: "👌",
        [1]: "👍",
      };

      const ratingDisplay = ratingEmoji[rating as number] || "❓";
      const hasGitHub = github ? "🔗" : "";

      return {
        title: `${ratingDisplay} ${title}`,
        subtitle: `${hasGitHub} ${subtitle?.slice(0, 60)}${subtitle?.length > 60 ? "..." : ""}`,
        media,
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
      title: "Rating (High to Low)",
      name: "ratingDesc",
      by: [{ field: "overallRating", direction: "desc" }],
    },
    {
      title: "Date Added (Newest)",
      name: "dateDesc",
      by: [{ field: "dateAdded", direction: "desc" }],
    },
  ],
});
