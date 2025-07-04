# Web App - Next.js Frontend

**Last Updated by Claude:** 2025-07-03 - Added Typography and Layout block components with visual editing support

## Overview

This is the main Next.js 15 web application with App Router, TypeScript, and Tailwind CSS. It consumes content from Sanity Studio and includes OpenTelemetry observability.

## Key Technologies

- **Framework:** Next.js 15.3.4 with App Router and Turbopack
- **Language:** TypeScript 5.7.3
- **Styling:** Tailwind CSS 3.4
- **CMS:** Sanity Client 7.6.0 with Visual Editing
- **UI:** Custom components + Lucide icons
- **Testing:** Vitest with React Testing Library
- **Observability:** OpenTelemetry integration via workspace package

## Project Structure

```
apps/web/
├── src/
│   ├── app/              # App Router pages and API routes
│   │   ├── [slug]/       # Dynamic page routing
│   │   ├── blog/         # Blog section with [slug]
│   │   └── api/          # API endpoints
│   ├── components/       # React components
│   ├── lib/              # Utilities and configurations
│   └── styles/           # Global styles
├── instrumentation.ts    # OpenTelemetry setup
└── next.config.ts        # Next.js configuration
```

## Key Features

1. **Dynamic Routing:** Catch-all route `[...slug]` for flexible page structure
2. **Blog System:** Dedicated blog routes with individual post pages
3. **Sanity Integration:** Real-time content from Sanity with visual editing support
4. **API Routes:** Custom endpoints for draft mode, telemetry testing
5. **SEO:** Dynamic sitemap and robots.txt generation
6. **Dark Mode:** Theme support via next-themes
7. **Visual Editing:** Edit-in-place functionality with @sanity/visual-editing
8. **Component Library:** Integrated Storybook components from @workspace/ui

## Important Patterns

### Data Fetching

- Server Components by default
- `server-only` imports for server-side code
- Sanity client with proper caching strategies

### Styling

- Tailwind CSS with custom configuration
- Component-based styling approach
- Dark mode support built-in

### Testing

- Vitest for unit tests
- React Testing Library for component tests
- Test files colocated with components

## Development Commands

```bash
# Start dev server with Turbopack
pnpm dev

# Type checking
pnpm check-types

# Run tests
pnpm test
pnpm test:watch

# Linting & formatting
pnpm lint
pnpm format
```

## Environment Variables

Required in `.env.local`:

```
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_READ_TOKEN=your-token
```

## Dependencies to Note

- **@sanity/client:** Main Sanity client
- **@sanity/visual-editing:** Visual editing capabilities
- **next-sanity:** Next.js specific Sanity utilities
- **@workspace/ui:** Shared UI components
- **@workspace/observability:** Telemetry setup
- **babel-plugin-react-compiler:** React optimization

## Common Tasks

1. **Add new page:** Create file in `app/[path]/page.tsx`
2. **Add API route:** Create file in `app/api/[endpoint]/route.ts`
3. **Update components:** Check `@workspace/ui` first for shared components
4. **Add telemetry:** Use patterns from `instrumentation.ts`

## Notes for AI Assistants

- Always check `@workspace/ui` before creating new components
- Follow existing patterns for Sanity data fetching
- Maintain type safety - run `pnpm check-types` before commits
- Use Server Components by default, Client Components only when needed
- Respect the monorepo structure - shared code goes in packages/

## Maintenance Notes

**IMPORTANT:** Update this file when:

- Major dependencies change
- New patterns are established
- Project structure changes significantly
- New features require different approaches
