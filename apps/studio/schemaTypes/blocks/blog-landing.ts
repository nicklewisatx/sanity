import { BookOpen } from "lucide-react";
import { defineField, defineType } from "sanity";

export const blogLanding = defineType({
  name: "blogLanding",
  title: "Blog Landing",
  type: "object",
  icon: BookOpen,
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      description: "The main heading for the blog listing section",
      initialValue: "Latest Articles",
    }),
    defineField({
      name: "subtitle",
      title: "Subtitle",
      type: "text",
      rows: 2,
      description: "Optional subtitle text to display below the title",
    }),
    defineField({
      name: "postsPerPage",
      title: "Posts Per Page",
      type: "number",
      description: "Number of blog posts to display per page",
      initialValue: 9,
      validation: (Rule) => Rule.min(1).max(20),
    }),
    defineField({
      name: "showFilters",
      title: "Show Filters",
      type: "boolean",
      description: "Enable filtering by article type and technologies",
      initialValue: true,
    }),
    defineField({
      name: "showSearch",
      title: "Show Search",
      type: "boolean",
      description: "Enable search functionality for blog posts",
      initialValue: true,
    }),
    defineField({
      name: "layout",
      title: "Layout",
      type: "string",
      description: "Choose the layout style for blog cards",
      options: {
        list: [
          { title: "Grid (3 columns)", value: "grid-3" },
          { title: "Grid (2 columns)", value: "grid-2" },
          { title: "List", value: "list" },
        ],
        layout: "radio",
      },
      initialValue: "grid-3",
    }),
  ],
  preview: {
    select: {
      title: "title",
      postsPerPage: "postsPerPage",
      layout: "layout",
    },
    prepare: ({ title, postsPerPage, layout }) => ({
      title: title || "Blog Landing",
      subtitle: `Blog Landing - ${postsPerPage || 9} posts, ${layout || "grid-3"} layout`,
    }),
  },
});