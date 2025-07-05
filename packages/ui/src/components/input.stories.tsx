import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { Input } from "./input";
import { ButtonV2 as Button } from "./button-v2";
import { Card, CardHeader, CardTitle, CardContent } from "./card";

// Temporary placeholder components to fix TypeScript errors
const Textarea = ({ className = "", ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <textarea 
    className={`flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    {...props} 
  />
);

const Select = ({ className = "", children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) => (
  <select 
    className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    {...props}
  >
    {children}
  </select>
);

const Checkbox = ({ label, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) => (
  <label className="flex items-center space-x-2">
    <input type="checkbox" className="h-4 w-4" {...props} />
    <span className="text-sm">{label}</span>
  </label>
);

const Radio = ({ label, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) => (
  <label className="flex items-center space-x-2">
    <input type="radio" className="h-4 w-4" {...props} />
    <span className="text-sm">{label}</span>
  </label>
);

const FormField = ({ label, error, hint, children }: { label?: string; error?: string; hint?: string; children: React.ReactNode }) => (
  <div className="space-y-2">
    {label && <label className="text-sm font-medium">{label}</label>}
    {children}
    {hint && <p className="text-sm text-muted-foreground">{hint}</p>}
    {error && <p className="text-sm text-destructive">{error}</p>}
  </div>
);

const FormGroup = ({ title, children }: { title?: string; children: React.ReactNode }) => (
  <div className="space-y-4">
    {title && <h3 className="text-lg font-medium">{title}</h3>}
    {children}
  </div>
);

const FormSection = ({ title, children }: { title?: string; children: React.ReactNode }) => (
  <div className="space-y-6">
    {title && <h2 className="text-xl font-semibold">{title}</h2>}
    {children}
  </div>
);

const meta = {
  title: "Design System/Forms",
  component: Input,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
A comprehensive form component system:

- **Input fields**: Text, email, password, number, etc.
- **Textarea**: Multi-line text input
- **Select**: Dropdown selection
- **Checkbox & Radio**: Boolean and choice inputs
- **Form helpers**: Field wrappers, groups, and sections
- **Validation states**: Error, success, and default
- **Accessibility**: Proper labels, ARIA attributes, and keyboard navigation
        `,
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic Input
export const Default: Story = {
  args: {
    placeholder: "Enter text...",
  },
};

// Input Variants
export const InputVariants: Story = {
  render: () => (
    <div className="space-y-4 max-w-md">
      <FormField label="Default Input">
        <Input placeholder="Enter your name" />
      </FormField>
      
      <FormField label="Error State" error="This field is required">
        <Input  placeholder="Enter your email" />
      </FormField>
      
      <FormField label="Success State">
        <Input  placeholder="Valid input" defaultValue="john@example.com" />
      </FormField>
      
      <FormField label="Disabled Input">
        <Input placeholder="Cannot edit" disabled />
      </FormField>
    </div>
  ),
};

// Input Sizes
export const InputSizes: Story = {
  render: () => (
    <div className="space-y-4 max-w-md">
      <FormField label="Small Input">
        <Input placeholder="Small size" />
      </FormField>
      
      <FormField label="Medium Input (Default)">
        <Input placeholder="Medium size" />
      </FormField>
      
      <FormField label="Large Input">
        <Input placeholder="Large size" />
      </FormField>
    </div>
  ),
};

// Input Types
export const InputTypes: Story = {
  render: () => (
    <div className="space-y-4 max-w-md">
      <FormField label="Text Input">
        <Input type="text" placeholder="Enter text" />
      </FormField>
      
      <FormField label="Email Input">
        <Input type="email" placeholder="email@example.com" />
      </FormField>
      
      <FormField label="Password Input">
        <Input type="password" placeholder="Enter password" />
      </FormField>
      
      <FormField label="Number Input">
        <Input type="number" placeholder="0" min={0} max={100} />
      </FormField>
      
      <FormField label="Date Input">
        <Input type="date" />
      </FormField>
      
      <FormField label="Search Input">
        <Input type="search" placeholder="Search..." />
      </FormField>
    </div>
  ),
};

// Textarea
export const TextareaExamples: Story = {
  render: () => (
    <div className="space-y-4 max-w-md">
      <FormField label="Default Textarea">
        <Textarea placeholder="Enter your message..." rows={4} />
      </FormField>
      
      <FormField label="Error Textarea" error="Message is too short">
        <Textarea  placeholder="At least 10 characters" rows={3} />
      </FormField>
      
      <FormField label="Success Textarea">
        <Textarea 
           
          defaultValue="This is a valid message with enough content."
          rows={3}
        />
      </FormField>
    </div>
  ),
};

// Select
export const SelectExamples: Story = {
  render: () => (
    <div className="space-y-4 max-w-md">
      <FormField label="Default Select">
        <Select>
          <option value="">Choose an option</option>
          <option value="1">Option 1</option>
          <option value="2">Option 2</option>
          <option value="3">Option 3</option>
        </Select>
      </FormField>
      
      <FormField label="Select with Error" error="Please select an option">
        <Select >
          <option value="">Choose an option</option>
          <option value="1">Option 1</option>
          <option value="2">Option 2</option>
        </Select>
      </FormField>
      
      <FormField label="Select Sizes">
        <div className="space-y-2">
          <Select>
            <option>Small Select</option>
          </Select>
          <Select>
            <option>Medium Select</option>
          </Select>
          <Select>
            <option>Large Select</option>
          </Select>
        </div>
      </FormField>
    </div>
  ),
};

// Checkbox and Radio
export const CheckboxRadio: Story = {
  render: () => (
    <div className="space-y-6 max-w-md">
      <FormField label="Checkbox Options">
        <div className="space-y-2">
          <Checkbox label="Option 1" defaultChecked />
          <Checkbox label="Option 2" />
          <Checkbox label="Option 3" />
          <Checkbox label="Disabled option" disabled />
        </div>
      </FormField>
      
      <FormField label="Radio Options">
        <div className="space-y-2">
          <Radio label="Choice 1" name="radio-group" defaultChecked />
          <Radio label="Choice 2" name="radio-group" />
          <Radio label="Choice 3" name="radio-group" />
          <Radio label="Disabled choice" name="radio-group" disabled />
        </div>
      </FormField>
    </div>
  ),
};

// Form Field Helpers
export const FormFieldExamples: Story = {
  render: () => (
    <div className="space-y-6 max-w-md">
      <FormField label="Required Field">
        <Input placeholder="This field is required" />
      </FormField>
      
      <FormField 
        label="Field with Hint" 
        hint="Enter your full legal name as it appears on your ID"
      >
        <Input placeholder="John Doe" />
      </FormField>
      
      <FormField 
        label="Field with Error" 
        error="Username must be at least 3 characters"
      >
        <Input  placeholder="Username" defaultValue="ab" />
      </FormField>
      
      <FormField 
        label="Field with Hint and Error" 
        hint="8-20 characters, including letters and numbers"
        error="Password is too weak"
      >
        <Input type="password"  placeholder="Password" />
      </FormField>
    </div>
  ),
};

// Complete Form Example
export const CompleteForm: Story = {
  render: () => (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle>User Registration</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-6">
          <FormSection 
            title="Personal Information" 
            
          >
            <FormGroup>
              <div className="grid grid-cols-2 gap-4">
                <FormField label="First Name">
                  <Input placeholder="John" />
                </FormField>
                <FormField label="Last Name">
                  <Input placeholder="Doe" />
                </FormField>
              </div>
              
              <FormField label="Email Address" hint="We'll never share your email">
                <Input type="email" placeholder="john@example.com" />
              </FormField>
              
              <FormField label="Phone Number">
                <Input type="tel" placeholder="+1 (555) 000-0000" />
              </FormField>
            </FormGroup>
          </FormSection>
          
          <FormSection 
            title="Account Settings" 
            
          >
            <FormGroup>
              <FormField label="Username" hint="3-20 characters, lowercase letters and numbers only">
                <Input placeholder="johndoe123" />
              </FormField>
              
              <FormField label="Password" hint="At least 8 characters">
                <Input type="password" placeholder="••••••••" />
              </FormField>
              
              <FormField label="Confirm Password">
                <Input type="password" placeholder="••••••••" />
              </FormField>
            </FormGroup>
          </FormSection>
          
          <FormSection title="Preferences">
            <FormGroup>
              <FormField label="Notification Settings">
                <div className="space-y-2">
                  <Checkbox label="Email notifications" defaultChecked />
                  <Checkbox label="SMS notifications" />
                  <Checkbox label="Marketing updates" />
                </div>
              </FormField>
              
              <FormField label="Account Type">
                <div className="space-y-2">
                  <Radio label="Personal" name="account-type" defaultChecked />
                  <Radio label="Business" name="account-type" />
                  <Radio label="Developer" name="account-type" />
                </div>
              </FormField>
            </FormGroup>
          </FormSection>
          
          <div className="flex gap-3 pt-4">
            <Button type="submit" variant="primary">
              Create Account
            </Button>
            <Button type="button" variant="secondary">
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  ),
};

// Login Form Example
export const LoginForm: Story = {
  render: () => (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center">Sign In</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-4">
          <FormField label="Email">
            <Input type="email" placeholder="email@example.com" />
          </FormField>
          
          <FormField label="Password">
            <Input type="password" placeholder="••••••••" />
          </FormField>
          
          <div className="flex items-center justify-between">
            <Checkbox label="Remember me" />
            <a href="#" className="text-sm text-primary-600 hover:text-primary-700">
              Forgot password?
            </a>
          </div>
          
          <Button type="submit"  className="w-full">
            Sign In
          </Button>
          
          <p className="text-center text-sm text-gray-600">
            Don&apos;t have an account?{" "}
            <a href="#" className="text-primary-600 hover:text-primary-700">
              Sign up
            </a>
          </p>
        </form>
      </CardContent>
    </Card>
  ),
};

// Dark Mode Support
export const DarkMode: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-8">
      <div className="p-8 bg-white rounded-lg">
        <h4 className="font-semibold mb-4">Light Mode</h4>
        <FormGroup>
          <FormField label="Input Field">
            <Input placeholder="Light mode input" />
          </FormField>
          <FormField label="Select Field">
            <Select>
              <option>Option 1</option>
              <option>Option 2</option>
            </Select>
          </FormField>
          <FormField label="Checkbox">
            <Checkbox label="Light mode checkbox" />
          </FormField>
        </FormGroup>
      </div>
      
      <div className="p-8 bg-gray-900 rounded-lg dark">
        <h4 className="font-semibold mb-4 text-white">Dark Mode</h4>
        <FormGroup>
          <FormField label="Input Field">
            <Input placeholder="Dark mode input" />
          </FormField>
          <FormField label="Select Field">
            <Select>
              <option>Option 1</option>
              <option>Option 2</option>
            </Select>
          </FormField>
          <FormField label="Checkbox">
            <Checkbox label="Dark mode checkbox" />
          </FormField>
        </FormGroup>
      </div>
    </div>
  ),
  parameters: {
    backgrounds: { default: "light" },
  },
};