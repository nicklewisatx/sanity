import type { Meta, StoryObj } from "@storybook/react";
import { 
  ArrowRight, 
  Download, 
  Heart
} from "lucide-react";

import { Button } from "./button";

const meta = {
  title: "Design System/Button",
  component: Button,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
A simplified button component for blog interfaces:

- **3 variants**: Primary, secondary, and ghost
- **3 sizes**: Small, medium, and large (plus icon)
- **Icon support**: Left and right icons
- **Loading state**: Built-in loading spinner
- **Full width option**: For responsive layouts
- **Polymorphic**: Can render as different elements using asChild
        `,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: { type: "select" },
      options: ["primary", "secondary", "ghost"],
      description: "Visual style variant",
    },
    size: {
      control: { type: "select" },
      options: ["sm", "md", "lg", "icon"],
      description: "Button size",
    },
    fullWidth: {
      control: { type: "boolean" },
      description: "Make button full width",
    },
    loading: {
      control: { type: "boolean" },
      description: "Show loading state",
    },
    disabled: {
      control: { type: "boolean" },
      description: "Disable button",
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic variants
export const Primary: Story = {
  args: {
    children: "Primary Button",
    variant: "primary",
  },
};

export const Secondary: Story = {
  args: {
    children: "Secondary Button",
    variant: "secondary",
  },
};

export const Outline: Story = {
  args: {
    children: "Outline Button",
    variant: "secondary",
  },
};

export const Ghost: Story = {
  args: {
    children: "Ghost Button",
    variant: "ghost",
  },
};


// Sizes
export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
      <Button size="lg">Extra Large</Button>
    </div>
  ),
};

// With icons
export const WithLeftIcon: Story = {
  args: {
    children: "Download",
    leftIcon: <Download className="h-4 w-4" />,
  },
};

export const WithRightIcon: Story = {
  args: {
    children: "Next",
    rightIcon: <ArrowRight className="h-4 w-4" />,
  },
};


// States
export const Loading: Story = {
  args: {
    children: "Saving...",
    loading: true,
  },
};

export const Disabled: Story = {
  args: {
    children: "Disabled",
    disabled: true,
  },
};

export const FullWidth: Story = {
  args: {
    children: "Full Width Button",
    fullWidth: true,
  },
  decorators: [
    (Story) => (
      <div className="w-[400px]">
        <Story />
      </div>
    ),
  ],
};

// Interactive states demo
export const InteractiveStates: Story = {
  render: () => (
    <div className="grid gap-8">
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-3">Normal States</h3>
        <div className="flex gap-3">
          <Button variant="primary">Default</Button>
          <Button variant="primary" className="hover">Hover</Button>
          <Button variant="primary" className="active">Active</Button>
          <Button variant="primary" className="focus-visible">Focus</Button>
        </div>
      </div>
      
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-3">Loading States</h3>
        <div className="flex gap-3">
          <Button variant="primary" loading>Primary</Button>
          <Button variant="secondary" loading>Secondary</Button>
          <Button variant="secondary" loading>Secondary</Button>
        </div>
      </div>
      
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-3">Disabled States</h3>
        <div className="flex gap-3">
          <Button variant="primary" disabled>Primary</Button>
          <Button variant="secondary" disabled>Secondary</Button>
          <Button variant="secondary" disabled>Secondary</Button>
        </div>
      </div>
    </div>
  ),
};

// Real-world examples
export const CTAButtons: Story = {
  name: "CTA Examples",
  render: () => (
    <div className="space-y-4">
      <div className="flex gap-3">
        <Button variant="primary" size="lg">
          Get Started Free
        </Button>
        <Button variant="secondary" size="lg">
          View Demo
        </Button>
      </div>
      
      <div className="flex gap-3">
        <Button variant="primary" rightIcon={<ArrowRight className="h-4 w-4" />}>
          Subscribe to Newsletter
        </Button>
        <Button variant="ghost" leftIcon={<Heart className="h-4 w-4" />}>
          Add to Favorites
        </Button>
      </div>
      
    </div>
  ),
};

// Responsive button group
export const ResponsiveButtonGroup: Story = {
  render: () => (
    <div className="space-y-4 w-full max-w-md">
      <div className="flex flex-col sm:flex-row gap-3">
        <Button variant="primary" fullWidth className="sm:w-auto">
          Accept
        </Button>
        <Button variant="secondary" fullWidth className="sm:w-auto">
          Decline
        </Button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Button variant="secondary">Option 1</Button>
        <Button variant="secondary">Option 2</Button>
      </div>
    </div>
  ),
};

// Dark mode support
export const DarkMode: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-8">
      <div className="p-8 bg-white rounded-lg">
        <h3 className="text-sm font-medium text-gray-700 mb-4">Light Mode</h3>
        <div className="space-y-3">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
        </div>
      </div>
      
      <div className="p-8 bg-gray-900 rounded-lg dark">
        <h3 className="text-sm font-medium text-gray-300 mb-4">Dark Mode</h3>
        <div className="space-y-3">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
        </div>
      </div>
    </div>
  ),
  parameters: {
    backgrounds: { default: "light" },
  },
};