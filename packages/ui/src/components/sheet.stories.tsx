import type { Meta, StoryObj } from '@storybook/react'
import { Button } from './button.js'
import { Input } from './input.js'
import { Badge } from './badge.js'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './sheet.js'
import { Menu, ShoppingCart, Settings, User } from 'lucide-react'
import * as React from 'react'

const meta = {
  title: 'Primitives/Sheet',
  component: Sheet,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A sheet is a surface that slides in from the edge of the screen.'
      }
    }
  },
  tags: ['autodocs']
} satisfies Meta<typeof Sheet>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Open Sheet</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit profile</SheetTitle>
          <SheetDescription>
            Make changes to your profile here. Click save when you&apos;re done.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="name" className="text-right">
              Name
            </label>
            <Input id="name" value="Pedro Duarte" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="username" className="text-right">
              Username
            </label>
            <Input id="username" value="@peduarte" className="col-span-3" />
          </div>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button type="submit">Save changes</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

export const Sides: Story = {
  render: () => (
    <div className="flex gap-4 flex-wrap">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline">Right (Default)</Button>
        </SheetTrigger>
        <SheetContent side="right">
          <SheetHeader>
            <SheetTitle>Right Sheet</SheetTitle>
            <SheetDescription>
              This sheet slides in from the right side of the screen.
            </SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>

      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline">Left</Button>
        </SheetTrigger>
        <SheetContent side="left">
          <SheetHeader>
            <SheetTitle>Left Sheet</SheetTitle>
            <SheetDescription>
              This sheet slides in from the left side of the screen.
            </SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>

      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline">Top</Button>
        </SheetTrigger>
        <SheetContent side="top">
          <SheetHeader>
            <SheetTitle>Top Sheet</SheetTitle>
            <SheetDescription>
              This sheet slides in from the top of the screen.
            </SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>

      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline">Bottom</Button>
        </SheetTrigger>
        <SheetContent side="bottom">
          <SheetHeader>
            <SheetTitle>Bottom Sheet</SheetTitle>
            <SheetDescription>
              This sheet slides in from the bottom of the screen.
            </SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </div>
  )
}

export const MobileMenu: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>
        <nav className="mt-6">
          <ul className="space-y-3">
            <li>
              <a href="#" className="block py-2 text-sm hover:text-primary">
                Home
              </a>
            </li>
            <li>
              <a href="#" className="block py-2 text-sm hover:text-primary">
                Products
              </a>
            </li>
            <li>
              <a href="#" className="block py-2 text-sm hover:text-primary">
                About
              </a>
            </li>
            <li>
              <a href="#" className="block py-2 text-sm hover:text-primary">
                Contact
              </a>
            </li>
          </ul>
        </nav>
        <div className="absolute bottom-6 left-6 right-6">
          <Button className="w-full">Sign In</Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}

export const ShoppingCartExample: Story = {
  render: function ShoppingCartExampleComponent() {
    const [cartItems] = React.useState([
      { id: 1, name: 'Wireless Headphones', price: 99.99, quantity: 1 },
      { id: 2, name: 'Smart Watch', price: 249.99, quantity: 2 },
      { id: 3, name: 'USB-C Cable', price: 19.99, quantity: 3 },
    ])
    
    const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0)
    const tax = subtotal * 0.08
    const total = subtotal + tax
    
    return (
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" className="relative">
            <ShoppingCart className="h-4 w-4 mr-2" />
            Cart
            <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center">
              {cartItems.length}
            </Badge>
          </Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Shopping Cart</SheetTitle>
            <SheetDescription>
              You have {cartItems.length} items in your cart
            </SheetDescription>
          </SheetHeader>
          <div className="mt-8 space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between py-2">
                <div className="flex-1">
                  <h4 className="text-sm font-medium">{item.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    ${item.price} × {item.quantity}
                  </p>
                </div>
                <p className="text-sm font-medium">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-8 space-y-2 pt-6 border-t">
            <div className="flex justify-between text-sm">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Tax</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-medium">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
          <SheetFooter className="mt-6">
            <Button className="w-full">Checkout</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    )
  }
}

export const SettingsPanel: Story = {
  render: function SettingsPanelComponent() {
    const [notifications, setNotifications] = React.useState(true)
    const [marketing, setMarketing] = React.useState(false)
    const [theme, setTheme] = React.useState('system')
    
    return (
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
            <span className="sr-only">Settings</span>
          </Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Settings</SheetTitle>
            <SheetDescription>
              Manage your account settings and preferences.
            </SheetDescription>
          </SheetHeader>
          <div className="py-6 space-y-6">
            <div>
              <h3 className="text-sm font-medium mb-4">Account</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span className="text-sm">john.doe@example.com</span>
                </div>
                <Button variant="outline" className="w-full">
                  Change Password
                </Button>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-4">Preferences</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label htmlFor="notifications" className="text-sm font-medium">
                    Push Notifications
                  </label>
                  <input
                    type="checkbox"
                    id="notifications"
                    checked={notifications}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNotifications(e.target.checked)}
                    className="h-4 w-4"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label htmlFor="marketing" className="text-sm font-medium">
                    Marketing Emails
                  </label>
                  <input
                    type="checkbox"
                    id="marketing"
                    checked={marketing}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMarketing(e.target.checked)}
                    className="h-4 w-4"
                  />
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-4">Appearance</h3>
              <select
                value={theme}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setTheme(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="system">System</option>
              </select>
            </div>
          </div>
          <SheetFooter>
            <SheetClose asChild>
              <Button variant="outline">Cancel</Button>
            </SheetClose>
            <Button>Save Changes</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    )
  }
}

export const WithForm: Story = {
  render: function WithFormComponent() {
    const [formData, setFormData] = React.useState({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      message: ''
    })
    
    return (
      <Sheet>
        <SheetTrigger asChild>
          <Button>Contact Us</Button>
        </SheetTrigger>
        <SheetContent className="sm:max-w-[425px]">
          <SheetHeader>
            <SheetTitle>Contact Form</SheetTitle>
            <SheetDescription>
              Fill out the form below and we&apos;ll get back to you as soon as possible.
            </SheetDescription>
          </SheetHeader>
          <form className="mt-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="text-sm font-medium">
                  First Name
                </label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, firstName: e.target.value})}
                  className="mt-1"
                />
              </div>
              <div>
                <label htmlFor="lastName" className="text-sm font-medium">
                  Last Name
                </label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, lastName: e.target.value})}
                  className="mt-1"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, email: e.target.value})}
                className="mt-1"
              />
            </div>
            
            <div>
              <label htmlFor="phone" className="text-sm font-medium">
                Phone (optional)
              </label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, phone: e.target.value})}
                className="mt-1"
              />
            </div>
            
            <div>
              <label htmlFor="message" className="text-sm font-medium">
                Message
              </label>
              <textarea
                id="message"
                rows={4}
                value={formData.message}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({...formData, message: e.target.value})}
                className="mt-1 flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                placeholder="Tell us how we can help..."
              />
            </div>
          </form>
          <SheetFooter className="mt-6">
            <SheetClose asChild>
              <Button variant="outline">Cancel</Button>
            </SheetClose>
            <Button type="submit">Send Message</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    )
  }
}