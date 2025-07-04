import type { Meta, StoryObj } from "@storybook/react";
import { 
  ArrowRight, 
  Download, 
  Heart, 
  Mail, 
  Plus, 
  Settings,
  Trash2,
  Upload
} from "lucide-react";

import { ButtonV2 } from "./button-v2";

const meta = {
  title: "Design System/Button V2",
  component: ButtonV2,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
An improved button component following design system principles:

- **Consistent sizing**: Based on 8px grid system
- **Semantic variants**: Primary, secondary, outline, ghost, danger, success
- **Accessibility**: Proper focus states and ARIA support
- **Loading states**: Built-in loading spinner
- **Icon support**: Left and right icon slots
- **Responsive**: Works across all device sizes
        `,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: { type: "select" },
      description: "Visual style variant",
    },
    size: {
      control: { type: "select" },
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
} satisfies Meta<typeof ButtonV2>;

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
    variant: "outline",
  },
};

export const Ghost: Story = {
  args: {
    children: "Ghost Button",
    variant: "ghost",
  },
};

export const Danger: Story = {
  args: {
    children: "Delete",
    variant: "danger",
    leftIcon: <Trash2 className="h-4 w-4" />,
  },
};

export const Success: Story = {
  args: {
    children: "Save Changes",
    variant: "success",
  },
};

// Sizes
export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <ButtonV2 size="sm">Small</ButtonV2>
      <ButtonV2 size="md">Medium</ButtonV2>
      <ButtonV2 size="lg">Large</ButtonV2>
      <ButtonV2 size="xl">Extra Large</ButtonV2>
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

export const WithBothIcons: Story = {
  args: {
    children: "Settings",
    leftIcon: <Settings className="h-4 w-4" />,
    rightIcon: <ArrowRight className="h-4 w-4" />,
  },
};

export const IconOnly: Story = {
  args: {
    children: <Plus className="h-4 w-4" />,
    "aria-label": "Add item",
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
          <ButtonV2 variant="primary">Default</ButtonV2>
          <ButtonV2 variant="primary" className="hover">Hover</ButtonV2>
          <ButtonV2 variant="primary" className="active">Active</ButtonV2>
          <ButtonV2 variant="primary" className="focus-visible">Focus</ButtonV2>
        </div>
      </div>
      
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-3">Loading States</h3>
        <div className="flex gap-3">
          <ButtonV2 variant="primary" loading>Primary</ButtonV2>
          <ButtonV2 variant="secondary" loading>Secondary</ButtonV2>
          <ButtonV2 variant="outline" loading>Outline</ButtonV2>
        </div>
      </div>
      
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-3">Disabled States</h3>
        <div className="flex gap-3">
          <ButtonV2 variant="primary" disabled>Primary</ButtonV2>
          <ButtonV2 variant="secondary" disabled>Secondary</ButtonV2>
          <ButtonV2 variant="outline" disabled>Outline</ButtonV2>
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
        <ButtonV2 variant="primary" size="lg">
          Get Started Free
        </ButtonV2>
        <ButtonV2 variant="outline" size="lg">
          View Demo
        </ButtonV2>
      </div>
      
      <div className="flex gap-3">
        <ButtonV2 variant="primary" leftIcon={<Mail className="h-4 w-4" />}>
          Subscribe to Newsletter
        </ButtonV2>
        <ButtonV2 variant="ghost" leftIcon={<Heart className="h-4 w-4" />}>
          Add to Favorites
        </ButtonV2>
      </div>
      
      <div className="flex gap-3">
        <ButtonV2 variant="success" leftIcon={<Upload className="h-4 w-4" />}>
          Upload File
        </ButtonV2>
        <ButtonV2 variant="danger" leftIcon={<Trash2 className="h-4 w-4" />}>
          Delete Account
        </ButtonV2>
      </div>
    </div>
  ),
};

// Responsive button group
export const ResponsiveButtonGroup: Story = {
  render: () => (
    <div className="space-y-4 w-full max-w-md">
      <div className="flex flex-col sm:flex-row gap-3">
        <ButtonV2 variant="primary" fullWidth className="sm:w-auto">
          Accept
        </ButtonV2>
        <ButtonV2 variant="outline" fullWidth className="sm:w-auto">
          Decline
        </ButtonV2>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <ButtonV2 variant="secondary">Option 1</ButtonV2>
        <ButtonV2 variant="secondary">Option 2</ButtonV2>
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
          <ButtonV2 variant="primary">Primary</ButtonV2>
          <ButtonV2 variant="secondary">Secondary</ButtonV2>
          <ButtonV2 variant="outline">Outline</ButtonV2>
          <ButtonV2 variant="ghost">Ghost</ButtonV2>
        </div>
      </div>
      
      <div className="p-8 bg-gray-900 rounded-lg dark">
        <h3 className="text-sm font-medium text-gray-300 mb-4">Dark Mode</h3>
        <div className="space-y-3">
          <ButtonV2 variant="primary">Primary</ButtonV2>
          <ButtonV2 variant="secondary">Secondary</ButtonV2>
          <ButtonV2 variant="outline">Outline</ButtonV2>
          <ButtonV2 variant="ghost">Ghost</ButtonV2>
        </div>
      </div>
    </div>
  ),
  parameters: {
    backgrounds: { default: "light" },
  },
};