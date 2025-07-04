import type { Meta, StoryObj } from "@storybook/react";
import { Hero } from "./hero";

// BlogHeader story using the Hero component
const meta = {
  title: "Components/BlogHeader",
  component: Hero,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Hero>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "Our Blog",
    description: "Insights, stories, and updates from our team",
    backgroundImage:
      "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1920&h=1080&fit=crop",
    overlay: true,
    variant: "background-image",
    size: "sm",
    alignment: "center",
  },
};

export const WithoutOverlay: Story = {
  args: {
    title: "Blog & News",
    description: "Stay up to date with our latest articles",
    backgroundImage:
      "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=1920&h=1080&fit=crop",
    overlay: false,
    variant: "default",
    size: "sm",
    alignment: "center",
  },
};

export const LargeHeader: Story = {
  args: {
    title: "Explore Our Stories",
    description: "Deep dives into technology, design, and innovation",
    backgroundImage:
      "https://images.unsplash.com/photo-1432821596592-e2c18b78144f?w=1920&h=1080&fit=crop",
    overlay: true,
    variant: "background-image",
    size: "default",
    alignment: "center",
  },
};

export const MinimalBlogHeader: Story = {
  args: {
    title: "Blog",
    backgroundImage:
      "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1920&h=1080&fit=crop",
    overlay: true,
    variant: "background-image",
    size: "sm",
    alignment: "center",
  },
};
