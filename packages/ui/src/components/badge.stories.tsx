import type { Meta, StoryObj } from '@storybook/react'
import { Badge } from './badge.js'
import { Star, AlertCircle, CheckCircle, Clock, TrendingUp, XCircle } from 'lucide-react'

const meta = {
  title: 'Primitives/Badge',
  component: Badge,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Displays a badge or label.'
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'secondary', 'destructive', 'outline'],
      description: 'The visual style variant of the badge'
    },
    children: {
      control: 'text',
      description: 'The content to display inside the badge'
    }
  }
} satisfies Meta<typeof Badge>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: 'Badge'
  }
}

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Badge>Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="destructive">Destructive</Badge>
      <Badge variant="outline">Outline</Badge>
    </div>
  )
}

export const WithIcons: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Badge>
        <Star className="mr-1 h-3 w-3" />
        Featured
      </Badge>
      <Badge variant="secondary">
        <Clock className="mr-1 h-3 w-3" />
        Pending
      </Badge>
      <Badge variant="destructive">
        <XCircle className="mr-1 h-3 w-3" />
        Failed
      </Badge>
      <Badge variant="outline">
        <CheckCircle className="mr-1 h-3 w-3" />
        Verified
      </Badge>
    </div>
  )
}

export const StatusBadges: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium w-20">Success:</span>
        <Badge className="bg-green-100 text-green-800 border-green-200">
          <CheckCircle className="mr-1 h-3 w-3" />
          Active
        </Badge>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium w-20">Warning:</span>
        <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
          <AlertCircle className="mr-1 h-3 w-3" />
          Warning
        </Badge>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium w-20">Info:</span>
        <Badge className="bg-blue-100 text-blue-800 border-blue-200">
          <AlertCircle className="mr-1 h-3 w-3" />
          Info
        </Badge>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium w-20">Error:</span>
        <Badge className="bg-red-100 text-red-800 border-red-200">
          <XCircle className="mr-1 h-3 w-3" />
          Error
        </Badge>
      </div>
    </div>
  )
}

export const SizesAndShapes: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Badge className="text-[10px] px-2 py-0">Tiny</Badge>
        <Badge className="text-xs">Small</Badge>
        <Badge>Default</Badge>
        <Badge className="text-sm px-3 py-1">Large</Badge>
      </div>
      <div className="flex items-center gap-4">
        <Badge className="rounded-sm">Square</Badge>
        <Badge>Default</Badge>
        <Badge className="rounded-full">Pill</Badge>
      </div>
    </div>
  )
}

export const CounterBadges: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Badge variant="secondary" className="rounded-full px-2 py-0 h-5 min-w-[20px] text-center">
        5
      </Badge>
      <Badge variant="destructive" className="rounded-full px-2 py-0 h-5 min-w-[20px] text-center">
        99+
      </Badge>
      <Badge variant="outline" className="rounded-full px-2 py-0 h-5 min-w-[20px] text-center">
        <TrendingUp className="h-3 w-3" />
      </Badge>
    </div>
  )
}

export const InContext: Story = {
  render: () => (
    <div className="space-y-6 w-full max-w-md">
      <div className="flex items-center justify-between p-4 border rounded-lg">
        <div>
          <h3 className="font-semibold">API Documentation</h3>
          <p className="text-sm text-muted-foreground">Complete guide to our REST API</p>
        </div>
        <Badge variant="secondary">v2.0</Badge>
      </div>
      
      <div className="flex items-center justify-between p-4 border rounded-lg">
        <div>
          <h3 className="font-semibold">Premium Plan</h3>
          <p className="text-sm text-muted-foreground">Unlimited access to all features</p>
        </div>
        <Badge>Popular</Badge>
      </div>
      
      <div className="flex items-center justify-between p-4 border rounded-lg">
        <div>
          <h3 className="font-semibold">System Status</h3>
          <p className="text-sm text-muted-foreground">All systems operational</p>
        </div>
        <Badge className="bg-green-100 text-green-800 border-green-200">
          <CheckCircle className="mr-1 h-3 w-3" />
          Healthy
        </Badge>
      </div>
    </div>
  )
}

export const ComplexContent: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Badge variant="outline" className="gap-1">
        <span className="h-2 w-2 rounded-full bg-green-500" />
        Online
      </Badge>
      <Badge variant="outline" className="gap-1">
        <span className="h-2 w-2 rounded-full bg-yellow-500 animate-pulse" />
        Processing
      </Badge>
      <Badge variant="secondary">
        <img 
          src="https://github.com/vercel.png" 
          alt="Vercel" 
          className="mr-1 h-3 w-3 rounded-full"
        />
        Powered by Vercel
      </Badge>
    </div>
  )
}