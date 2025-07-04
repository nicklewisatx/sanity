import type { Meta, StoryObj } from "@storybook/react";
import { 
  Heading, 
  Text, 
  Label, 
  Caption, 
  Lead, 
  Link, 
  Code 
} from "./typography-v2";

const meta = {
  title: "Design System/Typography V2",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
A comprehensive typography system following design principles:

- **Modular scale**: Using 1.25 ratio for harmonious sizing
- **Consistent spacing**: Based on 8px grid system
- **Semantic variants**: Clear hierarchy and purpose
- **Accessibility**: Proper contrast ratios and focus states
- **Flexible components**: Heading, Text, Label, Caption, Lead, Link, Code
        `,
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta;

export default meta;

// Type scale demonstration
export const TypeScale: StoryObj = {
  render: () => (
    <div className="space-y-6">
      <div>
        <Caption className="mb-2">Heading 1 • 61px • 3.815rem</Caption>
        <Heading level={1}>The quick brown fox jumps over the lazy dog</Heading>
      </div>
      <div>
        <Caption className="mb-2">Heading 2 • 48.8px • 3.052rem</Caption>
        <Heading level={2}>The quick brown fox jumps over the lazy dog</Heading>
      </div>
      <div>
        <Caption className="mb-2">Heading 3 • 39px • 2.441rem</Caption>
        <Heading level={3}>The quick brown fox jumps over the lazy dog</Heading>
      </div>
      <div>
        <Caption className="mb-2">Heading 4 • 31.25px • 1.953rem</Caption>
        <Heading level={4}>The quick brown fox jumps over the lazy dog</Heading>
      </div>
      <div>
        <Caption className="mb-2">Heading 5 • 25px • 1.5625rem</Caption>
        <Heading level={5}>The quick brown fox jumps over the lazy dog</Heading>
      </div>
      <div>
        <Caption className="mb-2">Heading 6 • 20px • 1.25rem</Caption>
        <Heading level={6}>The quick brown fox jumps over the lazy dog</Heading>
      </div>
      <div>
        <Caption className="mb-2">Body Large • 20px • 1.25rem</Caption>
        <Text size="lg">The quick brown fox jumps over the lazy dog</Text>
      </div>
      <div>
        <Caption className="mb-2">Body • 16px • 1rem</Caption>
        <Text>The quick brown fox jumps over the lazy dog</Text>
      </div>
      <div>
        <Caption className="mb-2">Body Small • 14px • 0.875rem</Caption>
        <Text size="sm">The quick brown fox jumps over the lazy dog</Text>
      </div>
      <div>
        <Caption className="mb-2">Caption • 12px • 0.75rem</Caption>
        <Caption>The quick brown fox jumps over the lazy dog</Caption>
      </div>
    </div>
  ),
};

// Heading variations
export const Headings: StoryObj = {
  render: () => (
    <div className="space-y-8">
      <div>
        <Heading level={1}>Default Heading</Heading>
        <Heading level={2} color="primary">Primary Heading</Heading>
        <Heading level={3} color="muted">Muted Heading</Heading>
      </div>
      
      <div>
        <Heading level={2} weight="normal">Normal Weight</Heading>
        <Heading level={2} weight="medium">Medium Weight</Heading>
        <Heading level={2} weight="semibold">Semibold Weight</Heading>
        <Heading level={2} weight="bold">Bold Weight</Heading>
      </div>
      
      <div className="space-y-2">
        <Heading level={3} align="left">Left Aligned</Heading>
        <Heading level={3} align="center">Center Aligned</Heading>
        <Heading level={3} align="right">Right Aligned</Heading>
      </div>
    </div>
  ),
};

// Text variations
export const TextVariations: StoryObj = {
  render: () => (
    <div className="space-y-8">
      <div className="space-y-2">
        <Text>Default text style with normal weight and size</Text>
        <Text color="primary">Primary colored text for emphasis</Text>
        <Text color="muted">Muted text for secondary information</Text>
        <Text color="error">Error text for validation messages</Text>
        <Text color="success">Success text for positive feedback</Text>
        <Text color="warning">Warning text for important notices</Text>
      </div>
      
      <div className="space-y-2">
        <Text weight="normal">Normal weight text</Text>
        <Text weight="medium">Medium weight text</Text>
        <Text weight="semibold">Semibold weight text</Text>
        <Text weight="bold">Bold weight text</Text>
      </div>
      
      <div className="space-y-2">
        <Text lineHeight="tight">Tight line height for compact layouts</Text>
        <Text lineHeight="normal">Normal line height for readability</Text>
        <Text lineHeight="relaxed">Relaxed line height for improved readability in longer texts</Text>
      </div>
    </div>
  ),
};

// Specialized components
export const SpecializedComponents: StoryObj = {
  render: () => (
    <div className="space-y-6">
      <div>
        <Label htmlFor="example">Form Label</Label>
        <input
          id="example"
          type="text"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          placeholder="Input field"
        />
      </div>
      
      <div>
        <Lead>
          This is a lead paragraph. It&apos;s larger and more prominent than regular body text, 
          perfect for introductions or key messages that need to stand out.
        </Lead>
      </div>
      
      <div>
        <Text>Regular paragraph text for comparison</Text>
        <Caption className="mt-2">
          This is a caption. Use it for image descriptions, footnotes, or supplementary information.
        </Caption>
      </div>
    </div>
  ),
};

// Links
export const Links: StoryObj = {
  render: () => (
    <div className="space-y-4">
      <Text>
        This is a paragraph with an <Link href="#">inline link</Link> that can be clicked.
        You can also have <Link href="#" underline={false}>links without underlines</Link>.
      </Text>
      
      <Text>
        Visit our <Link href="#" color="primary">primary link</Link> or check out this{" "}
        <Link href="#" external>external link</Link> that opens in a new tab.
      </Text>
      
      <div className="space-y-2">
        <Link href="#" size="sm">Small link</Link>
        <Link href="#">Default link</Link>
        <Link href="#" size="lg">Large link</Link>
      </div>
    </div>
  ),
};

// Code blocks
export const CodeExamples: StoryObj = {
  render: () => (
    <div className="space-y-6">
      <Text>
        Inline code like <Code>const variable = &quot;value&quot;</Code> can be used within text.
      </Text>
      
      <div>
        <Label className="mb-2">Code Block:</Label>
        <Code block>
{`function greet(name) {
  console.log(\`Hello, \${name}!\`);
  return \`Welcome to our application, \${name}\`;
}

greet("World");`}
        </Code>
      </div>
    </div>
  ),
};

// Real-world example
export const BlogPost: StoryObj = {
  name: "Blog Post Example",
  render: () => (
    <article className="max-w-3xl mx-auto space-y-6">
      <header className="space-y-4">
        <Caption>Published on January 4, 2025 • 5 min read</Caption>
        <Heading level={1}>Building Scalable Design Systems with Storybook</Heading>
        <Lead>
          Learn how to create maintainable, flexible design systems that grow with your product 
          while maintaining consistency and developer experience.
        </Lead>
      </header>
      
      <div className="space-y-4">
        <Text>
          Design systems have become essential for modern web development. They provide a shared 
          language between designers and developers, ensure consistency across products, and 
          significantly speed up the development process.
        </Text>
        
        <Heading level={2} className="mt-8 mb-4">Why Design Systems Matter</Heading>
        
        <Text>
          A well-implemented design system serves as a single source of truth for your product&apos;s 
          visual language. It includes <Code>components</Code>, <Code>patterns</Code>, and{" "}
          <Code>guidelines</Code> that teams can use to build consistent user interfaces.
        </Text>
        
        <Heading level={3} className="mt-6 mb-3">Key Benefits</Heading>
        
        <ul className="space-y-2 list-disc list-inside">
          <li><Text as="span">Consistency across all products and platforms</Text></li>
          <li><Text as="span">Faster development with reusable components</Text></li>
          <li><Text as="span">Better collaboration between teams</Text></li>
          <li><Text as="span">Easier maintenance and updates</Text></li>
        </ul>
        
        <Text>
          To learn more about implementing design systems, check out our{" "}
          <Link href="#" external>comprehensive guide</Link> or{" "}
          <Link href="#">browse our component library</Link>.
        </Text>
      </div>
      
      <footer className="border-t pt-6">
        <Caption>
          Written by Jane Doe • Senior Design System Engineer
        </Caption>
      </footer>
    </article>
  ),
};

// Dark mode support
export const DarkMode: StoryObj = {
  render: () => (
    <div className="grid grid-cols-2 gap-8">
      <div className="p-8 bg-white rounded-lg">
        <Heading level={3} className="mb-4">Light Mode</Heading>
        <div className="space-y-4">
          <Text>Default text in light mode</Text>
          <Text color="primary">Primary text color</Text>
          <Text color="muted">Muted text color</Text>
          <Link href="#">Link in light mode</Link>
          <Code>inline code</Code>
        </div>
      </div>
      
      <div className="p-8 bg-gray-900 rounded-lg dark">
        <Heading level={3} className="mb-4">Dark Mode</Heading>
        <div className="space-y-4">
          <Text>Default text in dark mode</Text>
          <Text color="primary">Primary text color</Text>
          <Text color="muted">Muted text color</Text>
          <Link href="#">Link in dark mode</Link>
          <Code>inline code</Code>
        </div>
      </div>
    </div>
  ),
  parameters: {
    backgrounds: { default: "light" },
  },
};