import type { Meta, StoryObj } from "@storybook/react";
import { Hero } from "./hero.js";

const meta = {
  title: "Components/Hero",
  component: Hero,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "gradient", "dark"],
    },
    size: {
      control: "select",
      options: ["sm", "default", "lg"],
    },
    alignment: {
      control: "select",
      options: ["left", "center", "right"],
    },
  },
} satisfies Meta<typeof Hero>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "Welcome to Our Platform",
    subtitle: "Revolutionary Solution",
    description:
      "Build amazing products with our cutting-edge technology. Get started today and transform your business.",
    actions: [
      { text: "Get Started", variant: "default" },
      { text: "Learn More", variant: "outline" },
    ],
  },
};

export const Gradient: Story = {
  args: {
    variant: "gradient",
    title: "Beautiful Gradients",
    description:
      "Create stunning visual experiences with gradient backgrounds.",
    actions: [{ text: "Explore Features" }],
  },
};

export const Dark: Story = {
  args: {
    variant: "dark",
    title: "Dark Mode Hero",
    description: "Perfect for creating dramatic, high-contrast sections.",
    actions: [
      { text: "Start Free Trial", variant: "default" },
      { text: "View Pricing", variant: "secondary" },
    ],
  },
};

export const LeftAligned: Story = {
  args: {
    alignment: "left",
    title: "Left-Aligned Content",
    subtitle: "Asymmetric Design",
    description:
      "Sometimes you need your hero content aligned to the left for a more dynamic layout.",
    actions: [{ text: "Learn More", variant: "default" }],
  },
};

export const RightAligned: Story = {
  args: {
    alignment: "right",
    title: "Right-Aligned Content",
    subtitle: "Unique Layout",
    description:
      "Right-aligned content can create visual interest and break conventional patterns.",
    actions: [{ text: "Discover More", variant: "default" }],
  },
};

export const WithBackgroundImage: Story = {
  args: {
    backgroundImage:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920&h=1080&fit=crop",
    overlay: true,
    variant: "dark",
    title: "Stunning Visuals",
    description: "Combine beautiful imagery with compelling content.",
    actions: [{ text: "Get Started", variant: "default" }],
  },
};

export const Small: Story = {
  args: {
    size: "sm",
    title: "Compact Hero Section",
    description: "Perfect for inner pages or when you need a smaller hero.",
    actions: [{ text: "Learn More", variant: "outline" }],
  },
};

export const Large: Story = {
  args: {
    size: "lg",
    title: "Make a Big Statement",
    subtitle: "Go Big or Go Home",
    description:
      "When you need maximum impact, use the large hero variant to capture attention.",
    actions: [
      { text: "Start Now", variant: "default", size: "lg" },
      { text: "Watch Demo", variant: "outline", size: "lg" },
    ],
  },
};

export const MinimalHero: Story = {
  args: {
    title: "Simple and Clean",
  },
};

export const NoActions: Story = {
  args: {
    title: "Information Only",
    subtitle: "Sometimes Less is More",
    description:
      "Not every hero needs call-to-action buttons. Sometimes you just want to convey information.",
  },
};
