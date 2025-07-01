# UI Package - Shared Component Library

**Last Updated by Claude:** 2025-07-01

## Overview

This is the shared UI component library used across the monorepo. Built with React, Radix UI primitives, and Tailwind CSS, providing consistent, accessible components.

## Key Technologies

- **Components:** Radix UI primitives for accessibility
- **Styling:** Tailwind CSS with custom animations
- **Utilities:** clsx, tailwind-merge, class-variance-authority
- **Icons:** Lucide React icons
- **Typography:** Tailwind Typography plugin

## Package Structure

```
packages/ui/
├── src/
│   ├── components/      # Reusable UI components
│   ├── hooks/          # Custom React hooks
│   ├── lib/            # Utilities (cn, etc.)
│   └── styles/         # Global styles
├── tailwind.config.ts  # Shared Tailwind config
└── postcss.config.mjs  # PostCSS configuration
```

## Exports

The package provides specific exports:
- `./globals.css` - Global styles
- `./postcss.config` - PostCSS config
- `./tailwind.config` - Tailwind config
- `./lib/*` - Utility functions
- `./components/*` - UI components
- `./hooks/*` - React hooks

## Component Library

Built on Radix UI primitives:
- **Accordion:** Collapsible content sections
- **Avatar:** User profile images
- **Dialog:** Modal dialogs
- **DropdownMenu:** Context menus
- **NavigationMenu:** Site navigation

## Key Utilities

### cn() Function
Combines clsx and tailwind-merge for optimal class handling:
```typescript
import { cn } from "@workspace/ui/lib/utils"
cn("px-4 py-2", conditional && "bg-blue-500")
```

## Development Patterns

1. **Component Variants:** Use CVA for variant management
2. **Accessibility First:** Built on Radix UI
3. **Composition:** Prefer composition over inheritance
4. **Type Safety:** Full TypeScript support
5. **Tree Shaking:** Individual component exports

## Usage in Apps

```typescript
// Import component
import { Button } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"

// Import global styles (in root layout)
import "@workspace/ui/globals.css"
```

## Testing

```bash
# Run tests
pnpm test
pnpm test:watch

# Type checking
pnpm check-types

# Linting
pnpm lint
```

## Adding New Components

1. Create component in `src/components/`
2. Follow existing patterns (forwardRef, variants)
3. Export from package.json exports field
4. Add tests if complex logic
5. Document props and usage

## Styling Guidelines

- Use Tailwind classes primarily
- Keep component styles minimal
- Allow className override
- Use CSS variables for theming
- Maintain dark mode support

## Dependencies

Key dependencies to be aware of:
- **@radix-ui/*:** Headless UI primitives
- **class-variance-authority:** Variant API
- **tailwindcss-animate:** Animation utilities

## Notes for AI Assistants

- Check this package first before creating new components
- Follow existing component patterns
- Maintain accessibility standards from Radix
- Keep components generic and reusable
- Don't add app-specific logic here
- Test across both apps when modifying

## Common Tasks

1. **Add Radix component:** Install @radix-ui/react-[name]
2. **Create wrapper:** Add styled wrapper in components/
3. **Export it:** Add to package.json exports
4. **Document:** Add JSDoc comments
5. **Test:** Ensure it works in both apps

## Maintenance Notes

**IMPORTANT:** Update this file when:
- New components are added
- Export patterns change
- Major dependency updates
- New utilities or hooks added