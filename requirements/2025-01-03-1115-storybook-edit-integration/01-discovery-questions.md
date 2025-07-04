# Discovery Questions

Based on my analysis of the codebase:

- Visual editing is already set up with @sanity/visual-editing
- The PageBuilder handles block-level editing with data-sanity attributes
- New UI components (Typography, Container, Layout) support prop spreading
- Current architecture separates UI components from CMS concerns

## Q1: Do you need field-level edit-in-place functionality for individual text elements within the new components?

**Default if unknown:** Yes (enables granular editing experience similar to modern CMSs)

## Q2: Should the visual editing integration work with the existing Sanity Presentation tool workflow?

**Default if unknown:** Yes (maintains consistency with current editorial workflow)

## Q3: Will editors need to edit design tokens (colors, spacing) directly through visual editing?

**Default if unknown:** No (design tokens are typically managed by developers, not content editors)

## Q4: Do you want to create new Sanity block schemas for the Typography and Layout components?

**Default if unknown:** Yes (enables using these components in the page builder)

## Q5: Should the edit-in-place functionality support real-time preview updates without page refresh?

**Default if unknown:** Yes (matches current useOptimistic implementation pattern)
