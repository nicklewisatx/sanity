import type { Meta, StoryObj } from "@storybook/react";
import { Typography } from "./typography.js";

const meta = {
  title: "Components/Typography",
  component: Typography,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "A flexible typography component supporting all heading levels and text styles.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: [
        "h1",
        "h2",
        "h3",
        "h4",
        "h5",
        "h6",
        "body",
        "lead",
        "large",
        "small",
        "muted",
        "blockquote",
        "code",
      ],
      description: "Typography variant",
    },
    color: {
      control: "select",
      options: [
        "default",
        "primary",
        "secondary",
        "muted",
        "destructive",
        "accent",
      ],
      description: "Text color variant",
    },
    align: {
      control: "select",
      options: ["left", "center", "right", "justify"],
      description: "Text alignment",
    },
    weight: {
      control: "select",
      options: ["normal", "medium", "semibold", "bold", "extrabold"],
      description: "Font weight",
    },
    size: {
      control: "select",
      options: [
        "default",
        "sm",
        "base",
        "lg",
        "xl",
        "2xl",
        "3xl",
        "4xl",
        "5xl",
      ],
      description: "Override default size",
    },
    as: {
      control: "text",
      description: "HTML element to render as",
    },
  },
} satisfies Meta<typeof Typography>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "The quick brown fox jumps over the lazy dog",
  },
};

export const Headings: Story = {
  render: () => (
    <div className="space-y-4">
      <Typography variant="h1">Heading 1</Typography>
      <Typography variant="h2">Heading 2</Typography>
      <Typography variant="h3">Heading 3</Typography>
      <Typography variant="h4">Heading 4</Typography>
      <Typography variant="h5">Heading 5</Typography>
      <Typography variant="h6">Heading 6</Typography>
    </div>
  ),
};

export const TextVariants: Story = {
  render: () => (
    <div className="space-y-4">
      <Typography variant="body">
        Body text: The quick brown fox jumps over the lazy dog. This is the
        default text style used for paragraphs and general content.
      </Typography>
      <Typography variant="lead">
        Lead text: Make a statement with slightly larger, muted text perfect for
        introductions.
      </Typography>
      <Typography variant="large">
        Large text: Emphasize important content without using headings.
      </Typography>
      <Typography variant="small">
        Small text: Perfect for captions, labels, and supporting information.
      </Typography>
      <Typography variant="muted">
        Muted text: De-emphasized content that provides additional context.
      </Typography>
      <Typography variant="blockquote">
        &ldquo;This is a blockquote. Use it to highlight quotes or important
        statements that deserve special attention.&rdquo;
      </Typography>
      <Typography variant="code">
        const example = &quot;inline code&quot;;
      </Typography>
    </div>
  ),
};

export const Colors: Story = {
  render: () => (
    <div className="space-y-4">
      <Typography color="default">Default color text</Typography>
      <Typography color="primary">Primary color text</Typography>
      <Typography color="secondary">Secondary color text</Typography>
      <Typography color="muted">Muted color text</Typography>
      <Typography color="destructive">Destructive color text</Typography>
      <Typography color="accent">Accent color text</Typography>
    </div>
  ),
};

export const Alignment: Story = {
  render: () => (
    <div className="space-y-4">
      <Typography align="left">Left aligned text (default)</Typography>
      <Typography align="center">Center aligned text</Typography>
      <Typography align="right">Right aligned text</Typography>
      <Typography align="justify">
        Justified text will stretch to fill the full width of its container.
        This is useful for creating newspaper-style layouts where text forms
        clean edges on both sides.
      </Typography>
    </div>
  ),
};

export const FontWeights: Story = {
  render: () => (
    <div className="space-y-4">
      <Typography weight="normal">Normal weight text</Typography>
      <Typography weight="medium">Medium weight text</Typography>
      <Typography weight="semibold">Semibold weight text</Typography>
      <Typography weight="bold">Bold weight text</Typography>
      <Typography weight="extrabold">Extrabold weight text</Typography>
    </div>
  ),
};

export const CustomSizes: Story = {
  render: () => (
    <div className="space-y-4">
      <Typography size="sm">Small size override</Typography>
      <Typography size="base">Base size override</Typography>
      <Typography size="lg">Large size override</Typography>
      <Typography size="xl">Extra large size override</Typography>
      <Typography size="2xl">2XL size override</Typography>
      <Typography size="3xl">3XL size override</Typography>
      <Typography size="4xl">4XL size override</Typography>
      <Typography size="5xl">5XL size override</Typography>
    </div>
  ),
};

export const CustomElement: Story = {
  args: {
    as: "span",
    children: "This paragraph variant is rendered as a span element",
    variant: "body",
  },
};

export const CombinedProps: Story = {
  render: () => (
    <div className="space-y-6">
      <Typography variant="h2" color="primary" align="center">
        Centered Primary Heading
      </Typography>
      <Typography variant="lead" color="muted" align="center">
        A muted lead paragraph that introduces the content below
      </Typography>
      <Typography variant="body" weight="medium">
        This body text has medium weight for slight emphasis without being too
        bold.
      </Typography>
      <Typography variant="small" color="secondary" align="right">
        Small secondary text aligned to the right
      </Typography>
    </div>
  ),
};

export const RealWorldExample: Story = {
  render: () => (
    <article className="max-w-prose space-y-6">
      <Typography variant="h1" weight="extrabold">
        Building Modern Web Applications
      </Typography>
      <Typography variant="lead" color="muted">
        Discover the latest techniques and best practices for creating scalable,
        performant web applications.
      </Typography>
      <Typography variant="body">
        Modern web development has evolved significantly over the past decade.
        With the rise of component-based architectures and advanced build tools,
        developers can create more sophisticated applications than ever before.
      </Typography>
      <Typography variant="h2">Key Technologies</Typography>
      <Typography variant="body">
        Today&apos;s web stack typically includes{" "}
        <Typography variant="code" as="span">
          React
        </Typography>
        ,{" "}
        <Typography variant="code" as="span">
          TypeScript
        </Typography>
        , and modern CSS solutions like{" "}
        <Typography variant="code" as="span">
          Tailwind CSS
        </Typography>
        .
      </Typography>
      <Typography variant="blockquote">
        &ldquo;The best code is no code at all. Every new line of code you
        willingly bring into the world is code that has to be debugged, code
        that has to be read and understood, code that has to be
        supported.&rdquo;
      </Typography>
      <Typography variant="small" color="muted" align="right">
        — Jeff Atwood, Coding Horror
      </Typography>
    </article>
  ),
};
