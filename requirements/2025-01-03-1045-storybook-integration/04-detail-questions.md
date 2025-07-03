# Expert Requirements Questions

Based on deep analysis of the codebase, here are specific technical questions:

## Q6: Should the new Typography component support all HTML heading levels (h1-h6) plus body variants like the existing RichText component at apps/studio/schemaTypes/definitions/rich-text.ts?
**Default if unknown:** Yes (consistency with existing rich text handling patterns)

## Q7: Will the new layout components need to support the same responsive breakpoints already defined in the Sanity preview system (mobile: 420px, tablet: 768px, desktop: full)?
**Default if unknown:** Yes (maintaining consistency with content preview breakpoints)

## Q8: Should design tokens be exportable as TypeScript constants from @workspace/ui/lib/tokens for use in both Storybook stories and runtime component logic?
**Default if unknown:** Yes (enables type-safe token usage and single source of truth)

## Q9: Do you want the Container component to follow the same max-width constraint (1216px) used in existing section components like Footer?
**Default if unknown:** Yes (maintains visual consistency across the application)

## Q10: Should new components automatically work with the existing Sanity page builder by creating corresponding block schemas in apps/studio/schemaTypes/blocks/?
**Default if unknown:** No (not all UI components need to be page builder blocks)