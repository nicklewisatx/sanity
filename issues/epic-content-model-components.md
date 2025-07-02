# Epic: AI Developer Portfolio Site - Content Model & Component Updates

## Overview
Implement comprehensive content management and component architecture for an AI developer portfolio site featuring blog, technical analysis, curated technologies, quick notes, about page, and contact functionality.

## Technical Stack
- **Frontend:** Next.js 15 (App Router)
- **CMS:** Sanity v3
- **UI:** Shared component library (Radix UI + Tailwind)
- **Email:** Resend API
- **Code Highlighting:** Shiki
- **Testing:** Playwright E2E
- **Observability:** OpenTelemetry

## Success Criteria
- [ ] Type-safe content models from Sanity to React
- [ ] Page load times under 100ms (cached)
- [ ] WCAG AA accessibility compliance
- [ ] Mobile-first responsive design
- [ ] 100% email delivery for contact form
- [ ] Comprehensive E2E test coverage

## Dependencies & Risks
- **External:** Resend API key required
- **Technical:** Sanity schema changes need migration strategy
- **Performance:** Large code blocks may impact load times
- **Security:** Contact form needs rate limiting

## Acceptance Criteria
1. Content editors can manage all content types in Sanity
2. Visitors can browse technologies with filtering
3. Contact form successfully sends emails
4. All pages have proper SEO metadata
5. Code examples have syntax highlighting
6. Site passes Lighthouse audits (90+ scores)

## Detailed Implementation Tasks

### Phase 1: Content Models (Sanity Schemas)

#### 1.1 About Page Singleton
```typescript
// apps/studio/schemaTypes/documents/about-page.ts
- [ ] Create singleton schema with:
  - [ ] Developer bio (rich text)
  - [ ] Skills array with categories
  - [ ] Professional timeline (array of experiences)
  - [ ] Social links (LinkedIn, GitHub, Twitter)
  - [ ] Profile image with alt text
  - [ ] SEO fields (reuse existing)
```

#### 1.2 Technology Document
```typescript
// apps/studio/schemaTypes/documents/technology.ts
- [ ] Create document schema with:
  - [ ] Name, slug, description
  - [ ] Logo image field
  - [ ] Category enum (framework, tool, language, service, library)
  - [ ] Tags array for filtering
  - [ ] Usage notes (rich text)
  - [ ] Links object (documentation, github, website)
  - [ ] Personal rating (1-5 stars)
  - [ ] Featured boolean
  - [ ] Order rank for manual sorting
```

#### 1.3 Note Document
```typescript
// apps/studio/schemaTypes/documents/note.ts
- [ ] Create lightweight schema with:
  - [ ] Title, slug
  - [ ] Excerpt (text, 160 chars)
  - [ ] Body (simple rich text)
  - [ ] Tags array
  - [ ] Published date
  - [ ] Code snippet field (optional)
```

#### 1.4 Analysis Document
```typescript
// apps/studio/schemaTypes/documents/analysis.ts
- [ ] Extend blog schema with:
  - [ ] All existing blog fields
  - [ ] Code examples array (with language selector)
  - [ ] Technical diagrams (image array)
  - [ ] Related technologies (references)
  - [ ] Difficulty level (beginner, intermediate, advanced)
  - [ ] Estimated reading time
  - [ ] Prerequisites array
```

#### 1.5 Contact Submission
```typescript
// apps/studio/schemaTypes/documents/contact-submission.ts
- [ ] Create submission tracking with:
  - [ ] Name, email, subject
  - [ ] Message (text)
  - [ ] Submission timestamp
  - [ ] Status (new, replied, archived)
  - [ ] Internal notes
  - [ ] IP address (for spam prevention)
```

#### 1.6 Structure Updates
- [ ] Update `structure.ts` to organize new content types
- [ ] Add icons for each content type
- [ ] Create logical groupings in Studio

### Phase 2: API & Infrastructure

#### 2.1 Email Service Setup
- [ ] Install Resend SDK
- [ ] Configure environment variables
- [ ] Create email templates
- [ ] Set up rate limiting with Upstash

#### 2.2 Server Actions
```typescript
// apps/web/src/app/actions/contact.ts
- [ ] Create contact form submission action
- [ ] Add validation with Zod
- [ ] Implement spam protection
- [ ] Store submission in Sanity
- [ ] Send email notification
```

#### 2.3 GROQ Queries
```typescript
// apps/web/src/lib/sanity/queries/
- [ ] technologies.ts - filtering, sorting
- [ ] notes.ts - pagination support
- [ ] analysis.ts - with related content
- [ ] about.ts - singleton fetch
```

#### 2.4 Code Highlighting
- [ ] Install and configure Shiki
- [ ] Create CodeBlock component
- [ ] Add theme switcher (light/dark)
- [ ] Support common languages

### Phase 3: Component Development

#### 3.1 Technology Components
```typescript
// packages/ui/src/technology/
- [ ] TechnologyCard
  - [ ] Logo display with fallback
  - [ ] Category badge
  - [ ] Rating stars
  - [ ] Hover animations
- [ ] TechnologyGrid
  - [ ] Responsive grid layout
  - [ ] Category filtering
  - [ ] Search functionality
  - [ ] Sort options
- [ ] TechnologyFilter
  - [ ] Category checkboxes
  - [ ] Tag multi-select
  - [ ] Clear filters button
```

#### 3.2 Contact Form
```typescript
// packages/ui/src/forms/
- [ ] ContactForm component
  - [ ] Field validation
  - [ ] Loading states
  - [ ] Success/error messages
  - [ ] Honeypot field
- [ ] Form field components
  - [ ] Accessible labels
  - [ ] Error states
  - [ ] Focus management
```

#### 3.3 About Components
```typescript
// packages/ui/src/about/
- [ ] DeveloperHero
  - [ ] Profile image
  - [ ] Bio section
  - [ ] Social links
- [ ] SkillsSection
  - [ ] Grouped by category
  - [ ] Skill level indicators
- [ ] Timeline
  - [ ] Vertical timeline layout
  - [ ] Date markers
  - [ ] Experience cards
```

#### 3.4 Content Display
```typescript
// packages/ui/src/content/
- [ ] NoteCard
  - [ ] Minimal design
  - [ ] Tag display
  - [ ] Date formatting
- [ ] AnalysisLayout
  - [ ] Table of contents
  - [ ] Code example tabs
  - [ ] Related tech sidebar
- [ ] CodeBlock (enhanced)
  - [ ] Copy button
  - [ ] Line numbers
  - [ ] Language label
```

### Phase 4: Page Implementation

#### 4.1 About Page
```typescript
// apps/web/src/app/about/
- [ ] page.tsx implementation
- [ ] Fetch singleton data
- [ ] Responsive layout
- [ ] SEO metadata
- [ ] JSON-LD structured data
```

#### 4.2 Technologies Page
```typescript
// apps/web/src/app/technologies/
- [ ] page.tsx with filtering
- [ ] URL state management
- [ ] Pagination
- [ ] Loading skeleton
- [ ] Empty states
```

#### 4.3 Notes Section
```typescript
// apps/web/src/app/notes/
- [ ] Listing page
- [ ] Individual note pages
- [ ] Tag filtering
- [ ] RSS feed generation
```

#### 4.4 Analysis Section
```typescript
// apps/web/src/app/analysis/
- [ ] Enhanced blog layout
- [ ] Code playground integration
- [ ] Related content
- [ ] Share functionality
```

#### 4.5 Contact Page
```typescript
// apps/web/src/app/contact/
- [ ] Form integration
- [ ] Alternative contact methods
- [ ] Success confirmation
- [ ] Error handling
```

### Phase 5: Testing & Polish

#### 5.1 E2E Tests
```typescript
// packages/e2e/tests/
- [ ] Contact form submission flow
- [ ] Technology filtering
- [ ] Page navigation
- [ ] Mobile responsiveness
- [ ] Accessibility checks
```

#### 5.2 Performance
- [ ] Image optimization
- [ ] Code splitting
- [ ] Font loading strategy
- [ ] Cache headers
- [ ] Bundle analysis

#### 5.3 SEO & Metadata
- [ ] Open Graph images
- [ ] Twitter cards
- [ ] Sitemap generation
- [ ] Robots.txt updates
- [ ] Canonical URLs

#### 5.4 Documentation
- [ ] Update CLAUDE.md files
- [ ] Component Storybook
- [ ] API documentation
- [ ] Deployment guide

#### 5.5 Accessibility
- [ ] Keyboard navigation
- [ ] Screen reader testing
- [ ] Color contrast audit
- [ ] Focus indicators
- [ ] ARIA labels

## Definition of Done
- [ ] All schemas deployed to Sanity
- [ ] Types generated and no TypeScript errors
- [ ] All components have stories
- [ ] E2E tests passing
- [ ] Lighthouse scores 90+
- [ ] Documentation complete
- [ ] Code reviewed and approved

## Out of Scope
- User authentication system
- Comment functionality
- Newsletter automation
- Advanced analytics
- Multi-language support
- RSS feed customization

## Notes
- Use existing patterns from current blog implementation
- Maintain consistency with current design system
- Prioritize performance and accessibility
- Follow TypeScript strict mode requirements
- Ensure all new components are reusable