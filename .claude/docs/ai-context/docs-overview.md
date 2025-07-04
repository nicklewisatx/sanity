# Documentation Architecture

This project uses a **3-tier documentation system** that organizes knowledge by stability and scope, enabling efficient AI context loading and scalable development.

**Last Updated by Claude:** 2025-07-03 - Complete documentation mapping for Sanity + Next.js monorepo

## How the 3-Tier System Works

**Tier 1 (Foundation)**: Stable, system-wide documentation that rarely changes - architectural principles, technology decisions, cross-component patterns, and core development protocols.

**Tier 2 (Component)**: Architectural charters for major components - high-level design principles, integration patterns, and component-wide conventions without feature-specific details.

**Tier 3 (Feature-Specific)**: Granular documentation co-located with code - specific implementation patterns, technical details, and local architectural decisions that evolve with features.

This hierarchy allows AI agents to load targeted context efficiently while maintaining a stable foundation of core knowledge.

## Documentation Principles

- **Co-location**: Documentation lives near relevant code
- **Smart Extension**: New documentation files created automatically when warranted
- **AI-First**: Optimized for efficient AI context loading and machine-readable patterns
- **Living Documents**: Include "Last Updated by Claude" timestamps for tracking

## Tier 1: Foundational Documentation (System-Wide)

- **[Master Context](/CLAUDE.md)** - _Essential for every session._ Monorepo overview, technology stack, development workflow, and AI assistant guidance
- **[Project Structure](/Users/nicholaslewis/projects/sanity/.claude/docs/ai-context/project-structure.md)** - _REQUIRED reading._ Complete technology stack, file tree, and system architecture
- **[Deployment Guide](/DEPLOYMENT_GUIDE.md)** - _Production deployment._ Deployment strategies, environment configuration, and release processes
- **[Security Policy](/SECURITY.md)** - _Security guidelines._ Security practices, vulnerability reporting, and compliance requirements
- **[Contributing Guide](/CONTRIBUTING.md)** - _Contribution standards._ Code standards, PR process, and community guidelines

### Development Guides

- **[Stack Overview](/docs/stack.md)** - _Technology decisions._ Detailed technology choices and architectural rationale
- **[Local Development](/docs/local-development.md)** - _Dev environment._ Setup instructions, environment variables, and development workflow
- **[Frontend Guide](/docs/frontend.md)** - _Next.js patterns._ React Server Components, data fetching, and UI patterns
- **[Sanity Backend](/docs/sanity-backend.md)** - _CMS development._ Schema design, GROQ queries, and Studio customization
- **[Performance Guide](/docs/performance.md)** - _Optimization strategies._ Caching, code splitting, and performance monitoring
- **[Observability Guide](/docs/observability.md)** - _Monitoring setup._ OpenTelemetry integration and tracing patterns
- **[Process Management](/docs/process-management.md)** - _Service orchestration._ Dev server management and coordination
- **[Claude Hooks Guide](/docs/claude-hooks.md)** - _AI integration._ Pre-edit hooks and AI assistant optimization

## Tier 2: Component-Level Documentation

### Application Components

- **[Web Application](/apps/web/CLAUDE.md)** - _Next.js frontend._ App Router patterns, RSC implementation, API routes, and Sanity integration
- **[Sanity Studio](/apps/studio/CLAUDE.md)** - _CMS interface._ Schema architecture, plugin system, and content modeling patterns

### Shared Libraries

- **[UI Component Library](/packages/ui/CLAUDE.md)** - _Shared components._ Radix UI integration, Storybook development, and design system
- **[Observability Package](/packages/observability/CLAUDE.md)** - _Telemetry integration._ OpenTelemetry setup, tracing utilities, and monitoring patterns
- **[E2E Test Suite](/packages/e2e/CLAUDE.md)** - _End-to-end testing._ Playwright configuration, test patterns, and CI integration
- **[Test Utilities](/packages/test-utils/CLAUDE.md)** - _Testing helpers._ Shared test utilities, mocks, and CI parity testing
- **[ESLint Config](/packages/eslint-config/CLAUDE.md)** - _Linting rules._ Shared ESLint configurations for consistency
- **[TypeScript Config](/packages/typescript-config/CLAUDE.md)** - _Type configuration._ Shared TypeScript settings and conventions

### Infrastructure Components

- **[Claude Commands](/.claude/commands/README.md)** - _AI automation._ Custom Claude commands for development tasks
- **[Process Manager](/scripts/process-manager/)** - _Service coordination._ Multi-service development orchestration

## Tier 3: Feature-Specific Documentation

Granular CLAUDE.md files co-located with code for minimal cascade effects:

### Web Application Features

- **[API Routes](/apps/web/src/app/api/)** - _API implementation._ Route handlers, middleware, and API patterns
- **[Component Sections](/apps/web/src/components/sections/)** - _Page sections._ Hero, CTA, feature cards, and layout components
- **[Sanity Integration](/apps/web/src/lib/sanity/)** - _CMS client._ Query patterns, type safety, and data fetching

### Studio Schema Documentation

- **[Document Schemas](/apps/studio/schemaTypes/documents/CLAUDE.md)** - _Content types._ Blog, page, author, and settings schemas
- **[Block Schemas](/apps/studio/schemaTypes/blocks/)** - _Content blocks._ Reusable content patterns and page builder blocks
- **[Schema Definitions](/apps/studio/schemaTypes/definitions/)** - _Shared definitions._ Common fields, validation, and type utilities

### UI Component Documentation

- **[Component Library](/packages/ui/src/components/CLAUDE.md)** - _Component patterns._ Implementation guidelines, variants, and accessibility
- **[Storybook Stories](/packages/ui/src/components/)** - _Component demos._ Interactive documentation and usage examples
- **[Style Guide](/packages/ui/STYLEGUIDE.md)** - _Design standards._ Component conventions and styling patterns

### Testing Documentation

- **[E2E Test Patterns](/packages/e2e/tests/)** - _Test strategies._ Critical paths, smoke tests, and test helpers
- **[Unit Test Patterns](/apps/web/src/)** - _Testing approach._ Component testing, API testing, and mocking strategies

## Adding New Documentation

### New Package or App

1. Create `/[package-name]/CLAUDE.md` (Tier 2)
2. Add entry to this file under appropriate section
3. Update root CLAUDE.md to reference new package
4. Create feature-specific Tier 3 docs as features develop

### New Feature Area

1. Create `/[component]/src/[feature]/CLAUDE.md` (Tier 3)
2. Reference parent component patterns
3. Add entry to this file under component's features
4. Include "Last Updated by Claude" timestamp

### Documentation Updates

1. Update relevant CLAUDE.md file
2. Add "Last Updated by Claude" timestamp
3. Update this mapping if structure changes
4. Check for broken cross-references

### Deprecating Documentation

1. Remove obsolete CLAUDE.md files
2. Update this mapping document
3. Check for broken references in other docs
4. Update root CLAUDE.md if needed

## Documentation Health Checklist

- [ ] All packages have Tier 2 CLAUDE.md files
- [ ] Complex features have Tier 3 documentation
- [ ] Cross-references are valid and up-to-date
- [ ] "Last Updated by Claude" timestamps are current
- [ ] No duplicate information across tiers
- [ ] Clear hierarchy from general to specific

---

_This documentation map is the authoritative reference for finding project documentation. Update it when adding new documentation files or restructuring existing ones._
