import type { Meta, StoryObj } from "@storybook/react";
import { Logo } from "./logo.js";

const meta = {
  title: "Components/Logo",
  component: Logo,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "default", "lg", "xl"],
    },
  },
} satisfies Meta<typeof Logo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Text: Story = {
  args: {
    text: "Acme Corp",
  },
};

export const Image: Story = {
  args: {
    src: "https://via.placeholder.com/150x50",
    alt: "Company Logo",
  },
};

export const Small: Story = {
  args: {
    text: "Acme Corp",
    size: "sm",
  },
};

export const Large: Story = {
  args: {
    text: "Acme Corp",
    size: "lg",
  },
};

export const ExtraLarge: Story = {
  args: {
    text: "Acme Corp",
    size: "xl",
  },
};

export const CustomStyling: Story = {
  args: {
    text: "Acme Corp",
    className: "text-blue-600 dark:text-blue-400",
  },
};