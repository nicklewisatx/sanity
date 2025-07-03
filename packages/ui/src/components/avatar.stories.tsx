import * as React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { Avatar, AvatarImage, AvatarFallback } from './avatar.js'
import { User } from 'lucide-react'

const meta = {
  title: 'Primitives/Avatar',
  component: Avatar,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'An image element with a fallback for representing the user.'
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    className: {
      control: 'text',
      description: 'Additional CSS classes'
    }
  }
} satisfies Meta<typeof Avatar>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Avatar>
      <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
  )
}

export const WithFallback: Story = {
  render: () => (
    <Avatar>
      <AvatarImage src="https://broken-link.com/image.jpg" alt="User" />
      <AvatarFallback>JD</AvatarFallback>
    </Avatar>
  )
}

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Avatar className="h-8 w-8">
        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
        <AvatarFallback className="text-xs">CN</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <Avatar className="h-14 w-14">
        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
        <AvatarFallback className="text-lg">CN</AvatarFallback>
      </Avatar>
      <Avatar className="h-20 w-20">
        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
        <AvatarFallback className="text-2xl">CN</AvatarFallback>
      </Avatar>
    </div>
  )
}

export const WithIcon: Story = {
  render: () => (
    <Avatar>
      <AvatarFallback>
        <User className="h-5 w-5" />
      </AvatarFallback>
    </Avatar>
  )
}

export const Group: Story = {
  render: () => (
    <div className="flex -space-x-4">
      <Avatar className="border-2 border-background">
        <AvatarImage src="https://i.pravatar.cc/150?img=1" alt="User 1" />
        <AvatarFallback>U1</AvatarFallback>
      </Avatar>
      <Avatar className="border-2 border-background">
        <AvatarImage src="https://i.pravatar.cc/150?img=2" alt="User 2" />
        <AvatarFallback>U2</AvatarFallback>
      </Avatar>
      <Avatar className="border-2 border-background">
        <AvatarImage src="https://i.pravatar.cc/150?img=3" alt="User 3" />
        <AvatarFallback>U3</AvatarFallback>
      </Avatar>
      <Avatar className="border-2 border-background">
        <AvatarFallback className="bg-muted-foreground text-background">+5</AvatarFallback>
      </Avatar>
    </div>
  )
}

export const Status: Story = {
  render: () => (
    <div className="flex gap-4">
      <div className="relative">
        <Avatar>
          <AvatarImage src="https://i.pravatar.cc/150?img=4" alt="Online user" />
          <AvatarFallback>ON</AvatarFallback>
        </Avatar>
        <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 ring-2 ring-background" />
      </div>
      <div className="relative">
        <Avatar>
          <AvatarImage src="https://i.pravatar.cc/150?img=5" alt="Away user" />
          <AvatarFallback>AW</AvatarFallback>
        </Avatar>
        <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-yellow-500 ring-2 ring-background" />
      </div>
      <div className="relative">
        <Avatar>
          <AvatarImage src="https://i.pravatar.cc/150?img=6" alt="Offline user" />
          <AvatarFallback>OF</AvatarFallback>
        </Avatar>
        <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-gray-500 ring-2 ring-background" />
      </div>
    </div>
  )
}

export const CustomStyles: Story = {
  render: () => (
    <div className="flex gap-4">
      <Avatar>
        <AvatarFallback className="bg-blue-500 text-white">BG</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white">GR</AvatarFallback>
      </Avatar>
      <Avatar className="rounded-lg">
        <AvatarImage src="https://i.pravatar.cc/150?img=7" alt="Square avatar" />
        <AvatarFallback>SQ</AvatarFallback>
      </Avatar>
    </div>
  )
}

export const LoadingStates: Story = {
  render: function LoadingStatesComponent() {
    const [loading, setLoading] = React.useState(true)
    
    React.useEffect(() => {
      const timer = setTimeout(() => setLoading(false), 2000)
      return () => clearTimeout(timer)
    }, [])
    
    return (
      <div className="flex flex-col items-center gap-4">
        <Avatar>
          <AvatarImage 
            src={loading ? "" : "https://i.pravatar.cc/150?img=8"} 
            alt="Delayed load" 
          />
          <AvatarFallback>DL</AvatarFallback>
        </Avatar>
        <p className="text-sm text-muted-foreground">
          {loading ? "Loading image..." : "Image loaded!"}
        </p>
      </div>
    )
  }
}