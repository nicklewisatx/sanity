# Context Findings

## Current Architecture Analysis

### 1. UI Package Structure
The UI package (`packages/ui`) is already well-structured with:

**Available Components:**
- **Layout Components**: Footer, Hero, Card (with sub-components)
- **Base Components**: Button, Input, Badge, Avatar, Accordion, Sheet, NavigationMenu, DropdownMenu
- **Utility Components**: InteractiveGridPattern
- **Missing Components Identified**: Header/Navigation layouts, Container/Grid layouts, Typography components

**Design System:**
- **Typography**: Using Tailwind Typography plugin with custom fonts (geist sans, mono)
- **Design Tokens**: Comprehensive color system with CSS variables, semantic naming, dark mode support
- **Spacing/Sizing**: Leverages Tailwind defaults with custom border radius tokens
- **Theming**: CSS variable-based theming system supporting light/dark modes

### 2. Sanity Page Builder Integration

The project already has a sophisticated page builder system:

**Architecture:**
- Modular block-based system defined in `/apps/studio/schemaTypes/definitions/pagebuilder.ts`
- Dynamic component rendering via `PageBuilder` component at `/apps/web/src/components/pagebuilder.tsx`
- Type-safe with generated types from Sanity schemas

**Current Blocks:**
- Hero, CTA, Feature Cards, FAQ Accordion, Image Link Cards, Newsletter Subscribe
- Each block has corresponding Sanity schema and React component
- Blocks support visual editing with proper data attributes

**Integration Pattern:**
```typescript
// Sanity Schema → GROQ Query → PageBuilder → Dynamic Component Rendering
```

### 3. Import Optimization Analysis

**Current Pattern (Already Optimized):**
- Direct path imports: `@workspace/ui/components/[component]`
- No barrel exports (good for tree shaking)
- Explicit package.json exports map
- ES modules throughout

**Why It's Already Optimal:**
- Avoids common tree-shaking pitfalls
- Enables precise bundle splitting
- Next.js can analyze exact dependencies
- No unnecessary code included in bundles

**Potential Enhancement:**
- Add `"sideEffects": ["./src/styles/globals.css"]` to UI package.json
- Consider component-level CSS for better style tree shaking

### 4. Specific Files Requiring Modification

**For Adding Missing Components:**
- `/packages/ui/src/components/` - Add new component files
- `/packages/ui/package.json` - Already has wildcard exports, no changes needed
- Create stories in same directory as components

**For Typography System:**
- `/packages/ui/src/components/typography.tsx` - New file for typography components
- `/packages/ui/src/lib/typography.ts` - Typography utilities and constants
- Update `/packages/ui/tailwind.config.ts` if new font families needed

**For Layout Components:**
- `/packages/ui/src/components/container.tsx` - Responsive container
- `/packages/ui/src/components/header.tsx` - Header/navigation component
- `/packages/ui/src/components/layout.tsx` - Layout wrapper components

**For Integration in apps/web:**
- Components can be imported immediately after creation
- No additional configuration needed due to existing workspace setup
- Storybook stories serve as documentation and testing

### 5. Patterns to Follow

**Component Creation Pattern:**
```typescript
// 1. Component file (e.g., typography.tsx)
import { forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@workspace/ui/lib/utils";

const typographyVariants = cva("base-classes", {
  variants: {
    variant: { h1: "...", h2: "...", body: "..." },
    size: { sm: "...", md: "...", lg: "..." }
  },
  defaultVariants: { variant: "body", size: "md" }
});

export interface TypographyProps extends 
  React.HTMLAttributes<HTMLElement>,
  VariantProps<typeof typographyVariants> {
  as?: React.ElementType;
}

export const Typography = forwardRef<HTMLElement, TypographyProps>(
  ({ className, variant, size, as: Component = "p", ...props }, ref) => {
    return (
      <Component
        ref={ref}
        className={cn(typographyVariants({ variant, size }), className)}
        {...props}
      />
    );
  }
);
Typography.displayName = "Typography";
```

**Story Creation Pattern:**
```typescript
// 2. Story file (e.g., typography.stories.tsx)
import type { Meta, StoryObj } from "@storybook/react";
import { Typography } from "./typography";

const meta = {
  title: "Components/Typography",
  component: Typography,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof Typography>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { children: "Typography text" }
};
```

### 6. Integration Points Identified

**Sanity Schema Integration:**
- New components can be added to page builder by creating schemas in `/apps/studio/schemaTypes/blocks/`
- Register in `/apps/studio/schemaTypes/blocks/index.ts`
- Add to pagebuilder definition

**Type Safety Maintained:**
- Component props match Sanity schema fields
- Use `PagebuilderType<"blockName">` for type safety
- Generated types provide full IDE support

**Visual Editing Support:**
- Components should include `data-sanity` attributes
- Use `useOptimistic` for real-time preview updates
- Follow existing section component patterns

### 7. Technical Constraints and Considerations

**Version Compatibility:**
- React 19.1.0 (uses new JSX transform)
- TypeScript 5.7.3 
- Tailwind CSS 3.4
- Must maintain compatibility across all packages

**Performance Considerations:**
- Keep components pure and memoizable
- Use forwardRef for all public components
- Avoid runtime CSS-in-JS for base components
- Leverage Tailwind's JIT compiler

**Accessibility Requirements:**
- Continue using Radix UI primitives where applicable
- Ensure ARIA attributes on custom components
- Maintain keyboard navigation support

### 8. Similar Features Analyzed

**Component Libraries in Monorepo:**
- Current pattern works well - no changes needed to structure
- Storybook serves as living documentation
- Components are discoverable through stories

**Page Builder Systems:**
- Existing system is robust and extensible
- New UI components can slot in seamlessly
- Pattern for adding new blocks is well-established