# Expert Requirements Answers

## Q6: Should the new Typography component support all HTML heading levels (h1-h6) plus body variants like the existing RichText component at apps/studio/schemaTypes/definitions/rich-text.ts?
**Answer:** Yes

## Q7: Will the new layout components need to support the same responsive breakpoints already defined in the Sanity preview system (mobile: 420px, tablet: 768px, desktop: full)?
**Answer:** Yes

## Q8: Should design tokens be exportable as TypeScript constants from @workspace/ui/lib/tokens for use in both Storybook stories and runtime component logic?
**Answer:** Yes

## Q9: Do you want the Container component to follow the same max-width constraint (1216px) used in existing section components like Footer?
**Answer:** Yes, but we'll want a full width component as well (for full width heros)

## Q10: Should new components automatically work with the existing Sanity page builder by creating corresponding block schemas in apps/studio/schemaTypes/blocks/?
**Answer:** Yes