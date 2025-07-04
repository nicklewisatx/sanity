# Design System Documentation

**Last Updated by Claude:** 2025-07-04

## Overview

This design system provides a comprehensive set of components, tokens, and patterns for building consistent, accessible, and beautiful user interfaces. Built on industry best practices with a focus on scalability and developer experience.

## Core Principles

### 1. **8px Grid System**
All spacing is based on an 8px baseline grid for visual rhythm and consistency:
- Small gaps: 8px, 16px (1, 2)
- Medium gaps: 24px, 32px, 48px (3, 4, 6)
- Large gaps: 64px, 96px, 128px (8, 12, 16)

### 2. **Modular Type Scale**
Typography uses a 1.25 ratio for harmonious sizing:
- Base: 16px (1rem)
- Scale up: 20px, 25px, 31.25px, 39px, 48.8px, 61px
- Scale down: 14px, 12px

### 3. **Semantic Color System**
Colors have meaningful names and purposes:
- **Primary**: Brand color for main actions
- **Success/Error/Warning/Info**: Status communication
- **Gray scale**: 10 shades for UI elements

### 4. **Component Composition**
Build complex UIs from simple, reusable parts:
- Variants for different states and styles
- Composable sub-components
- Consistent prop interfaces

## Design Tokens

### Typography
```typescript
import { typography } from '@workspace/ui/lib/design-system';

// Font sizes
typography.scale.xs   // 12px
typography.scale.sm   // 14px
typography.scale.base // 16px
typography.scale.lg   // 20px
typography.scale.xl   // 25px
typography.scale['2xl'] // 31.25px
// ... up to 7xl

// Font weights
typography.weight.normal   // 400
typography.weight.medium   // 500
typography.weight.semibold // 600
typography.weight.bold     // 700
```

### Spacing
```typescript
import { spacing } from '@workspace/ui/lib/design-system';

spacing[0]    // 0px
spacing[0.5]  // 4px
spacing[1]    // 8px
spacing[2]    // 16px
spacing[3]    // 24px
spacing[4]    // 32px
// ... up to spacing[20] (160px)
```

### Colors
```typescript
import { colors } from '@workspace/ui/lib/design-system';

// Brand colors
colors.primary[50-900]

// Semantic colors
colors.success[50-900]
colors.error[50-900]
colors.warning[50-900]
colors.info[50-900]

// Neutral colors
colors.gray[50-900]
colors.white
colors.black
```

### Other Tokens
```typescript
import { elevation, radius, animation, breakpoints, zIndex } from '@workspace/ui/lib/design-system';

// Shadows
elevation.xs through elevation['2xl']

// Border radius
radius.none through radius.full

// Animation
animation.duration.fast // 150ms
animation.duration.base // 200ms
animation.duration.slow // 300ms
animation.easing.default // cubic-bezier(0.4, 0, 0.2, 1)

// Breakpoints
breakpoints.sm  // 640px
breakpoints.md  // 768px
breakpoints.lg  // 1024px
breakpoints.xl  // 1280px
breakpoints['2xl'] // 1536px

// Z-index layers
zIndex.base     // 0
zIndex.dropdown // 1000
zIndex.modal    // 1100
zIndex.tooltip  // 1200
```

## Component Library

### Typography Components

#### Heading
```tsx
import { Heading } from '@workspace/ui/components/typography-v2';

<Heading level={1}>Page Title</Heading>
<Heading level={2} color="primary">Section Title</Heading>
<Heading level={3} weight="normal" align="center">Subsection</Heading>
```

#### Text
```tsx
import { Text } from '@workspace/ui/components/typography-v2';

<Text>Body text</Text>
<Text size="lg" color="muted">Large muted text</Text>
<Text weight="semibold" lineHeight="relaxed">Emphasized text</Text>
```

#### Specialized Typography
```tsx
import { Label, Caption, Lead, Link, Code } from '@workspace/ui/components/typography-v2';

<Label htmlFor="input">Form Label</Label>
<Caption>Image caption or footnote</Caption>
<Lead>Introduction paragraph with larger text</Lead>
<Link href="#" external>External link</Link>
<Code>inline code</Code>
<Code block>{`
  // Code block
  const example = true;
`}</Code>
```

### Button Component

```tsx
import { ButtonV2 } from '@workspace/ui/components/button-v2';

// Variants
<ButtonV2 variant="primary">Primary Action</ButtonV2>
<ButtonV2 variant="secondary">Secondary</ButtonV2>
<ButtonV2 variant="outline">Outline</ButtonV2>
<ButtonV2 variant="ghost">Ghost</ButtonV2>
<ButtonV2 variant="destructive">Delete</ButtonV2>

// Sizes
<ButtonV2 size="sm">Small</ButtonV2>
<ButtonV2 size="md">Medium</ButtonV2>
<ButtonV2 size="lg">Large</ButtonV2>

// States
<ButtonV2 loading>Loading...</ButtonV2>
<ButtonV2 disabled>Disabled</ButtonV2>

// With icons
<ButtonV2 iconLeft={<Icon />}>With Icon</ButtonV2>
<ButtonV2 iconRight={<Icon />}>With Icon</ButtonV2>
```

### Card Component

```tsx
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter,
  CardGrid 
} from '@workspace/ui/components/card-v2';

// Basic card
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>Content</CardContent>
  <CardFooter>Footer</CardFooter>
</Card>

// Card variants
<Card variant="interactive">Clickable card</Card>
<Card variant="elevated">With shadow</Card>
<Card variant="ghost">Minimal style</Card>

// Card grid
<CardGrid cols={3} gap={6}>
  <Card>...</Card>
  <Card>...</Card>
  <Card>...</Card>
</CardGrid>
```

### Form Components

```tsx
import { 
  Input, 
  Textarea, 
  Select, 
  Checkbox, 
  Radio,
  FormField,
  FormGroup,
  FormSection
} from '@workspace/ui/components/input-v2';

// Form field with label and validation
<FormField label="Email" required error="Invalid email">
  <Input type="email" variant="error" />
</FormField>

// Form sections
<FormSection title="Personal Info" description="Your details">
  <FormGroup>
    <FormField label="Name">
      <Input />
    </FormField>
    <FormField label="Bio">
      <Textarea rows={4} />
    </FormField>
  </FormGroup>
</FormSection>

// Checkboxes and radios
<Checkbox label="Agree to terms" />
<Radio label="Option 1" name="group" />
```

## Usage Patterns

### Consistent Spacing

Always use spacing tokens instead of arbitrary values:

```tsx
// ✅ Good
<div className="p-4 mt-6 mb-8">
<div className="space-y-4">
<div className="gap-6">

// ❌ Bad
<div style={{ padding: '30px' }}>
<div className="mt-[37px]">
```

### Semantic Colors

Use semantic color tokens for meaning:

```tsx
// ✅ Good
<Text color="error">Error message</Text>
<Button variant="destructive">Delete</Button>

// ❌ Bad
<Text className="text-red-600">Error message</Text>
<Button className="bg-red-500">Delete</Button>
```

### Responsive Design

Use responsive utilities with breakpoints:

```tsx
// ✅ Good
<div className="p-4 md:p-6 lg:p-8">
<Heading level={2} className="text-2xl md:text-3xl lg:text-4xl">

// ❌ Bad
<div className="p-8"> // Not responsive
```

### Accessibility

Always include proper ARIA attributes and labels:

```tsx
// ✅ Good
<FormField label="Email" required>
  <Input type="email" aria-describedby="email-hint" />
  <span id="email-hint">We'll never share your email</span>
</FormField>

// ❌ Bad
<input type="email" placeholder="Email" />
```

## Best Practices

### 1. Component Composition
Build complex UIs by composing simple components:

```tsx
<Card variant="elevated">
  <CardHeader>
    <div className="flex items-center justify-between">
      <CardTitle>Dashboard</CardTitle>
      <ButtonV2 size="sm" variant="ghost">Settings</ButtonV2>
    </div>
  </CardHeader>
  <CardContent>
    <div className="grid grid-cols-3 gap-4">
      {/* Stats cards */}
    </div>
  </CardContent>
</Card>
```

### 2. Consistent Patterns
Use the same patterns throughout the application:

- Form validation: Always show errors below fields
- Loading states: Use skeleton screens or loading spinners consistently
- Empty states: Provide helpful messages and actions
- Error handling: Clear error messages with recovery actions

### 3. Performance
- Use CSS classes instead of inline styles
- Leverage Tailwind's purging for smaller bundles
- Lazy load heavy components
- Memoize expensive computations

### 4. Dark Mode
All components support dark mode automatically:

```tsx
// Components adapt automatically
<Card> // White in light, gray-800 in dark
<Text> // Gray-700 in light, gray-300 in dark
<Input> // Proper contrast in both modes
```

## Migration Guide

### From Old Components to V2

```tsx
// Old Button → ButtonV2
<Button variant="default">Click</Button>
<ButtonV2 variant="primary">Click</ButtonV2>

// Old Typography → Typography V2
<h1 className="text-4xl font-bold">Title</h1>
<Heading level={1}>Title</Heading>

// Old Card → Card V2
<div className="border rounded p-4">
  <h3 className="font-bold">Title</h3>
  <p>Content</p>
</div>
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>
    <Text>Content</Text>
  </CardContent>
</Card>
```

## Resources

- [Storybook](/packages/ui/.storybook): Interactive component playground
- [Design Tokens](/packages/ui/src/lib/design-system.ts): Token definitions
- [Components](/packages/ui/src/components/): Component source code

## Contributing

When adding new components:

1. Follow the established patterns
2. Include all necessary variants
3. Add comprehensive Storybook stories
4. Ensure dark mode support
5. Test accessibility
6. Document usage

## Future Enhancements

- [ ] Animation system components
- [ ] Data visualization components
- [ ] Advanced form components (date picker, file upload)
- [ ] Layout components (sidebar, header, footer)
- [ ] Notification system
- [ ] Modal and drawer components
- [ ] Table components with sorting/filtering