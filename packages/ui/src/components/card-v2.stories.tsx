import type { Meta, StoryObj } from "@storybook/react";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter,
  CardGrid 
} from "./card-v2";
import { ButtonV2 } from "./button-v2";
import { Text, Caption } from "./typography-v2";

const meta = {
  title: "Design System/Card V2",
  component: Card,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
A versatile card component for grouping related content:

- **Multiple variants**: Default, interactive, elevated, ghost
- **Flexible sizing**: From small to extra large
- **Composable parts**: Header, content, footer sections
- **Responsive grid**: Built-in grid layout support
- **Dark mode**: Full dark mode support
        `,
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic Card
export const Default: Story = {
  args: {
    children: (
      <>
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
          <CardDescription>This is a card description that provides context.</CardDescription>
        </CardHeader>
        <CardContent>
          <Text>
            Card content goes here. You can include any content like text, images, forms, or other components.
          </Text>
        </CardContent>
        <CardFooter>
          <ButtonV2 size="sm">Action</ButtonV2>
        </CardFooter>
      </>
    ),
  },
};

// Card Variants
export const Variants: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card variant="default">
        <CardHeader>
          <CardTitle>Default Card</CardTitle>
          <CardDescription>Standard card with subtle hover effect</CardDescription>
        </CardHeader>
        <CardContent>
          <Text>The default card style for most use cases.</Text>
        </CardContent>
      </Card>

      <Card variant="interactive">
        <CardHeader>
          <CardTitle>Interactive Card</CardTitle>
          <CardDescription>Clickable card with enhanced hover state</CardDescription>
        </CardHeader>
        <CardContent>
          <Text>Use for cards that are clickable or lead to other content.</Text>
        </CardContent>
      </Card>

      <Card variant="elevated">
        <CardHeader>
          <CardTitle>Elevated Card</CardTitle>
          <CardDescription>Card with shadow for visual hierarchy</CardDescription>
        </CardHeader>
        <CardContent>
          <Text>Great for important content that needs to stand out.</Text>
        </CardContent>
      </Card>

      <Card variant="ghost">
        <CardHeader>
          <CardTitle>Ghost Card</CardTitle>
          <CardDescription>Minimal card with no border</CardDescription>
        </CardHeader>
        <CardContent>
          <Text>Subtle card variant for less prominent content.</Text>
        </CardContent>
      </Card>
    </div>
  ),
};

// Card Sizes
export const Sizes: Story = {
  render: () => (
    <div className="space-y-6">
      <Card size="sm">
        <CardHeader>
          <CardTitle>Small Card</CardTitle>
        </CardHeader>
        <CardContent>
          <Text size="sm">Compact card with minimal padding (32px)</Text>
        </CardContent>
      </Card>

      <Card size="md">
        <CardHeader>
          <CardTitle>Medium Card</CardTitle>
        </CardHeader>
        <CardContent>
          <Text>Default card size with comfortable padding (48px)</Text>
        </CardContent>
      </Card>

      <Card size="lg">
        <CardHeader>
          <CardTitle>Large Card</CardTitle>
        </CardHeader>
        <CardContent>
          <Text>Spacious card with generous padding (64px)</Text>
        </CardContent>
      </Card>

      <Card size="xl">
        <CardHeader>
          <CardTitle>Extra Large Card</CardTitle>
        </CardHeader>
        <CardContent>
          <Text>Maximum padding for hero or feature cards (80px)</Text>
        </CardContent>
      </Card>
    </div>
  ),
};

// Border Radius Options
export const BorderRadius: Story = {
  render: () => (
    <div className="grid grid-cols-3 gap-6">
      <Card radius="none">
        <CardHeader>
          <CardTitle>No Radius</CardTitle>
        </CardHeader>
        <CardContent>
          <Text size="sm">Sharp corners</Text>
        </CardContent>
      </Card>

      <Card radius="sm">
        <CardHeader>
          <CardTitle>Small Radius</CardTitle>
        </CardHeader>
        <CardContent>
          <Text size="sm">Subtle rounding</Text>
        </CardContent>
      </Card>

      <Card radius="md">
        <CardHeader>
          <CardTitle>Medium Radius</CardTitle>
        </CardHeader>
        <CardContent>
          <Text size="sm">Balanced rounding</Text>
        </CardContent>
      </Card>

      <Card radius="lg">
        <CardHeader>
          <CardTitle>Large Radius</CardTitle>
        </CardHeader>
        <CardContent>
          <Text size="sm">Default rounding</Text>
        </CardContent>
      </Card>

      <Card radius="xl">
        <CardHeader>
          <CardTitle>XL Radius</CardTitle>
        </CardHeader>
        <CardContent>
          <Text size="sm">Prominent rounding</Text>
        </CardContent>
      </Card>

      <Card radius="full">
        <CardHeader>
          <CardTitle>Full Radius</CardTitle>
        </CardHeader>
        <CardContent>
          <Text size="sm">Maximum rounding</Text>
        </CardContent>
      </Card>
    </div>
  ),
};

// Complex Card Examples
export const BlogPostCard: Story = {
  render: () => (
    <Card variant="interactive" className="max-w-md">
      <div className="aspect-video bg-gray-200 dark:bg-gray-700 rounded-t-lg -m-6 mb-0" />
      <CardHeader>
        <Caption>Published 2 days ago • 5 min read</Caption>
        <CardTitle className="mt-2">Building Modern Web Applications</CardTitle>
        <CardDescription>
          Learn the best practices for creating scalable and maintainable web applications
          using the latest technologies and frameworks.
        </CardDescription>
      </CardHeader>
      <CardFooter className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600" />
          <Text size="sm">Jane Doe</Text>
        </div>
        <ButtonV2 variant="ghost" size="sm">Read More →</ButtonV2>
      </CardFooter>
    </Card>
  ),
};

// Stats Card
export const StatsCard: Story = {
  render: () => (
    <Card variant="elevated">
      <CardContent>
        <div className="flex items-center justify-between mb-2">
          <Text size="sm" color="muted">Total Revenue</Text>
          <Caption className="text-success-600">+12.5%</Caption>
        </div>
        <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">$45,231</div>
        <Text size="sm" color="muted" className="mt-1">
          Compared to last month
        </Text>
      </CardContent>
    </Card>
  ),
};

// Card Grid Layout
export const GridLayout: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-4">3 Column Grid</h3>
        <CardGrid cols={3} gap={6}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} variant="default">
              <CardHeader>
                <CardTitle>Card {i}</CardTitle>
                <CardDescription>Description for card {i}</CardDescription>
              </CardHeader>
              <CardContent>
                <Text>Content goes here</Text>
              </CardContent>
            </Card>
          ))}
        </CardGrid>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">2 Column Grid</h3>
        <CardGrid cols={2} gap={8}>
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} variant="elevated">
              <CardHeader>
                <CardTitle>Feature {i}</CardTitle>
              </CardHeader>
              <CardContent>
                <Text>Feature description and details go here.</Text>
              </CardContent>
              <CardFooter>
                <ButtonV2 variant="outline" size="sm" className="w-full">
                  Learn More
                </ButtonV2>
              </CardFooter>
            </Card>
          ))}
        </CardGrid>
      </div>
    </div>
  ),
};

// Pricing Card Example
export const PricingCard: Story = {
  render: () => (
    <Card variant="elevated" className="max-w-sm">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Professional</CardTitle>
        <CardDescription>Perfect for growing businesses</CardDescription>
      </CardHeader>
      <CardContent className="text-center">
        <div className="mt-4 mb-6">
          <span className="text-4xl font-bold">$49</span>
          <Text size="sm" color="muted" className="inline ml-1">
            /month
          </Text>
        </div>
        <ul className="space-y-3 text-left mb-6">
          {[
            "Up to 10 users",
            "Advanced analytics",
            "24/7 support",
            "Custom integrations",
            "99.9% uptime SLA",
          ].map((feature) => (
            <li key={feature} className="flex items-center gap-2">
              <span className="text-success-600">✓</span>
              <Text size="sm">{feature}</Text>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <ButtonV2 variant="primary" size="md" className="w-full">
          Get Started
        </ButtonV2>
      </CardFooter>
    </Card>
  ),
};

// Dark Mode Support
export const DarkMode: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-8">
      <div className="p-8 bg-white rounded-lg">
        <h4 className="font-semibold mb-4">Light Mode</h4>
        <Card>
          <CardHeader>
            <CardTitle>Light Card</CardTitle>
            <CardDescription>Card appearance in light mode</CardDescription>
          </CardHeader>
          <CardContent>
            <Text>This card adapts to light mode automatically.</Text>
          </CardContent>
          <CardFooter>
            <ButtonV2 size="sm">Action</ButtonV2>
          </CardFooter>
        </Card>
      </div>

      <div className="p-8 bg-gray-900 rounded-lg dark">
        <h4 className="font-semibold mb-4 text-white">Dark Mode</h4>
        <Card>
          <CardHeader>
            <CardTitle>Dark Card</CardTitle>
            <CardDescription>Card appearance in dark mode</CardDescription>
          </CardHeader>
          <CardContent>
            <Text>This card adapts to dark mode automatically.</Text>
          </CardContent>
          <CardFooter>
            <ButtonV2 size="sm">Action</ButtonV2>
          </CardFooter>
        </Card>
      </div>
    </div>
  ),
  parameters: {
    backgrounds: { default: "light" },
  },
};