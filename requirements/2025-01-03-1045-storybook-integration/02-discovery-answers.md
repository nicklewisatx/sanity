# Discovery Answers

## Q1: Will you want to view and interact with Storybook components directly within the apps/web application?

**Answer:** No

## Q2: Do you need to create new pages in apps/web that showcase UI components (like a pattern library)?

**Answer:** No

## Q3: Are there specific Storybook components that are missing from apps/web that you need to use?

**Answer:** Yes. Layout, and need design token and typography, and base components

## Q4: Should the integration maintain the current import pattern from @workspace/ui?

**Answer:** Yes, but think ahead to something more optimized that can maintain the same functionality

## Q5: Will you need to sync component props/variants between Storybook stories and web app usage?

**Answer:** Both. We want components to behave the same way but, sanity may have a page builder that combines components in a way not captured by storybook pages.
