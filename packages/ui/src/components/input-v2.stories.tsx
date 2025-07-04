import type { Meta, StoryObj } from "@storybook/react";
import { 
  Input, 
  Textarea, 
  Select, 
  Checkbox, 
  Radio,
  FormField,
  FormGroup,
  FormSection
} from "./input-v2";
import { ButtonV2 } from "./button-v2";
import { Card, CardHeader, CardTitle, CardContent } from "./card-v2";

const meta = {
  title: "Design System/Forms V2",
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
        <Input variant="error" placeholder="Enter your email" />
      </FormField>
      
      <FormField label="Success State">
        <Input variant="success" placeholder="Valid input" defaultValue="john@example.com" />
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
        <Input size="sm" placeholder="Small size" />
      </FormField>
      
      <FormField label="Medium Input (Default)">
        <Input size="md" placeholder="Medium size" />
      </FormField>
      
      <FormField label="Large Input">
        <Input size="lg" placeholder="Large size" />
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
        <Textarea variant="error" placeholder="At least 10 characters" rows={3} />
      </FormField>
      
      <FormField label="Success Textarea">
        <Textarea 
          variant="success" 
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
        <Select variant="error">
          <option value="">Choose an option</option>
          <option value="1">Option 1</option>
          <option value="2">Option 2</option>
        </Select>
      </FormField>
      
      <FormField label="Select Sizes">
        <div className="space-y-2">
          <Select size="sm">
            <option>Small Select</option>
          </Select>
          <Select size="md">
            <option>Medium Select</option>
          </Select>
          <Select size="lg">
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
      <FormField label="Required Field" required>
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
        <Input variant="error" placeholder="Username" defaultValue="ab" />
      </FormField>
      
      <FormField 
        label="Field with Hint and Error" 
        hint="8-20 characters, including letters and numbers"
        error="Password is too weak"
      >
        <Input type="password" variant="error" placeholder="Password" />
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
            description="Please provide your basic information"
          >
            <FormGroup>
              <div className="grid grid-cols-2 gap-4">
                <FormField label="First Name" required>
                  <Input placeholder="John" />
                </FormField>
                <FormField label="Last Name" required>
                  <Input placeholder="Doe" />
                </FormField>
              </div>
              
              <FormField label="Email Address" required hint="We'll never share your email">
                <Input type="email" placeholder="john@example.com" />
              </FormField>
              
              <FormField label="Phone Number">
                <Input type="tel" placeholder="+1 (555) 000-0000" />
              </FormField>
            </FormGroup>
          </FormSection>
          
          <FormSection 
            title="Account Settings" 
            description="Choose your account preferences"
          >
            <FormGroup>
              <FormField label="Username" required hint="3-20 characters, lowercase letters and numbers only">
                <Input placeholder="johndoe123" />
              </FormField>
              
              <FormField label="Password" required hint="At least 8 characters">
                <Input type="password" placeholder="••••••••" />
              </FormField>
              
              <FormField label="Confirm Password" required>
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
            <ButtonV2 type="submit" variant="primary">
              Create Account
            </ButtonV2>
            <ButtonV2 type="button" variant="outline">
              Cancel
            </ButtonV2>
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
          <FormField label="Email" required>
            <Input type="email" placeholder="email@example.com" />
          </FormField>
          
          <FormField label="Password" required>
            <Input type="password" placeholder="••••••••" />
          </FormField>
          
          <div className="flex items-center justify-between">
            <Checkbox label="Remember me" />
            <a href="#" className="text-sm text-primary-600 hover:text-primary-700">
              Forgot password?
            </a>
          </div>
          
          <ButtonV2 type="submit" variant="primary" className="w-full">
            Sign In
          </ButtonV2>
          
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