import type { Meta, StoryObj } from "@storybook/react";
import { CTA } from "./cta.js";

const meta = {
  title: "Components/CTA",
  component: CTA,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "primary", "gradient", "bordered", "dark"],
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
} satisfies Meta<typeof CTA>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    heading: "Ready to get started?",
    description:
      "Join thousands of satisfied customers who have transformed their business with our platform.",
    actions: [
      { text: "Start Free Trial", variant: "default" },
      { text: "Contact Sales", variant: "outline" },
    ],
  },
};

export const Primary: Story = {
  args: {
    variant: "primary",
    heading: "Boost your productivity",
    description:
      "Start building for free, then add a site plan to go live. Account plans unlock additional features.",
    actions: [
      { text: "Get Started", variant: "secondary" },
      { text: "Learn More", variant: "outline" },
    ],
  },
};

export const Gradient: Story = {
  args: {
    variant: "gradient",
    heading: "Experience the difference",
    description: "See why teams choose our platform for their most important work.",
    actions: [{ text: "Start Your Journey", variant: "secondary", size: "lg" }],
  },
};

export const Bordered: Story = {
  args: {
    variant: "bordered",
    heading: "Have questions?",
    description: "Our team is here to help. Reach out and we'll get back to you shortly.",
    actions: [{ text: "Contact Support", variant: "default" }],
  },
};

export const Dark: Story = {
  args: {
    variant: "dark",
    heading: "Join our newsletter",
    description: "Stay updated with the latest news and exclusive offers.",
    actions: [
      { text: "Subscribe Now", variant: "secondary" },
      { text: "View Archive", variant: "ghost" },
    ],
  },
};

export const LeftAligned: Story = {
  args: {
    alignment: "left",
    heading: "Transform your workflow",
    description:
      "Discover powerful features that help you work smarter, not harder.",
    actions: [{ text: "Explore Features", variant: "default" }],
  },
};

export const RightAligned: Story = {
  args: {
    alignment: "right",
    variant: "primary",
    heading: "Limited time offer",
    description: "Get 50% off your first year when you sign up today.",
    actions: [{ text: "Claim Offer", variant: "secondary" }],
  },
};

export const WithBackgroundPattern: Story = {
  args: {
    variant: "gradient",
    backgroundPattern: true,
    heading: "Build something amazing",
    description:
      "Our platform provides everything you need to bring your ideas to life.",
    actions: [
      { text: "Start Building", variant: "secondary" },
      { text: "View Examples", variant: "ghost" },
    ],
  },
};

export const Small: Story = {
  args: {
    size: "sm",
    heading: "Quick question?",
    description: "Chat with our team.",
    actions: [{ text: "Open Chat", variant: "default", size: "sm" }],
  },
};

export const Large: Story = {
  args: {
    size: "lg",
    variant: "primary",
    heading: "Enterprise solutions for growing teams",
    description:
      "Get advanced features, dedicated support, and enterprise-grade security for your entire organization.",
    actions: [
      { text: "Talk to Sales", variant: "secondary", size: "lg" },
      { text: "View Plans", variant: "ghost", size: "lg" },
    ],
  },
};

export const MinimalCTA: Story = {
  args: {
    heading: "Simple call to action",
    actions: [{ text: "Learn More", variant: "default" }],
  },
};

export const NoActions: Story = {
  args: {
    variant: "bordered",
    heading: "Coming Soon",
    description:
      "We're working on something special. Enter your email to be notified when we launch.",
  },
};

export const CustomContent: Story = {
  render: () => (
    <CTA
      variant="gradient"
      heading="Get early access"
      description="Be among the first to experience our new features."
    >
      <form className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
        <input
          type="email"
          placeholder="Enter your email"
          className="rounded-md border border-white/20 bg-white/10 px-4 py-2 text-white placeholder:text-white/60 focus:border-white/40 focus:outline-none"
        />
        <button
          type="submit"
          className="rounded-md bg-white px-6 py-2 font-medium text-primary hover:bg-white/90"
        >
          Join Waitlist
        </button>
      </form>
    </CTA>
  ),
};