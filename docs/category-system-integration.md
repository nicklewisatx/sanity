# Category System Integration: Storybook ↔ Sanity

This document explains how the new Article Type and Technology category system maintains consistency between UI components (Storybook) and content management (Sanity Studio).

## Overview

The new category system replaces simple string categories with a structured approach:

- **Article Types**: Editorial categories with color-coded badges (Tutorial, Review, Deep Dive, etc.)
- **Technologies**: Referenced entities with ratings and logos (React, TypeScript, Vue.js, etc.)

## Shared Configuration

### Central Source of Truth

The configuration is centralized in `/packages/ui/src/lib/category-config.ts`:

```typescript
export const ARTICLE_TYPE_COLORS = {
  blue: {
    name: "Blue",
    value: "blue", 
    description: "Technology, tutorials, development guides",
    storybook: "bg-blue-100 text-blue-800 border-blue-200",
    tailwind: "blue",
  },
  // ... more colors
}

export const DEFAULT_ARTICLE_TYPES = [
  {
    name: "Tutorial",
    slug: "tutorial",
    description: "Step-by-step learning content",
    suggestedColor: "blue",
  },
  // ... more types
]
```

### Benefits of Shared Config

1. **Design Consistency**: Colors match exactly between Storybook and production
2. **Type Safety**: TypeScript ensures valid color combinations
3. **Documentation**: Each color/type includes usage guidelines
4. **Maintenance**: Single place to update options across the system

## Storybook Integration

### Component Development

The `CategoryBadges` component in Storybook shows all possible combinations:

```typescript
// packages/ui/src/components/category-badges.stories.tsx
export const ArticleTypeBadges: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      {sampleArticleTypes.map((type) => (
        <ArticleTypeBadge key={type.name} color={type.color as any}>
          {type.name}
        </ArticleTypeBadge>
      ))}
    </div>
  ),
};
```

### Color Variants

The badge component uses the shared config to generate consistent styles:

```typescript
const articleTypeBadgeVariants = cva("", {
  variants: {
    color: {
      blue: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800",
      green: "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800",
      // ... more colors with dark mode support
    },
  },
});
```

## Sanity Studio Integration

### Schema Definition

Article Type schema uses the shared configuration for validation:

```typescript
// apps/studio/schemaTypes/documents/article-type.ts
defineField({
  name: 'color',
  title: 'Badge Color',
  type: 'string',
  options: {
    list: [
      { title: 'Blue - Technology, tutorials, development guides', value: 'blue' },
      { title: 'Green - News, updates, success stories', value: 'green' },
      // ... consistent with shared config
    ],
    layout: 'radio',
  },
})
```

### Blog Schema Integration

The blog schema references both new content types:

```typescript
// apps/studio/schemaTypes/documents/blog.ts
defineField({
  name: "articleType",
  title: "Article Type", 
  type: "reference",
  to: [{ type: "articleType" }],
  validation: (Rule) => Rule.required(),
}),
defineField({
  name: "technologies",
  title: "Related Technologies",
  type: "array",
  of: [{ type: "reference", to: [{ type: "technology" }] }],
  validation: (Rule) => Rule.max(5),
})
```

## Data Seeding

### Automated Setup

Run the seed script to populate Sanity with default content:

```bash
cd apps/studio
npx tsx scripts/seed-article-types.ts
```

This creates:
- 8 default Article Types with suggested colors
- 5 sample Technologies with ratings and GitHub links

### Manual Setup

Alternatively, create content manually in Sanity Studio:

1. **Article Types**: Navigate to "Article Type" documents
2. **Technologies**: Add to "Technology" documents  
3. **Blog Posts**: Reference both in new blog entries

## Frontend Usage

### Article Card Component

The updated `ArticleCard` supports both systems:

```typescript
// Backward compatible with old category system
<ArticleCard
  title="Legacy Article"
  category="Engineering"  // Old system
  // ... other props
/>

// New category system
<ArticleCard
  title="Modern Article" 
  articleType={{ name: "Tutorial", color: "blue" }}
  technologies={[
    { name: "React", overallRating: 1 },
    { name: "TypeScript", overallRating: 1 },
  ]}
  // ... other props
/>
```

### Badge Components

Direct usage of category badges:

```typescript
import { CategoryBadges, ArticleTypeBadge, TechnologyBadge } from "@workspace/ui/components/category-badges";

// Combined display
<CategoryBadges
  articleType={{ name: "Tutorial", color: "blue" }}
  technologies={[{ name: "React", overallRating: 1 }]}
  maxTechnologies={3}
/>

// Individual badges
<ArticleTypeBadge color="blue">Tutorial</ArticleTypeBadge>
<TechnologyBadge rating={1}>React</TechnologyBadge>
```

## GROQ Queries

### Fetching Blog with Categories

```groq
*[_type == "blog"] {
  title,
  slug,
  articleType-> {
    name,
    color,
    description
  },
  technologies[]-> {
    name,
    overallRating,
    logo,
    github
  },
  // ... other fields
}
```

### Filtering by Article Type

```groq
*[_type == "blog" && articleType->slug.current == "tutorial"] {
  title,
  articleType-> { name, color }
}
```

### Technology-based Queries

```groq
*[_type == "blog" && "react" in technologies[]->slug.current] {
  title,
  technologies[]-> { name, overallRating }
}
```

## Color System Details

### Color Mapping

Each color has semantic meaning and consistent usage:

| Color  | Use Case | Example Article Types |
|--------|----------|----------------------|
| Blue   | Technology, Development | Tutorial, Code Review |
| Green  | Success, Updates | News, Release Notes |
| Purple | Advanced, Research | Deep Dive, Analysis |
| Red    | Important, Breaking | Alert, Security |
| Orange | Opinion, Community | Editorial, Discussion |
| Yellow | Quick, Helpful | Tips, Quick Win |
| Pink   | Review, Comparison | Tool Review, Comparison |
| Indigo | Guide, Reference | How-to, Documentation |
| Gray   | Neutral, Archive | Legacy, General |

### Dark Mode Support

All colors include dark mode variants:

```css
/* Light mode */
.badge-blue { @apply bg-blue-100 text-blue-800 border-blue-200; }

/* Dark mode */
.dark .badge-blue { @apply bg-blue-900/20 text-blue-300 border-blue-800; }
```

## Rating System

### Technology Ratings

Technologies use a three-point scale:

- **👍 Thumbs Up (1)**: Recommended
- **👌 Thumbs Sideways (0)**: Neutral/Conditional  
- **👎 Thumbs Down (-1)**: Not Recommended

### Visual Indicators

Ratings affect badge styling:

```typescript
const ratingVariant = rating === 1 ? "thumbsUp" : rating === -1 ? "thumbsDown" : "thumbsSideways";
```

## Migration Strategy

### Existing Content

1. **Backward Compatibility**: Old `category` field still works
2. **Gradual Migration**: Add new fields without breaking existing content
3. **Fallback Logic**: UI handles both old and new category systems

### Migration Steps

1. Deploy schema changes
2. Run seed script for default data
3. Update frontend components (already backward compatible)
4. Gradually migrate existing blog posts to new system
5. Eventually deprecate old `category` field

## Development Workflow

### Adding New Article Types

1. **Update Shared Config**: Add to `category-config.ts`
2. **Update Storybook**: Stories automatically include new types
3. **Create in Sanity**: Add new Article Type document
4. **Test Components**: Verify in both Storybook and production

### Adding New Colors

1. **Define in Config**: Add color definition with guidelines
2. **Update Schema**: Include in Sanity field options
3. **Update Components**: Add variant styles
4. **Test Contrast**: Ensure accessibility standards

## Best Practices

### Content Strategy

- **Article Types**: Keep to 6-10 types maximum
- **Technologies**: Focus on currently relevant technologies
- **Colors**: Use semantic meaning consistently
- **Ratings**: Update as technologies evolve

### Technical

- **Type Safety**: Always use TypeScript types from shared config
- **Performance**: Limit technologies per article (5 max recommended)
- **Accessibility**: Maintain color contrast ratios
- **Responsive**: Test badge layouts on mobile devices

## Troubleshooting

### Common Issues

1. **Color Mismatch**: Verify shared config is imported correctly
2. **Missing Types**: Run seed script or create manually in Sanity
3. **Old Categories**: Check backward compatibility logic
4. **Build Errors**: Ensure all TypeScript types are properly exported

### Debug Commands

```bash
# Check Storybook stories
pnpm dev:storybook

# Validate Sanity schemas  
cd apps/studio && pnpm schema:validate

# Test component exports
pnpm --filter=@workspace/ui test

# Generate fresh types
cd apps/studio && pnpm type
```

## Future Enhancements

### Planned Features

- **Tag System**: Additional tagging beyond technologies
- **Color Themes**: Seasonal or brand-specific color schemes
- **Advanced Ratings**: More nuanced rating systems
- **Auto-categorization**: AI-powered content categorization

### Integration Opportunities

- **Search**: Category-based search and filtering
- **Analytics**: Track popular technologies and article types
- **Recommendations**: Suggest related content by category
- **RSS Feeds**: Category-specific content feeds

This integration ensures that design decisions made in Storybook are automatically reflected in the CMS, maintaining consistency across the entire content creation and display pipeline.