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
    primary: "Nick Lewis",
    secondary: "The Blog",
  },
};

export const WithLink: Story = {
  args: {
    primary: "Nick Lewis",
    secondary: "The Blog",
    href: "/",
  },
};

export const Small: Story = {
  args: {
    size: "sm",
    primary: "Nick Lewis",
    secondary: "The Blog",
  },
};

export const Large: Story = {
  args: {
    size: "lg",
    primary: "Nick Lewis",
    secondary: "The Blog",
  },
};

export const ExtraLarge: Story = {
  args: {
    size: "xl",
    primary: "Nick Lewis",
    secondary: "The Blog",
  },
};

export const CustomText: Story = {
  args: {
    primary: "ACME Corp",
    secondary: "Enterprise Solutions",
    separator: "|",
  },
};

export const SingleText: Story = {
  args: {
    primary: "BrandName",
    secondary: "",
    separator: "",
  },
};

export const WithCustomClass: Story = {
  args: {
    className: "text-blue-600",
    primary: "Styled",
    secondary: "Logo",
  },
};
