# [FEATURE] Enhanced Blog System with Technology Stack and Display Variants

**Labels:** `feature` `enhancement` `frontend` `backend` `content-model`  
**Projects:** AI Developer Portfolio  
**Priority:** P1 - High Priority  
**Assignees:** TBD

## Problem Statement

Current blog system lacks flexibility in display formats and doesn't support technology references or content categorization. Need enhanced content models to showcase technical expertise and enable better content discovery.

## Solution Overview

Enhance the existing blog system with:

- Multiple display formats (full, hero, card, list)
- Technology stack references with ratings
- Article categorization (coding, satire, news, misc)
- Auto-generated keywords and SEO
- Lightweight notes system
- Advanced filtering and search

## Technical Architecture

```
┌─────────────────┐     ┌──────────────┐     ┌─────────────┐
│  Enhanced Blog  │────▶│ Display      │────▶│   Homepage  │
│  + Technology   │     │ Components   │     │   + Blog    │
│  + Notes        │     │ (4 variants) │     │   Listing   │
└─────────────────┘     └──────────────┘     └─────────────┘
         │                      │                     │
         │                      │                     │
    ┌────▼─────┐         ┌─────▼─────┐       ┌──────▼──────┐
    │ Auto-gen │         │ Filtering  │       │   Search    │
    │ Keywords │         │ Sidebar    │       │   + Sort    │
    └──────────┘         └────────────┘       └─────────────┘
```

## Implementation Plan

### Phase 1: Content Model Updates

#### 1.1 Enhance Blog Schema

````typescript
// apps/studio/schemaTypes/documents/blog.ts
- [ ] Add teaser field
  ```typescript
  defineField({
    name: 'teaser',
    type: 'text',
    title: 'Teaser',
    description: 'Short description for cards and listings',
    rows: 3,
    validation: (Rule) => Rule.max(160).warning('Keep it under 160 characters')
  })
````

- [ ] Add article type field

  ```typescript
  defineField({
    name: "articleType",
    type: "string",
    title: "Article Type",
    options: {
      list: [
        { title: "Coding", value: "coding" },
        { title: "Satire", value: "satire" },
        { title: "News", value: "news" },
        { title: "Miscellaneous", value: "misc" },
      ],
      layout: "radio",
    },
    initialValue: "coding",
    validation: (Rule) => Rule.required(),
  });
  ```

- [ ] Add technology references

  ```typescript
  defineField({
    name: "technologies",
    type: "array",
    title: "Technologies",
    of: [
      defineArrayMember({
        type: "reference",
        to: [{ type: "technology" }],
      }),
    ],
    validation: (Rule) => Rule.unique(),
  });
  ```

- [ ] Add keywords field (auto-generated)

  ```typescript
  defineField({
    name: "keywords",
    type: "array",
    title: "Keywords",
    description: "Auto-generated from technologies and tags",
    of: [{ type: "string" }],
    readOnly: true,
  });
  ```

- [ ] Add hero and card image fields
  ```typescript
  (defineField({
    name: "heroImage",
    type: "image",
    title: "Hero Image",
    description: "Large image for hero displays (1920x1080)",
    options: { hotspot: true },
  }),
    defineField({
      name: "cardImage",
      type: "image",
      title: "Card Image",
      description: "Square image for card displays (400x400)",
      options: { hotspot: true },
    }));
  ```

#### 1.2 Create Technology Schema

````typescript
// apps/studio/schemaTypes/documents/technology.ts
- [ ] Create base technology schema
  ```typescript
  export const technology = defineType({
    name: 'technology',
    title: 'Technology',
    type: 'document',
    icon: CodeIcon,
    fields: [
      defineField({
        name: 'name',
        type: 'string',
        title: 'Name',
        validation: (Rule) => Rule.required()
      }),
      defineField({
        name: 'slug',
        type: 'slug',
        options: {
          source: 'name',
          slugify: createSlug,
          isUnique
        },
        validation: (Rule) => Rule.required()
      }),
      defineField({
        name: 'homepage',
        type: 'url',
        title: 'Homepage',
        validation: (Rule) => Rule.uri({
          scheme: ['http', 'https']
        })
      }),
      defineField({
        name: 'logo',
        type: 'image',
        title: 'Logo',
        options: { hotspot: true }
      }),
      defineField({
        name: 'stack',
        type: 'string',
        title: 'Stack Category',
        options: {
          list: [
            { title: 'Language', value: 'language' },
            { title: 'Framework', value: 'framework' },
            { title: 'Tool', value: 'tool' },
            { title: 'Service', value: 'service' },
            { title: 'Library', value: 'library' }
          ]
        }
      }),
      defineField({
        name: 'dateCreated',
        type: 'date',
        title: 'Date Created',
        description: 'When was this technology created?'
      }),
      defineField({
        name: 'dateAdded',
        type: 'date',
        title: 'Date Added',
        initialValue: () => new Date().toISOString().split('T')[0]
      }),
      defineField({
        name: 'description',
        type: 'text',
        title: 'Description',
        rows: 4
      }),
      defineField({
        name: 'vibes',
        type: 'number',
        title: 'Vibes Rating',
        description: 'How do you feel about this tech?',
        options: {
          list: [
            { title: 'Bad (0)', value: 0 },
            { title: 'Sketchy (1)', value: 1 },
            { title: 'Okay (2)', value: 2 },
            { title: 'Good (3)', value: 3 },
            { title: 'Great (4)', value: 4 },
            { title: 'Exceptional (5)', value: 5 }
          ]
        },
        validation: (Rule) => Rule.min(0).max(5)
      })
    ],
    preview: {
      select: {
        title: 'name',
        subtitle: 'stack',
        media: 'logo',
        vibes: 'vibes'
      },
      prepare: ({ title, subtitle, media, vibes }) => ({
        title,
        subtitle: `${subtitle || 'Uncategorized'} - Vibes: ${vibes}/5`,
        media
      })
    }
  })
````

#### 1.3 Create Note Schema

````typescript
// apps/studio/schemaTypes/documents/note.ts
- [ ] Create lightweight note schema
  ```typescript
  export const note = defineType({
    name: 'note',
    title: 'Note',
    type: 'document',
    icon: NoteIcon,
    fields: [
      defineField({
        name: 'text',
        type: 'text',
        title: 'Note',
        rows: 5,
        validation: (Rule) => Rule.required()
      }),
      defineField({
        name: 'link',
        type: 'url',
        title: 'Link',
        description: 'Optional related link'
      }),
      defineField({
        name: 'tags',
        type: 'array',
        title: 'Tags',
        of: [{ type: 'string' }],
        options: {
          layout: 'tags'
        }
      }),
      defineField({
        name: 'createdAt',
        type: 'datetime',
        title: 'Created At',
        initialValue: () => new Date().toISOString(),
        readOnly: true
      })
    ],
    preview: {
      select: {
        title: 'text',
        subtitle: 'createdAt'
      },
      prepare: ({ title, subtitle }) => ({
        title: title?.substring(0, 100) + '...',
        subtitle: new Date(subtitle).toLocaleDateString()
      })
    }
  })
````

### Phase 2: Component Development

#### 2.1 Blog Display Components

```typescript
// packages/ui/src/blog/
- [ ] FullBlogView component
  - Full article layout
  - Technology badges
  - Author info
  - Reading time

- [ ] HeroBlogCard component
  - Large featured layout
  - Hero image display
  - Prominent teaser

- [ ] BlogCard component
  - Standard card layout
  - Card image
  - Teaser text
  - Technology badges

- [ ] BlogListItem component
  - Compact list view
  - Minimal info
  - Quick scan format
```

#### 2.2 Technology Components

```typescript
// packages/ui/src/technology/
- [ ] TechnologyBadge
  - Logo display
  - Name with link
  - Vibes indicator

- [ ] TechnologyGrid
  - Responsive grid
  - Filter by stack
  - Sort by vibes/date

- [ ] VibesRating
  - Visual rating display
  - Color-coded levels
```

#### 2.3 Filter Components

```typescript
// packages/ui/src/filters/
- [ ] FilterSidebar
  - Technology checkboxes
  - Article type radio
  - Tag selection

- [ ] SearchBar
  - Full-text search
  - Debounced input
  - Clear button
```

### Phase 3: Page Implementation

#### 3.1 Homepage Updates

```typescript
// apps/web/src/app/page.tsx
- [ ] Hero section with featured blog
- [ ] Blog grid (latest 6 posts)
- [ ] Technology showcase section
- [ ] GROQ queries for data
```

#### 3.2 Blog Listing Page

```typescript
// apps/web/src/app/blog/page.tsx
- [ ] Sidebar layout
- [ ] Filter state management
- [ ] Pagination
- [ ] Search integration
- [ ] Display mode toggle (grid/list)
```

### Phase 4: Auto-Generation Functions

#### 4.1 Keywords Generation

```typescript
// functions/generate-keywords/
- [ ] Create Sanity function
- [ ] Extract from technologies
- [ ] Extract from tags
- [ ] Extract from content
- [ ] Update on publish
```

#### 4.2 SEO Description

```typescript
// functions/generate-seo/
- [ ] Create Sanity function
- [ ] Generate from teaser + content
- [ ] Optimal length (150-160 chars)
- [ ] Update on publish
```

## GROQ Queries

### Homepage Featured Query

```groq
*[_type == "blog" && featured == true] | order(publishedAt desc)[0] {
  _id,
  title,
  teaser,
  heroImage,
  "author": authors[0]->,
  "technologies": technologies[]->
}
```

### Blog Listing with Filters

```groq
*[_type == "blog"
  && articleType == $articleType
  && count((technologies[]->slug.current)[@ in $techFilters]) > 0
] | order(publishedAt desc)[$start...$end] {
  _id,
  title,
  teaser,
  cardImage,
  articleType,
  publishedAt,
  "technologies": technologies[]->{name, slug, logo, vibes}
}
```

## Definition of Done

- [ ] All schemas deployed to Sanity
- [ ] TypeScript types generated
- [ ] All display components render correctly
- [ ] Filter functionality works as expected
- [ ] Keywords auto-generate on blog publish
- [ ] SEO descriptions auto-generate
- [ ] Homepage shows all sections
- [ ] Blog listing has working filters
- [ ] Search returns relevant results
- [ ] Mobile responsive design
- [ ] Accessibility compliant

## Success Metrics

| Metric             | Target  | Measurement      |
| ------------------ | ------- | ---------------- |
| Schema Deployment  | 100%    | Sanity Studio    |
| Type Coverage      | 100%    | TypeScript       |
| Component Tests    | > 90%   | Vitest           |
| Page Load          | < 200ms | Web Vitals       |
| Filter Performance | < 50ms  | Browser DevTools |

## Technical Considerations

- Reuse existing rich text fields
- Extend current SEO field patterns
- Maintain backward compatibility
- Use existing image optimization
- Leverage current caching strategy

## Dependencies

- Existing blog schema structure
- Current author system
- SEO fields utilities
- Rich text configuration

## Out of Scope

- User comments
- Blog analytics
- Social sharing (future enhancement)
- Related posts algorithm
- AI-powered recommendations

---

**Estimated Effort:** 40-60 hours  
**Ready for Review:** No  
**Priority:** P1 - High Priority

cc: @frontend-team @content-team
