import type { Meta, StoryObj } from '@storybook/react'
import { Input } from './input.js'
import { Search, Mail, Lock, User, CreditCard, DollarSign } from 'lucide-react'
import * as React from 'react'

const meta = {
  title: 'Primitives/Input',
  component: Input,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A basic input field component with various states and types.'
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number', 'search', 'tel', 'url', 'date', 'time', 'datetime-local'],
      description: 'The type of input'
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text'
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the input is disabled'
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes'
    }
  }
} satisfies Meta<typeof Input>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    type: 'text',
    placeholder: 'Enter text...'
  }
}

export const Types: Story = {
  render: () => (
    <div className="space-y-4 w-[350px]">
      <div>
        <label className="text-sm font-medium mb-2 block">Text</label>
        <Input type="text" placeholder="Enter text..." />
      </div>
      <div>
        <label className="text-sm font-medium mb-2 block">Email</label>
        <Input type="email" placeholder="name@example.com" />
      </div>
      <div>
        <label className="text-sm font-medium mb-2 block">Password</label>
        <Input type="password" placeholder="Enter password..." />
      </div>
      <div>
        <label className="text-sm font-medium mb-2 block">Number</label>
        <Input type="number" placeholder="0" min="0" max="100" />
      </div>
      <div>
        <label className="text-sm font-medium mb-2 block">Search</label>
        <Input type="search" placeholder="Search..." />
      </div>
      <div>
        <label className="text-sm font-medium mb-2 block">Date</label>
        <Input type="date" />
      </div>
    </div>
  )
}

export const States: Story = {
  render: () => (
    <div className="space-y-4 w-[350px]">
      <Input placeholder="Default input" />
      <Input placeholder="Focused input" className="focus-visible:ring-1 focus-visible:ring-ring" />
      <Input placeholder="Disabled input" disabled />
      <Input placeholder="Read-only input" readOnly value="Read-only content" />
      <Input placeholder="Error state" className="border-destructive focus-visible:ring-destructive" />
    </div>
  )
}

export const WithIcons: Story = {
  render: () => (
    <div className="space-y-4 w-[350px]">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input className="pl-8" placeholder="Search..." />
      </div>
      <div className="relative">
        <Mail className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input className="pl-8" type="email" placeholder="Email" />
      </div>
      <div className="relative">
        <Lock className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input className="pl-8" type="password" placeholder="Password" />
      </div>
      <div className="relative">
        <Input className="pr-8" placeholder="Amount" />
        <DollarSign className="absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      </div>
    </div>
  )
}

export const Sizes: Story = {
  render: () => (
    <div className="space-y-4 w-[350px]">
      <Input className="h-8 text-sm" placeholder="Small input" />
      <Input placeholder="Default input" />
      <Input className="h-11 text-base" placeholder="Large input" />
    </div>
  )
}

export const FileInput: Story = {
  render: () => (
    <div className="space-y-4 w-[350px]">
      <Input type="file" />
      <Input type="file" multiple />
      <Input type="file" accept="image/*" />
    </div>
  )
}

export const FormExample: Story = {
  render: function FormExampleComponent() {
    const [formData, setFormData] = React.useState({
      username: '',
      email: '',
      password: ''
    })
    
    return (
      <form className="space-y-4 w-[350px]" onSubmit={(e: React.FormEvent) => e.preventDefault()}>
        <div>
          <label htmlFor="username" className="text-sm font-medium mb-2 block">
            Username
          </label>
          <div className="relative">
            <User className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              id="username"
              className="pl-8" 
              placeholder="johndoe"
              value={formData.username}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, username: e.target.value})}
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="email" className="text-sm font-medium mb-2 block">
            Email
          </label>
          <div className="relative">
            <Mail className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              id="email"
              type="email"
              className="pl-8" 
              placeholder="john@example.com"
              value={formData.email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, email: e.target.value})}
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="password" className="text-sm font-medium mb-2 block">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              id="password"
              type="password"
              className="pl-8" 
              placeholder="••••••••"
              value={formData.password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, password: e.target.value})}
            />
          </div>
        </div>
        
        <button 
          type="submit" 
          className="w-full bg-primary text-primary-foreground rounded-md py-2 text-sm font-medium hover:bg-primary/90"
        >
          Create Account
        </button>
      </form>
    )
  }
}

export const WithValidation: Story = {
  render: function WithValidationComponent() {
    const [email, setEmail] = React.useState('')
    const [error, setError] = React.useState('')
    
    const validateEmail = (value: string) => {
      if (!value) {
        setError('Email is required')
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        setError('Please enter a valid email')
      } else {
        setError('')
      }
    }
    
    return (
      <div className="w-[350px]">
        <label htmlFor="validation-email" className="text-sm font-medium mb-2 block">
          Email Address
        </label>
        <Input 
          id="validation-email"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setEmail(e.target.value)
            validateEmail(e.target.value)
          }}
          className={error ? "border-destructive focus-visible:ring-destructive" : ""}
        />
        {error && (
          <p className="text-sm text-destructive mt-1">{error}</p>
        )}
      </div>
    )
  }
}

export const CreditCardInput: Story = {
  render: function CreditCardInputComponent() {
    const [cardNumber, setCardNumber] = React.useState('')
    
    const formatCardNumber = (value: string) => {
      const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
      const matches = v.match(/\d{4,16}/g)
      const match = matches && matches[0] || ''
      const parts = []
      
      for (let i = 0, len = match.length; i < len; i += 4) {
        parts.push(match.substring(i, i + 4))
      }
      
      if (parts.length) {
        return parts.join(' ')
      } else {
        return value
      }
    }
    
    return (
      <div className="space-y-4 w-[350px]">
        <div>
          <label className="text-sm font-medium mb-2 block">Card Number</label>
          <div className="relative">
            <CreditCard className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              className="pl-8" 
              placeholder="1234 5678 9012 3456"
              value={cardNumber}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCardNumber(formatCardNumber(e.target.value))}
              maxLength={19}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Expiry</label>
            <Input placeholder="MM/YY" maxLength={5} />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">CVC</label>
            <Input placeholder="123" maxLength={3} />
          </div>
        </div>
      </div>
    )
  }
}