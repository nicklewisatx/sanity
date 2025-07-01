# Sanity Studio - Content Management System

**Last Updated by Claude:** 2025-07-01

## Overview

This is the Sanity Studio v3 application that provides the content management interface. It includes custom schemas, plugins, and tools for managing website content.

## Key Technologies

- **CMS:** Sanity Studio 3.93.0
- **Language:** TypeScript
- **UI Framework:** React 19.1.0 with Sanity UI
- **Plugins:** Vision, Assist, Media, Icon Picker, Unsplash
- **Testing:** Vitest with schema validation

## Project Structure

```
apps/studio/
├── plugins/              # Custom Studio plugins
│   └── presentation-url.ts
├── schemaTypes/         # Content schemas
│   ├── blocks/          # Page building blocks
│   ├── documents/       # Document types
│   ├── objects/         # Reusable object types
│   └── singletons/      # Single instance documents
├── scripts/             # Build and data scripts
├── structure.ts         # Studio structure configuration
└── sanity.config.ts     # Main configuration
```

## Schema Organization

### Documents

- **Pages:** Dynamic page content
- **Posts:** Blog post documents
- **Categories:** Content categorization
- **Authors:** Content author profiles

### Blocks (Page Builder Components)

- `hero` - Hero sections
- `cta` - Call-to-action blocks
- `faq-accordion` - FAQ sections
- `feature-cards-icon` - Feature showcases
- `image-link-cards` - Visual link cards
- `subscribe-newsletter` - Newsletter forms

### Singletons

- **Settings:** Global site configuration
- **Navigation:** Menu structures
- **Footer:** Footer content

## Key Features

1. **Orderable Documents:** Drag-and-drop document ordering
2. **AI Assist:** Content generation assistance
3. **Media Management:** Advanced asset handling
4. **Icon Picker:** Visual icon selection
5. **Unsplash Integration:** Stock photo access
6. **Visual Editing:** Real-time preview with frontend

## Development Commands

```bash
# Start Studio development server
pnpm dev

# Generate TypeScript types from schemas
pnpm type

# Validate schemas
pnpm schema:validate

# Deploy Studio
pnpm deploy:studio

# Run tests
pnpm test
```

## Important Patterns

### Schema Best Practices

- Use `defineType` and `defineField` for type safety
- Group related fields with fieldsets
- Add helpful descriptions and validation rules
- Use references for relationships

### Custom Components

- Located in `/components` for schema UI
- Follow Sanity UI design patterns
- Use TypeScript for prop types

### Structure Configuration

- Custom desk structure in `structure.ts`
- Organize documents logically
- Hide technical documents from editors

## Studio Configuration

Key configuration in `sanity.config.ts`:

- Project ID and dataset
- Plugin initialization
- Schema types registration
- Custom tools and structure

## Plugins Used

1. **@sanity/vision:** GROQ query playground
2. **@sanity/assist:** AI-powered content assistance
3. **sanity-plugin-media:** Enhanced media library
4. **sanity-plugin-icon-picker:** Icon selection UI
5. **sanity-plugin-asset-source-unsplash:** Stock photos
6. **@sanity/orderable-document-list:** Sortable documents

## Common Tasks

1. **Add new schema:** Create in `schemaTypes/`, add to index
2. **Modify structure:** Edit `structure.ts`
3. **Add plugin:** Install, then add to `sanity.config.ts`
4. **Generate types:** Run `pnpm type` after schema changes
5. **Test schemas:** Add tests in `*.test.ts` files

## Type Generation

After schema changes:

```bash
pnpm type  # Generates TypeScript types
```

Types are used by the web app for type-safe queries.

## Notes for AI Assistants

- Always validate schemas before deployment
- Follow existing schema patterns and naming conventions
- Use proper field validation and helpful descriptions
- Test with `pnpm schema:validate` before commits
- Keep schemas focused and reusable
- Document complex schema relationships

## Deployment

Studio is deployed separately from the web app:

```bash
pnpm deploy:studio
```

Requires Sanity CLI authentication.

## Maintenance Notes

**IMPORTANT:** Update this file when:

- New schema types are added
- Plugins are added or removed
- Structure changes significantly
- New patterns or conventions are established
