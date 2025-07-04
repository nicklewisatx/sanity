import type { Meta, StoryObj } from "@storybook/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardImage,
  CardTitle,
} from "./card.js";
import { Button } from "./button.js";

const meta = {
  title: "Components/Card",
  component: Card,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "elevated", "ghost"],
    },
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card description goes here.</CardDescription>
      </CardHeader>
      <CardContent>
        <p>This is the main content area of the card.</p>
      </CardContent>
      <CardFooter>
        <Button>Action</Button>
      </CardFooter>
    </Card>
  ),
};

export const WithImage: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardImage
        src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=350&h=200&fit=crop"
        alt="Green sofa"
      />
      <CardHeader>
        <CardTitle>Beautiful Furniture</CardTitle>
        <CardDescription>Modern and comfortable designs</CardDescription>
      </CardHeader>
      <CardContent>
        <p>
          Discover our latest collection of contemporary furniture pieces that
          blend style with comfort.
        </p>
      </CardContent>
      <CardFooter className="gap-2">
        <Button>Shop Now</Button>
        <Button variant="outline">Learn More</Button>
      </CardFooter>
    </Card>
  ),
};

export const Elevated: Story = {
  args: {
    variant: "elevated",
  },
  render: (args) => (
    <Card className="w-[350px]" variant={args.variant}>
      <CardHeader>
        <CardTitle>Elevated Card</CardTitle>
        <CardDescription>This card has a stronger shadow</CardDescription>
      </CardHeader>
      <CardContent>
        <p>
          The elevated variant creates more visual separation from the
          background.
        </p>
      </CardContent>
    </Card>
  ),
};

export const Ghost: Story = {
  args: {
    variant: "ghost",
  },
  render: (args) => (
    <Card className="w-[350px]" variant={args.variant}>
      <CardHeader>
        <CardTitle>Ghost Card</CardTitle>
        <CardDescription>Minimal styling, no border or shadow</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Perfect for when you need a subtle container.</p>
      </CardContent>
    </Card>
  ),
};

export const ProductCard: Story = {
  render: () => (
    <Card className="w-[300px]">
      <CardImage
        src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop"
        alt="Product"
      />
      <CardHeader>
        <CardTitle>Premium Watch</CardTitle>
        <CardDescription>Classic timepiece</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold">$299</span>
          <span className="text-sm text-muted-foreground line-through">
            $399
          </span>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full">Add to Cart</Button>
      </CardFooter>
    </Card>
  ),
};

export const BlogCard: Story = {
  render: () => (
    <Card className="w-[400px]">
      <CardImage
        src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=200&fit=crop"
        alt="Blog post"
      />
      <CardHeader>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Tech</span>
          <span>•</span>
          <span>5 min read</span>
        </div>
        <CardTitle>The Future of Web Development</CardTitle>
        <CardDescription>
          Exploring emerging trends and technologies shaping the web
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="line-clamp-3">
          As we move forward, the landscape of web development continues to
          evolve at a rapid pace. New frameworks, tools, and methodologies are
          constantly emerging...
        </p>
      </CardContent>
      <CardFooter>
        <Button variant="link" className="px-0">
          Read more →
        </Button>
      </CardFooter>
    </Card>
  ),
};

export const StatsCard: Story = {
  render: () => (
    <Card className="w-[250px]">
      <CardHeader>
        <CardDescription>Total Revenue</CardDescription>
        <CardTitle className="text-3xl">$45,231.89</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-xs text-muted-foreground">+20.1% from last month</p>
      </CardContent>
    </Card>
  ),
};

export const CardGrid: Story = {
  render: () => (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle>Feature One</CardTitle>
          <CardDescription>Amazing capability</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Description of the first feature.</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Feature Two</CardTitle>
          <CardDescription>Powerful functionality</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Description of the second feature.</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Feature Three</CardTitle>
          <CardDescription>Innovative solution</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Description of the third feature.</p>
        </CardContent>
      </Card>
    </div>
  ),
};
