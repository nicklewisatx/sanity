# Sanity + Next.js Monorepo Structure

This document provides the complete technology stack and file tree structure for the Sanity + Next.js monorepo project. **AI agents MUST read this file to understand the project organization before making any changes.**

**Last Updated by Claude:** 2025-07-03 - Complete project structure documentation

## Technology Stack

### Core Infrastructure

- **Node.js 20+** with **pnpm 10.12.2** - Runtime and monorepo package management
- **TurboRepo 2.5.4** - Build system orchestration and caching
- **TypeScript 5.7.3** - Type safety across all packages with strict mode

### Frontend Technologies

- **Next.js 15.3.4** - React framework with App Router
- **React 19.1.0** - UI library with React Compiler support
- **Tailwind CSS 3.4.17** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **class-variance-authority** - Component variant management
- **Storybook 8.6.14** - Component development environment

### Backend/CMS Technologies

- **Sanity Studio 3.93.0** - Headless CMS with visual editing
- **@sanity/client 7.6.0** - JavaScript client for Sanity
- **next-sanity 9.12.0** - Next.js integration for Sanity
- **GROQ** - Graph-Relational Object Queries for Sanity

### Testing & Quality

- **Vitest 3.2.4** - Unit testing framework
- **Playwright 1.48.0** - E2E testing framework
- **ESLint 9.29.0** - JavaScript/TypeScript linting
- **Prettier 3.6.2** - Code formatting
- **Custom Claude Hooks** - AI-assisted code quality

### Observability & Monitoring

- **OpenTelemetry** - Distributed tracing
- **@vercel/otel 1.8.0** - Vercel OpenTelemetry integration
- **Axiom** - Observability platform integration
- **Winston** - Structured logging

### Development Tools

- **Process Manager** - Custom Node.js service orchestration
- **Vite 6.0.7** - Fast development server (for Storybook)
- **tsup 8.2.3** - TypeScript library bundler

## Complete Project Structure

```
sanity/
├── README.md                           # Project overview and setup
├── CLAUDE.md                           # Master AI context file (Tier 1)
├── package.json                        # Root package configuration
├── pnpm-lock.yaml                      # Lock file (CRITICAL for CI/CD)
├── pnpm-workspace.yaml                 # Workspace configuration
├── turbo.json                          # TurboRepo pipeline configuration
├── tsconfig.json                       # Root TypeScript configuration
├── vitest.workspace.ts                 # Vitest workspace configuration
├── eslint.config.js                    # Root ESLint configuration
├── .gitignore                          # Git ignore patterns
├── DEPLOYMENT_GUIDE.md                 # Production deployment guide
├── CONTRIBUTING.md                     # Contribution guidelines
├── SECURITY.md                         # Security policies
├── LICENSE                             # Project license
├── CODE_OF_CONDUCT.md                  # Community standards
├── apps/                               # Application packages
│   ├── web/                            # Next.js frontend application
│   │   ├── CLAUDE.md                   # Web app AI context (Tier 2)
│   │   ├── package.json                # Web app dependencies
│   │   ├── next.config.ts              # Next.js configuration
│   │   ├── tailwind.config.ts          # Tailwind configuration
│   │   ├── postcss.config.mjs          # PostCSS configuration
│   │   ├── tsconfig.json               # TypeScript configuration
│   │   ├── vitest.config.ts            # Vitest configuration
│   │   ├── components.json             # shadcn/ui configuration
│   │   ├── instrumentation.ts          # OpenTelemetry setup
│   │   ├── src/                        # Source code
│   │   │   ├── app/                    # App Router pages
│   │   │   │   ├── layout.tsx          # Root layout
│   │   │   │   ├── page.tsx            # Home page
│   │   │   │   ├── [...slug]/          # Dynamic catch-all route
│   │   │   │   ├── blog/               # Blog section
│   │   │   │   ├── api/                # API routes
│   │   │   │   │   ├── og/             # OG image generation
│   │   │   │   │   ├── disable-draft/  # Draft mode control
│   │   │   │   │   ├── presentation-draft/
│   │   │   │   │   └── axiom-*/        # Axiom integration
│   │   │   │   ├── not-found.tsx       # 404 page
│   │   │   │   ├── robots.ts           # SEO robots.txt
│   │   │   │   └── sitemap.ts          # SEO sitemap
│   │   │   ├── components/             # React components
│   │   │   │   ├── blocks/             # Content blocks
│   │   │   │   ├── sections/           # Page sections
│   │   │   │   └── *.tsx               # Shared components
│   │   │   ├── lib/                    # Library code
│   │   │   │   └── sanity/             # Sanity integration
│   │   │   │       ├── client.ts       # Sanity client setup
│   │   │   │       ├── fetch-with-tracing.ts
│   │   │   │       ├── query.ts        # GROQ queries
│   │   │   │       └── sanity.types.ts # Generated types
│   │   │   ├── hooks/                  # Custom React hooks
│   │   │   ├── action/                 # Server actions
│   │   │   ├── config.ts               # App configuration
│   │   │   ├── types.ts                # TypeScript types
│   │   │   └── utils.ts                # Utility functions
│   │   └── .env.local.example          # Environment template
│   └── studio/                         # Sanity Studio CMS
│       ├── CLAUDE.md                   # Studio AI context (Tier 2)
│       ├── package.json                # Studio dependencies
│       ├── sanity.config.ts            # Studio configuration
│       ├── sanity.cli.ts               # CLI configuration
│       ├── tsconfig.json               # TypeScript configuration
│       ├── sanity-typegen.json         # Type generation config
│       ├── structure.ts                # Document structure
│       ├── schemaTypes/                # Content schemas
│       │   ├── index.ts                # Schema exports
│       │   ├── documents/              # Document types
│       │   │   ├── CLAUDE.md           # Schema patterns (Tier 3)
│       │   │   ├── blog.ts             # Blog post schema
│       │   │   ├── page.ts             # Page schema
│       │   │   └── *.ts                # Other documents
│       │   ├── blocks/                 # Content blocks
│       │   │   ├── hero.ts             # Hero block
│       │   │   ├── cta.ts              # CTA block
│       │   │   └── *.ts                # Other blocks
│       │   └── definitions/            # Shared definitions
│       ├── components/                 # Studio components
│       ├── plugins/                    # Studio plugins
│       ├── scripts/                    # Data scripts
│       └── utils/                      # Studio utilities
├── packages/                           # Shared packages
│   ├── ui/                             # Component library
│   │   ├── CLAUDE.md                   # UI library context (Tier 2)
│   │   ├── package.json                # Package configuration
│   │   ├── tsconfig.json               # TypeScript config
│   │   ├── tailwind.config.ts          # Tailwind config
│   │   ├── components.json             # Component metadata
│   │   ├── .storybook/                 # Storybook configuration
│   │   ├── src/                        # Source code
│   │   │   ├── components/             # UI components
│   │   │   │   ├── CLAUDE.md           # Component patterns (Tier 3)
│   │   │   │   ├── *.tsx               # Component files
│   │   │   │   └── *.stories.tsx      # Storybook stories
│   │   │   ├── hooks/                  # Shared hooks
│   │   │   ├── lib/                    # Utilities
│   │   │   └── styles/                 # Global styles
│   │   └── STYLEGUIDE.md               # Component guidelines
│   ├── observability/                  # OpenTelemetry integration
│   │   ├── CLAUDE.md                   # Observability context (Tier 2)
│   │   ├── package.json                # Package configuration
│   │   ├── src/                        # Source code
│   │   │   ├── index.ts                # Main exports
│   │   │   ├── config.ts               # Configuration
│   │   │   └── utils/                  # Utility functions
│   │   └── dist/                       # Built output
│   ├── e2e/                            # E2E test suite
│   │   ├── CLAUDE.md                   # E2E context (Tier 2)
│   │   ├── playwright.config.ts        # Playwright config
│   │   ├── tests/                      # Test files
│   │   │   ├── smoke.spec.ts           # Smoke tests
│   │   │   └── critical-paths.spec.ts  # Critical path tests
│   │   └── helpers/                    # Test helpers
│   ├── test-utils/                     # Testing utilities
│   │   ├── package.json                # Package configuration
│   │   └── src/                        # Test utilities
│   ├── eslint-config/                  # Shared ESLint config
│   │   ├── CLAUDE.md                   # ESLint context (Tier 2)
│   │   ├── base.js                     # Base configuration
│   │   ├── next.js                     # Next.js rules
│   │   └── sanity.js                   # Sanity rules
│   └── typescript-config/              # Shared TypeScript config
│       ├── CLAUDE.md                   # TypeScript context (Tier 2)
│       ├── base.json                   # Base configuration
│       ├── nextjs.json                 # Next.js config
│       └── react-library.json          # React library config
├── docs/                               # Project documentation
│   ├── frontend.md                     # Frontend development guide
│   ├── sanity-backend.md               # Sanity development guide
│   ├── stack.md                        # Technology stack details
│   ├── local-development.md            # Local dev environment
│   ├── performance.md                  # Performance guide
│   ├── observability.md                # Observability guide
│   ├── troubleshooting.md              # Troubleshooting guide
│   ├── process-management.md           # Process manager docs
│   ├── claude-hooks.md                 # Claude integration
│   └── github-secrets.md               # GitHub configuration
├── scripts/                            # Automation scripts
│   ├── process-manager/                # Dev server orchestration
│   │   ├── ProcessManager.js           # Main process manager
│   │   ├── config.js                   # Configuration
│   │   ├── services/                   # Service definitions
│   │   └── utils/                      # Utility functions
│   ├── claude-hooks/                   # AI assistant hooks
│   │   ├── pre-edit-check.sh           # Pre-edit validation
│   │   └── post-edit-log.sh            # Post-edit logging
│   └── start-dev.sh                    # Development startup
├── .claude/                            # Claude configuration
│   ├── config.json                     # Claude settings
│   ├── commands/                       # Custom commands
│   │   ├── README.md                   # Command documentation
│   │   ├── create-docs.md              # Documentation generation
│   │   ├── code-review.md              # Code review command
│   │   └── *.md                        # Other commands
│   └── docs/                           # AI-specific docs
│       └── ai-context/                 # AI context files
│           ├── project-structure.md    # This file
│           ├── docs-overview.md        # Documentation map
│           └── *.md                    # Other context files
├── requirements/                       # Feature specifications
│   └── [timestamp]-[feature]/          # Feature folders
│       ├── metadata.json               # Feature metadata
│       └── *.md                        # Requirement docs
├── issues/                             # Issue tracking
│   └── *.md                            # Issue documentation
└── tests/                              # Root-level test files
    ├── test_hooks_integration.py       # Hook integration tests
    └── fixtures/                       # Test fixtures
```

## Key Architecture Decisions

1. **Monorepo Structure**: Uses pnpm workspaces with TurboRepo for efficient builds
2. **Component Sharing**: UI components in dedicated package for reuse
3. **Type Safety**: End-to-end TypeScript with generated Sanity types
4. **Server Components**: Default to RSC in Next.js 15 for performance
5. **Observability**: Built-in OpenTelemetry support for production monitoring
6. **Testing Strategy**: Unit tests with Vitest, E2E with Playwright
7. **Documentation Tiers**: Three-tier documentation system for different abstraction levels

## Development Patterns

- **File Naming**: kebab-case for files, PascalCase for components
- **Import Aliases**: Use `@workspace/*` for cross-package imports
- **Environment Variables**: Managed via `.env.local` files
- **Build Pipeline**: Topological ordering ensures correct build sequence
- **Hot Reload**: Enabled across all services in development

---

_This document provides the authoritative reference for project structure. Update it when making architectural changes or adding new packages._
