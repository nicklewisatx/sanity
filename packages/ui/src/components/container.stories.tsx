import type { Meta, StoryObj } from "@storybook/react";
import { Container } from "./container.js";

const meta = {
  title: "Components/Container",
  component: Container,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "A responsive container component that constrains content width and provides consistent padding.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: [
        "default",
        "full",
        "narrow",
        "wide",
        "xs",
        "sm",
        "md",
        "lg",
        "xl",
        "2xl",
        "3xl",
        "4xl",
        "5xl",
        "6xl",
        "7xl",
      ],
      description: "Container max-width constraint",
    },
    padding: {
      control: "select",
      options: ["none", "default", "sm", "lg", "xl"],
      description: "Horizontal padding",
    },
    as: {
      control: "text",
      description: "HTML element to render as",
    },
  },
} satisfies Meta<typeof Container>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: (
      <div className="bg-muted p-8 text-center">
        <p>Default container with max-width of 1216px</p>
      </div>
    ),
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="space-y-8">
      <Container size="xs">
        <div className="bg-muted p-4 text-center">
          <p className="text-sm">XS Container (max-w-xs)</p>
        </div>
      </Container>
      <Container size="sm">
        <div className="bg-muted p-4 text-center">
          <p className="text-sm">SM Container (max-w-sm)</p>
        </div>
      </Container>
      <Container size="md">
        <div className="bg-muted p-4 text-center">
          <p className="text-sm">MD Container (max-w-md)</p>
        </div>
      </Container>
      <Container size="lg">
        <div className="bg-muted p-4 text-center">
          <p className="text-sm">LG Container (max-w-lg)</p>
        </div>
      </Container>
      <Container size="xl">
        <div className="bg-muted p-4 text-center">
          <p className="text-sm">XL Container (max-w-xl)</p>
        </div>
      </Container>
      <Container size="2xl">
        <div className="bg-muted p-4 text-center">
          <p className="text-sm">2XL Container (max-w-2xl)</p>
        </div>
      </Container>
      <Container size="3xl">
        <div className="bg-muted p-4 text-center">
          <p className="text-sm">3XL Container (max-w-3xl)</p>
        </div>
      </Container>
      <Container size="4xl">
        <div className="bg-muted p-4 text-center">
          <p className="text-sm">4XL Container (max-w-4xl)</p>
        </div>
      </Container>
      <Container size="5xl">
        <div className="bg-muted p-4 text-center">
          <p className="text-sm">5XL Container (max-w-5xl)</p>
        </div>
      </Container>
      <Container size="6xl">
        <div className="bg-muted p-4 text-center">
          <p className="text-sm">6XL Container (max-w-6xl)</p>
        </div>
      </Container>
      <Container size="7xl">
        <div className="bg-muted p-4 text-center">
          <p className="text-sm">7XL Container (max-w-7xl)</p>
        </div>
      </Container>
    </div>
  ),
};

export const SpecialSizes: Story = {
  render: () => (
    <div className="space-y-8">
      <Container size="narrow">
        <div className="bg-primary/10 p-8 text-center">
          <p>Narrow Container (max-w-4xl)</p>
          <p className="text-sm text-muted-foreground mt-2">
            Perfect for blog posts and readable content
          </p>
        </div>
      </Container>
      <Container size="default">
        <div className="bg-primary/10 p-8 text-center">
          <p>Default Container (1216px)</p>
          <p className="text-sm text-muted-foreground mt-2">
            Standard width matching existing components
          </p>
        </div>
      </Container>
      <Container size="wide">
        <div className="bg-primary/10 p-8 text-center">
          <p>Wide Container (max-w-7xl)</p>
          <p className="text-sm text-muted-foreground mt-2">
            For content that needs more breathing room
          </p>
        </div>
      </Container>
      <Container size="full">
        <div className="bg-primary/10 p-8 text-center">
          <p>Full Width Container</p>
          <p className="text-sm text-muted-foreground mt-2">
            No max-width constraint - perfect for full-width heroes
          </p>
        </div>
      </Container>
    </div>
  ),
};

export const PaddingVariants: Story = {
  render: () => (
    <div className="space-y-8">
      <Container padding="none" className="bg-secondary/20">
        <div className="bg-secondary p-4 text-center">
          <p>No Padding</p>
        </div>
      </Container>
      <Container padding="sm" className="bg-secondary/20">
        <div className="bg-secondary p-4 text-center">
          <p>Small Padding</p>
        </div>
      </Container>
      <Container padding="default" className="bg-secondary/20">
        <div className="bg-secondary p-4 text-center">
          <p>Default Padding</p>
        </div>
      </Container>
      <Container padding="lg" className="bg-secondary/20">
        <div className="bg-secondary p-4 text-center">
          <p>Large Padding</p>
        </div>
      </Container>
      <Container padding="xl" className="bg-secondary/20">
        <div className="bg-secondary p-4 text-center">
          <p>Extra Large Padding</p>
        </div>
      </Container>
    </div>
  ),
};

export const ResponsiveBehavior: Story = {
  render: () => (
    <Container>
      <div className="bg-accent/20 p-8">
        <h3 className="text-lg font-semibold mb-4">Responsive Container</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Resize your browser to see how the padding adjusts at different
          breakpoints:
        </p>
        <ul className="text-sm space-y-2">
          <li>• Mobile: 16px padding (px-4)</li>
          <li>• Small screens: 24px padding (sm:px-6)</li>
          <li>• Large screens: 32px padding (lg:px-8)</li>
        </ul>
      </div>
    </Container>
  ),
};

export const NestedContainers: Story = {
  render: () => (
    <Container size="full" padding="none" className="bg-muted">
      <div className="py-12">
        <Container size="default">
          <h2 className="text-2xl font-bold mb-4">Full-width Background</h2>
          <p className="mb-8">
            This demonstrates a common pattern: full-width background with
            constrained content.
          </p>
        </Container>
      </div>
      <div className="bg-background py-12">
        <Container size="narrow">
          <h3 className="text-xl font-semibold mb-4">Narrow Content Section</h3>
          <p>
            Perfect for blog posts or content that needs optimal reading width.
            The narrow container ensures lines don&apos;t get too long for
            comfortable reading.
          </p>
        </Container>
      </div>
    </Container>
  ),
};

export const CustomElement: Story = {
  args: {
    as: "section",
    children: (
      <div className="bg-primary/10 p-8 text-center">
        <p>This container is rendered as a section element</p>
      </div>
    ),
  },
};

export const RealWorldExample: Story = {
  render: () => (
    <div className="min-h-screen bg-background">
      {/* Hero Section - Full Width Background */}
      <section className="bg-primary text-primary-foreground">
        <Container size="default" className="py-24">
          <h1 className="text-4xl font-bold mb-4">Welcome to Our Platform</h1>
          <p className="text-xl opacity-90">
            Experience the power of modern web development
          </p>
        </Container>
      </section>

      {/* Content Section - Default Width */}
      <Container className="py-16">
        <div className="grid gap-8 md:grid-cols-3">
          <div className="bg-card p-6 rounded-lg border">
            <h3 className="font-semibold mb-2">Feature One</h3>
            <p className="text-sm text-muted-foreground">
              Description of the first feature
            </p>
          </div>
          <div className="bg-card p-6 rounded-lg border">
            <h3 className="font-semibold mb-2">Feature Two</h3>
            <p className="text-sm text-muted-foreground">
              Description of the second feature
            </p>
          </div>
          <div className="bg-card p-6 rounded-lg border">
            <h3 className="font-semibold mb-2">Feature Three</h3>
            <p className="text-sm text-muted-foreground">
              Description of the third feature
            </p>
          </div>
        </div>
      </Container>

      {/* Article Section - Narrow Width */}
      <section className="bg-muted/50">
        <Container size="narrow" className="py-16">
          <article className="prose prose-gray dark:prose-invert">
            <h2>Article Title</h2>
            <p>
              This narrow container provides optimal reading width for long-form
              content. It ensures that line lengths stay within comfortable
              reading limits, improving the overall reading experience.
            </p>
            <p>
              The narrow container is particularly useful for blog posts,
              documentation, and any other text-heavy content where readability
              is paramount.
            </p>
          </article>
        </Container>
      </section>
    </div>
  ),
};
