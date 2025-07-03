# Requirements Specification: Storybook Components Integration

## Problem Statement

The web application needs to utilize more components from the UI library, specifically layout components, typography system, and design tokens. These components exist in Storybook but aren't fully integrated into the apps/web application. Additionally, all new components should be compatible with the Sanity page builder system.

## Solution Overview

Extend the existing UI component library with missing foundational components (Typography, Container, Layout components, and design tokens) while maintaining the current optimized import patterns. All components will have Storybook stories for documentation and will be integrated with the Sanity page builder where appropriate.

## Functional Requirements

### 1. Typography Component System
- Create a Typography component supporting h1-h6 and body variants
- Match the heading hierarchy used in RichText (h2-h6 for content, h1 reserved for page titles)
- Support size, weight, and color variants
- Include proper semantic HTML element rendering
- Full TypeScript support with proper props interface

### 2. Layout Components
- **Container Component**:
  - Default max-width of 1216px (matching existing patterns)
  - Full-width variant for hero sections
  - Responsive padding adjustments
  - Support for all existing breakpoints
  
- **Layout/Wrapper Components**:
  - Section wrapper with consistent spacing
  - Grid and flex layout helpers
  - Responsive utilities

### 3. Design Tokens Export
- Create exportable TypeScript constants in `@workspace/ui/lib/tokens`
- Include color palette, spacing scale, breakpoints, and typography scales
- Ensure tokens match CSS variables for consistency
- Type-safe access to all design system values

### 4. Sanity Page Builder Integration
- Create Sanity block schemas for appropriate components
- Ensure visual editing support with data-sanity attributes
- Maintain type safety between Sanity schemas and React components
- Follow existing block registration patterns

## Technical Requirements

### File Structure
```
packages/ui/
├── src/
│   ├── components/
│   │   ├── typography.tsx           # Typography component
│   │   ├── typography.stories.tsx   # Typography stories
│   │   ├── container.tsx           # Container component
│   │   ├── container.stories.tsx   # Container stories
│   │   ├── layout.tsx              # Layout wrapper components
│   │   └── layout.stories.tsx      # Layout stories
│   └── lib/
│       ├── tokens.ts               # Design tokens export
│       └── utils.ts                # Existing utilities
```

### Import Pattern
Maintain the current optimized pattern:
```typescript
import { Typography } from "@workspace/ui/components/typography";
import { Container } from "@workspace/ui/components/container";
import { tokens } from "@workspace/ui/lib/tokens";
```

### Component Implementation Pattern
All components must follow the established pattern:
- Use `forwardRef` for ref forwarding
- Implement with `class-variance-authority` for variants
- Accept `className` prop with `cn()` utility
- Include proper TypeScript types
- Add displayName for debugging

### Responsive Breakpoints
Align with Sanity preview breakpoints:
- Mobile: 420px
- Tablet: 768px  
- Desktop: 1024px+ (full width)

### Sanity Integration Pattern
For page builder blocks:
1. Create schema in `/apps/studio/schemaTypes/blocks/[component].ts`
2. Register in `/apps/studio/schemaTypes/blocks/index.ts`
3. Add to pagebuilder type definition
4. Create corresponding section component in `/apps/web/src/components/sections/`
5. Register in PageBuilder component mapping

## Implementation Hints

### Typography Component Example Structure
```typescript
const typographyVariants = cva("base", {
  variants: {
    variant: {
      h1: "text-4xl font-bold",
      h2: "text-3xl font-semibold",
      // ... other variants
      body: "text-base",
    },
    color: {
      default: "text-foreground",
      muted: "text-muted-foreground",
      // ... other colors
    }
  },
  defaultVariants: {
    variant: "body",
    color: "default"
  }
});
```

### Design Tokens Structure
```typescript
export const tokens = {
  colors: {
    // Extract from CSS variables
    background: "hsl(var(--background))",
    foreground: "hsl(var(--foreground))",
    // ... rest
  },
  spacing: {
    // Tailwind spacing scale
  },
  breakpoints: {
    mobile: "420px",
    tablet: "768px",
    desktop: "1024px",
  },
  typography: {
    // Font families, sizes, weights
  }
} as const;
```

### Container Component Variants
```typescript
const containerVariants = cva("mx-auto px-4 sm:px-6 lg:px-8", {
  variants: {
    size: {
      default: "max-w-[1216px]",
      full: "max-w-none",
      narrow: "max-w-4xl",
    }
  },
  defaultVariants: {
    size: "default"
  }
});
```

## Acceptance Criteria

1. **Typography Component**
   - ✓ Renders all heading levels and body text
   - ✓ Supports variant and color props
   - ✓ Has comprehensive Storybook stories
   - ✓ Exports TypeScript types

2. **Container Component**
   - ✓ Default and full-width variants work correctly
   - ✓ Responsive padding at all breakpoints
   - ✓ Matches existing max-width patterns
   - ✓ Documented in Storybook

3. **Design Tokens**
   - ✓ All tokens exportable as TypeScript constants
   - ✓ Type-safe access in both runtime and stories
   - ✓ Matches CSS variable values
   - ✓ Documented usage patterns

4. **Sanity Integration**
   - ✓ New components work in page builder
   - ✓ Visual editing supported
   - ✓ Type safety maintained
   - ✓ Preview works at all breakpoints

5. **Import Optimization**
   - ✓ Tree shaking continues to work
   - ✓ No increase in bundle size for unused components
   - ✓ Direct import paths maintained
   - ✓ No circular dependencies

## Assumptions

1. **Existing Patterns**: All new components follow established patterns in the codebase
2. **No Breaking Changes**: Existing component imports and usage remain unchanged
3. **Design System Alignment**: New tokens align with current CSS variable system
4. **Page Builder Optional**: Not all UI components need page builder integration, only content-appropriate ones
5. **Performance**: Components remain lightweight and tree-shakeable

## Out of Scope

- Migrating existing components to new patterns
- Creating custom Tailwind plugins
- Modifying the build or bundling configuration
- Creating a separate documentation site
- Implementing CSS-in-JS solutions

## Next Steps

After requirements approval:
1. Create Typography component with stories
2. Create Container and Layout components with stories  
3. Export design tokens with TypeScript types
4. Create Sanity schemas for content-appropriate components
5. Test integration in apps/web with existing pages
6. Update documentation