# Project Stack & Architecture

This project is a modern monorepo built with cutting-edge technologies for optimal developer experience and performance.

## Tech Stack Overview

### Core Technologies

- **Monorepo Management**: TurboRepo
- **Package Manager**: pnpm
- **TypeScript**: Full type safety across the stack

### Applications

- **Web App**: Next.js 15 with App Router
- **CMS**: Sanity Studio v3
- **Shared Packages**: UI components and configurations

### Development Tools

- **Logging**: Winston-based centralized logger
- **UI Components**: Shared component library in `packages/ui`
- **Linting**: ESLint with shared configuration
- **Formatting**: Prettier with consistent code style

## Project Structure

```
/
├── apps/
│   ├── web/          # Next.js 15 app with App Router
│   └── studio/       # Sanity Studio v3
├── packages/         # Shared packages
│   ├── ui/          # Shared UI components
│   ├── logger/      # Winston logger package
│   └── configs/     # Shared configurations
├── docs/            # Project documentation
├── scripts/         # Build and utility scripts
├── turbo.json       # TurboRepo configuration
├── pnpm-workspace.yaml
└── CLAUDE.md        # AI assistant instructions
```

## Architecture Principles

1. **Monorepo First**: Shared code and consistent tooling across all apps
2. **Type Safety**: TypeScript everywhere with generated types from Sanity
3. **Server Components**: Next.js App Router with RSC by default
4. **Real-time Preview**: Live editing experience with Sanity Studio
5. **Performance**: Optimized builds with TurboRepo caching

## Key Dependencies

### Frontend (Next.js)

- Next.js 15 with App Router
- React Server Components
- Tailwind CSS for styling
- Radix UI for accessible components
- next-sanity for CMS integration

### Backend (Sanity)

- Sanity Studio v3
- GROQ query language
- Real-time collaboration
- Structured content modeling
- Asset pipeline with automatic optimization

### Shared Packages

- `@workspace/ui`: Shared React components
- `@workspace/logger`: Centralized logging with Winston
- `@workspace/configs`: Shared ESLint, TypeScript, and other configs
