# UI Component Library Style Guide

**Last Updated:** 2025-07-03 - Simplified to developer-focused 3-phase approach

## Overview

This style guide helps you build and extend UI components in our monorepo. We provide a solid foundation of accessible, type-safe components built with React, TypeScript, Tailwind CSS, and Radix UI primitives.

**What this guide provides:**
- Clear patterns for adding new components
- Extension examples and best practices
- Practical workflow for immediate productivity
- Foundation for scaling as your project grows

## Quick Start

```bash
# Start Storybook (runs in background automatically)
cd packages/ui
pnpm storybook

# View existing components
open http://localhost:6006

# Create your first component
mkdir -p src/components/primitives/my-component
# Follow the Developer Workflow below
```

## Developer Workflow

### How to Add a New Component

This section provides the standard process for adding new components. We'll use creating an `Alert` component as an example.

#### 1. Choose Component Type

Determine which category your component belongs to:
- **Primitives** - Basic UI elements (buttons, inputs, badges)
- **Compositions** - Combined primitives (cards, forms, modals)
- **Patterns** - Specific implementations (loading states, error boundaries)

#### 2. Create Component Structure

For our Alert example (a primitive):

```bash
# Create directory structure
mkdir -p src/components/primitives/alert

# Create files
touch src/components/primitives/alert/alert.tsx
touch src/components/primitives/alert/alert.stories.tsx
touch src/components/primitives/alert/index.ts
```

#### 3. Implement the Component

```tsx
// alert.tsx
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const alertVariants = cva(
  "relative w-full rounded-lg border p-4",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground",
        destructive: "border-destructive/50 text-destructive dark:border-destructive",
        warning: "border-yellow-500/50 text-yellow-800 dark:text-yellow-300",
        success: "border-green-500/50 text-green-800 dark:text-green-300",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant, ...props }, ref) => (
    <div
      ref={ref}
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    />
  )
)
Alert.displayName = "Alert"

export { Alert, alertVariants }
```

#### 4. Create Storybook Stories

```tsx
// alert.stories.tsx
import type { Meta, StoryObj } from '@storybook/react'
import { Alert } from './alert'

const meta = {
  title: 'Primitives/Alert',
  component: Alert,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'destructive', 'warning', 'success'],
    },
  },
} satisfies Meta<typeof Alert>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: 'This is a default alert message.',
  },
}

export const Destructive: Story = {
  args: {
    variant: 'destructive',
    children: 'This is a destructive alert message.',
  },
}

export const AllVariants: Story = {
  render: () => (
    <div className="space-y-4 w-[400px]">
      <Alert>Default alert message</Alert>
      <Alert variant="destructive">Error: Something went wrong</Alert>
      <Alert variant="warning">Warning: Please review your input</Alert>
      <Alert variant="success">Success: Operation completed</Alert>
    </div>
  ),
}
```

#### 5. Export the Component

```tsx
// index.ts
export * from './alert'
```

Update the main package exports:
```tsx
// src/components/primitives/index.ts
export * from './alert'
```

#### 6. Run Storybook to Test

```bash
cd packages/ui
pnpm storybook
```

### Component Development Checklist

When creating any new component:

- [ ] **Accessibility First** - Use semantic HTML and ARIA attributes
- [ ] **TypeScript Types** - Define comprehensive prop interfaces
- [ ] **Ref Forwarding** - Use `React.forwardRef` for DOM access
- [ ] **Variant Support** - Use CVA for consistent variant APIs
- [ ] **Dark Mode** - Ensure styles work in both themes
- [ ] **Storybook Stories** - Document all states and variants
- [ ] **Responsive Design** - Test across breakpoints
- [ ] **Props Spreading** - Allow className and other prop overrides

### Extension Patterns

#### Extending Primitives

```tsx
// Example: LoadingButton extends Button
import { Button, ButtonProps } from '@/components/primitives/button'
import { Loader2 } from 'lucide-react'

interface LoadingButtonProps extends ButtonProps {
  loading?: boolean
}

export function LoadingButton({ 
  loading, 
  children, 
  disabled,
  ...props 
}: LoadingButtonProps) {
  return (
    <Button disabled={disabled || loading} {...props}>
      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </Button>
  )
}
```

#### Composition Pattern

```tsx
// Example: Card composed from primitives
import { cn } from '@/lib/utils'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Card({ className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-lg border bg-card text-card-foreground shadow-sm",
        className
      )}
      {...props}
    />
  )
}

Card.Header = function CardHeader({ className, ...props }: CardProps) {
  return (
    <div
      className={cn("flex flex-col space-y-1.5 p-6", className)}
      {...props}
    />
  )
}

Card.Title = function CardTitle({ 
  className, 
  ...props 
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn("text-lg font-semibold leading-none", className)}
      {...props}
    />
  )
}
```

## Implementation Plan

### Phase Overview

Our implementation follows a practical 3-phase approach designed to deliver immediate value while establishing patterns for long-term growth.

```
┌─────────────────────────────┐
│ PHASE 1: FOUNDATION         │
│ Document & Organize         │
│ Make existing work useful   │
└────────────┬────────────────┘
             │
┌────────────▼────────────────┐
│ PHASE 2: PATTERNS           │
│ Demonstrate Extension       │
│ Show composition examples   │
└────────────┬────────────────┘
             │
┌────────────▼────────────────┐
│ PHASE 3: AUTOMATION         │
│ Component generators        │
│ Testing & quality tools     │
└─────────────────────────────┘
```

### Phase 1: Foundation (Immediate)

**Goal:** Make existing components discoverable and useful

#### Tasks
1. **Document Existing Components**
   - Create `.stories.tsx` for: accordion, avatar, badge, dropdown-menu, input, navigation-menu, sheet
   - Add interactive controls and variant examples
   - Include usage documentation

2. **Organize Directory Structure**
   ```
   src/components/
   ├── primitives/      # Basic UI elements
   ├── compositions/    # Combined components
   └── patterns/        # Implementation examples
   ```

3. **Configure Storybook**
   - Set up Tailwind CSS integration
   - Add dark/light mode toggle
   - Configure viewport addon
   - Enable accessibility checks

4. **Update Documentation**
   - Simplify this style guide
   - Add practical examples
   - Create component templates

### Phase 2: Patterns & Examples

**Goal:** Demonstrate how to extend and compose components

#### Tasks
1. **Create Pattern Examples**
   - `LoadingButton` - Shows primitive extension
   - `Card` - Demonstrates composition
   - `Alert` - Illustrates variant patterns

2. **Build Real-World Examples**
   - Form with validation
   - Data table with sorting
   - Modal with compound components

3. **Document Best Practices**
   - TypeScript patterns
   - Accessibility guidelines
   - Performance tips

### Phase 3: Developer Tools

**Goal:** Automate repetitive tasks and ensure quality

#### Tasks
1. **Component Generator**
   ```bash
   pnpm ui:generate <type> <name>
   # Example: pnpm ui:generate primitive Alert
   ```

2. **Quality Tools**
   - ESLint rules for components
   - Prettier configuration
   - Pre-commit hooks

3. **Testing Setup**
   - Unit test templates
   - Visual regression tests
   - Accessibility audits

## Core Principles

### 1. Schema-First Design
- Components are designed to match Sanity schema types exactly
- Props names must match Sanity field names (e.g., `richText`, not `content`)
- Components handle Sanity data structures natively

### 2. Portable Text as First-Class Citizen
- Rich text content uses Sanity's Portable Text format
- Custom serializers for blocks, marks, and annotations
- Support for inline images and custom components

### 3. Type Safety
- Use generated Sanity types for all component props
- Strict TypeScript throughout
- Runtime validation for critical data

### 4. Graceful Data Handling
- Components handle undefined/null data gracefully
- Sensible defaults for missing content
- No runtime errors from missing data

## Component Architecture

```
packages/ui/src/
├── components/
│   ├── blocks/          # Sanity block components
│   ├── fields/          # Field-level components
│   ├── portable-text/   # Portable Text serializers
│   ├── preview/         # Studio preview components
│   └── primitives/      # Base UI components
├── lib/
│   ├── sanity/         # Sanity utilities
│   └── utils/          # General utilities
└── types/              # TypeScript types
```

## Component Categories

### 1. Block Components (`/blocks`)

Direct mapping to Sanity block schemas. These are the main content sections used in page builders.

**Example: Hero Block**
```tsx
// Maps to Sanity schema: hero
export interface HeroBlockProps {
  badge?: string;
  title?: string;
  richText?: PortableTextBlock[];
  image?: SanityImageSource;
  buttons?: Button[];
}

export function HeroBlock({ badge, title, richText, image, buttons }: HeroBlockProps) {
  // Component implementation
}
```

**Naming Convention:**
- Component: `{BlockName}Block` (e.g., `HeroBlock`, `CTABlock`)
- File: `{block-name}-block.tsx` (e.g., `hero-block.tsx`)

### 2. Field Components (`/fields`)

Render individual Sanity field types. These are the building blocks for block components.

**Core Field Components:**
- `RichText` - Renders Portable Text content
- `SanityImage` - Handles Sanity images with transformations
- `Buttons` - Renders button arrays
- `Icon` - Renders icon picker selections

**Example: RichText Field**
```tsx
export interface RichTextProps {
  value?: PortableTextBlock[];
  className?: string;
}

export function RichText({ value, className }: RichTextProps) {
  if (!value?.length) return null;
  
  return (
    <PortableText 
      value={value}
      components={portableTextComponents}
      className={className}
    />
  );
}
```

### 3. Portable Text Serializers (`/portable-text`)

Custom components for rendering Portable Text marks, blocks, and annotations.

**Structure:**
```
portable-text/
├── index.ts           # Main components export
├── marks/             # Custom mark renderers
├── blocks/            # Block-level renderers
└── annotations/       # Link and other annotations
```

**Example: Custom Link Annotation**
```tsx
// annotations/custom-link.tsx
export function CustomLink({ value, children }) {
  const { customLink } = value;
  
  if (customLink?.type === 'internal') {
    return <Link href={customLink.href}>{children}</Link>;
  }
  
  return (
    <a href={customLink?.href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
}
```

### 4. Primitive Components (`/primitives`)

Base UI components used across the library. These don't map directly to Sanity schemas but provide consistent styling and behavior.

**Examples:**
- `Button` - Base button component
- `Card` - Container component
- `Badge` - Label/tag component

**Characteristics:**
- Schema-agnostic
- Highly reusable
- Follow design system patterns
- Variant-based styling with CVA

### 5. Preview Components (`/preview`)

Components optimized for Sanity Studio preview pane. Simplified versions that render quickly and handle preview-specific requirements.

## Implementation Patterns

### 1. Block Renderer Pattern

Dynamic component rendering based on block type:

```tsx
// components/block-renderer.tsx
const blockComponents = {
  hero: HeroBlock,
  cta: CTABlock,
  'faq-accordion': FAQAccordionBlock,
  // ... other blocks
};

export function BlockRenderer({ blocks }: { blocks: any[] }) {
  return (
    <>
      {blocks?.map((block) => {
        const Component = blockComponents[block._type];
        if (!Component) return null;
        
        return <Component key={block._key} {...block} />;
      })}
    </>
  );
}
```

### 2. Sanity Image Pattern

Handle Sanity images with hotspot and transformations:

```tsx
// components/fields/sanity-image.tsx
import { urlForImage } from '@/lib/sanity/image';

export interface SanityImageProps {
  value?: SanityImageSource;
  alt?: string;
  width?: number;
  height?: number;
  className?: string;
}

export function SanityImage({ value, alt, width, height, className }: SanityImageProps) {
  if (!value?.asset) return null;
  
  const imageUrl = urlForImage(value)
    ?.width(width || 1920)
    .height(height || 1080)
    .url();
    
  if (!imageUrl) return null;
  
  return (
    <img
      src={imageUrl}
      alt={alt || ''}
      width={width}
      height={height}
      className={className}
      loading="lazy"
    />
  );
}
```

### 3. Button Array Pattern

Render Sanity button arrays with consistent styling:

```tsx
// components/fields/buttons.tsx
export interface ButtonsProps {
  buttons?: Array<{
    _key: string;
    text?: string;
    link?: { href: string; type: 'internal' | 'external' };
    variant?: 'default' | 'secondary' | 'outline';
  }>;
  className?: string;
}

export function Buttons({ buttons, className }: ButtonsProps) {
  if (!buttons?.length) return null;
  
  return (
    <div className={cn("flex flex-wrap gap-4", className)}>
      {buttons.map((button) => (
        <Button
          key={button._key}
          href={button.link?.href}
          variant={button.variant}
        >
          {button.text}
        </Button>
      ))}
    </div>
  );
}
```

## Styling Guidelines

### 1. Tailwind CSS
- Use Tailwind utility classes for styling
- Keep component styles minimal and composable
- Use `cn()` utility for conditional classes

### 2. CSS Variables
- Define semantic color variables
- Support light/dark mode through CSS variables
- Keep animations consistent

### 3. Responsive Design
- Mobile-first approach
- Use Tailwind responsive prefixes
- Test all breakpoints

## Type Safety

### 1. Generated Types
```tsx
// Import generated Sanity types
import type { Hero, Button, RichTextBlock } from '@/types/sanity';

// Use in component props
export interface HeroBlockProps {
  data: Hero;
}
```

### 2. Utility Types
```tsx
// Common utility types
export type Maybe<T> = T | null | undefined;
export type SanityImageSource = {
  _type: 'image';
  asset: { _ref: string; _type: 'reference' };
  hotspot?: { x: number; y: number; height: number; width: number };
  crop?: { top: number; bottom: number; left: number; right: number };
};
```

## Testing Strategy

### 1. Component Testing
- Test with various data states (empty, partial, full)
- Verify Portable Text rendering
- Check responsive behavior

### 2. Visual Testing
- Storybook for component documentation
- Stories for each data state
- Visual regression testing

## Migration Guide

### From Old Components to New

**Old Pattern:**
```tsx
<Hero
  title="Welcome"
  description="Lorem ipsum"
  actions={[{ text: "Get Started", href: "/" }]}
/>
```

**New Pattern:**
```tsx
<HeroBlock
  title="Welcome"
  richText={portableTextData}
  buttons={[{ 
    _key: "button1",
    text: "Get Started",
    link: { href: "/", type: "internal" }
  }]}
/>
```

## Best Practices

### 1. Data Validation
- Always check for data existence
- Provide meaningful fallbacks
- Don't assume field presence

### 2. Performance
- Lazy load images
- Use proper image dimensions
- Minimize client-side processing

### 3. Accessibility
- Semantic HTML structure
- Proper ARIA labels
- Keyboard navigation support

### 4. Developer Experience
- Clear prop documentation
- Comprehensive TypeScript types
- Helpful error messages

## Quick Reference

### Component Checklist

Essential requirements for every component:

**Structure**
- [ ] Proper directory structure (`primitives/`, `compositions/`, or `patterns/`)
- [ ] Index file for exports
- [ ] TypeScript interfaces defined

**Implementation**
- [ ] Uses `React.forwardRef` for ref support
- [ ] Extends base HTML element props
- [ ] Supports `className` override via `cn()`
- [ ] Handles undefined/null props gracefully

**Documentation**
- [ ] Storybook story with all variants
- [ ] Interactive controls in Storybook
- [ ] JSDoc comments for complex props

**Quality**
- [ ] Semantic HTML and ARIA labels
- [ ] Works in dark and light modes
- [ ] Responsive across breakpoints
- [ ] No console errors or warnings

### File Naming Conventions

```
components/
├── primitives/
│   └── button/
│       ├── button.tsx          # Component implementation
│       ├── button.stories.tsx  # Storybook stories
│       ├── button.test.tsx     # Unit tests (optional)
│       └── index.ts           # Barrel export
├── compositions/
│   └── card/
│       └── ... (same structure)
└── patterns/
    └── loading-button/
        └── ... (same structure)
```

### Import/Export Patterns

```tsx
// Component file (button.tsx)
export interface ButtonProps {...}
export const Button = React.forwardRef<...>(...)

// Index file (index.ts)
export * from './button'

// Package export (src/index.ts)
export * from './components/primitives'
export * from './components/compositions'
export * from './components/patterns'
```

## Resources

### Documentation
- [Radix UI Primitives](https://www.radix-ui.com/primitives) - Accessibility-first components
- [Tailwind CSS](https://tailwindcss.com/docs) - Utility-first CSS
- [CVA Documentation](https://cva.style/docs) - Variant management
- [Storybook Docs](https://storybook.js.org/docs) - Component documentation

### Internal References
- [Component Examples](./src/components) - Browse existing components
- [Utility Functions](./src/lib/utils.ts) - Helper functions
- [Global Styles](./src/styles/globals.css) - Base styles

### Getting Help
- Check existing components for patterns
- Run `pnpm storybook` to explore interactively
- Follow the examples in this guide
- Keep components simple and composable