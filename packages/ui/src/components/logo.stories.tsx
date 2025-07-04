import type { Meta, StoryObj } from "@storybook/react";

import { Logo } from "./logo";

const meta = {
  title: "Components/Logo",
  component: Logo,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: { type: "select" },
      options: ["sm", "default", "lg", "xl"],
    },
  },
} satisfies Meta<typeof Logo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    alt: "Sanity Logo",
  },
};

export const WithLink: Story = {
  args: {
    alt: "Sanity Logo",
    href: "/",
  },
};

export const Small: Story = {
  args: {
    size: "sm",
    alt: "Sanity Logo",
  },
};

export const Large: Story = {
  args: {
    size: "lg",
    alt: "Sanity Logo",
  },
};

export const ExtraLarge: Story = {
  args: {
    size: "xl",
    alt: "Sanity Logo",
  },
};

export const CustomImage: Story = {
  args: {
    src: "https://via.placeholder.com/200x50",
    alt: "Custom Logo",
  },
};

export const TextLogo: Story = {
  args: {
    text: "ACME Corp",
    src: undefined,
  },
};

export const WithCustomClass: Story = {
  args: {
    className: "text-blue-600",
    text: "Styled Text",
    src: undefined,
  },
};
