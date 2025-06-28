# Sanity + Next.js Development Guide for Claude

This guide contains essential information for day-to-day development with this Sanity + Next.js monorepo project.

## Project Structure

```
/
├── apps/
│   ├── web/          # Next.js 15 app with App Router
│   └── studio/       # Sanity Studio v3
├── packages/         # Shared packages (UI, configs)
└── turbo.json       # TurboRepo configuration
```

## Key Commands

### Development

```bash
# Run both web and studio in parallel
pnpm dev

# Run specific app
pnpm dev --filter=web
pnpm dev --filter=studio
```

### Building & Deployment

```bash
# Build all apps
pnpm build

# Type checking
pnpm run check-types

# Linting
pnpm lint

# Format code
pnpm format

# Deploy Sanity Studio manually
cd apps/studio && npx sanity deploy
```

## Sanity Studio Development

### Schema Organization

```
apps/studio/schemaTypes/
├── documents/       # Main content types (blog, page, etc.)
├── blocks/          # Reusable page builder blocks
├── objects/         # Shared object types (button, link, etc.)
├── common.ts        # Common field definitions
└── index.ts         # Schema exports
```

### Schema Types Overview

#### Document Schemas (`/documents/`)

Main content types that appear in Studio:

- `author.ts` - Author profiles
- `blog.ts` - Blog posts with rich content
- `page.ts` - Generic pages with page builder
- `homePage.ts` - Homepage with specific fields
- `settings.ts` - Site-wide settings

#### Block Schemas (`/blocks/`)

Reusable components for page builder:

- `hero.ts` - Hero sections
- `cta.ts` - Call-to-action blocks
- `faq-accordion.ts` - FAQ sections
- `feature-cards-icon.ts` - Feature cards

#### Object Schemas (`/objects/`)

Shared data structures:

- `button.ts` - Button with link and style
- `custom-url.ts` - URL with internal/external handling
- `custom-link.ts` - Link for portable text

### Adding a New Schema

#### 1. Create a New Document Type

```typescript
// apps/studio/schemaTypes/documents/product.ts
import { defineType, defineField } from "sanity";

export const product = defineType({
  name: "product",
  title: "Product",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "price",
      title: "Price",
      type: "number",
      validation: (Rule) => Rule.required().positive(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "richText", // Uses common richText field
    }),
    defineField({
      name: "image",
      title: "Product Image",
      type: "image",
      options: {
        hotspot: true,
      },
    }),
  ],
  preview: {
    select: {
      title: "title",
      media: "image",
      price: "price",
    },
    prepare({ title, media, price }) {
      return {
        title,
        subtitle: `$${price}`,
        media,
      };
    },
  },
});
```

#### 2. Create a Reusable Block

```typescript
// apps/studio/schemaTypes/blocks/product-grid.ts
import { defineType, defineField } from "sanity";
import { Package } from "lucide-react";

export const productGrid = defineType({
  name: "productGrid",
  title: "Product Grid",
  type: "object",
  icon: Package,
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
    }),
    defineField({
      name: "products",
      title: "Products",
      type: "array",
      of: [{ type: "reference", to: [{ type: "product" }] }],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: "columns",
      title: "Columns",
      type: "number",
      initialValue: 3,
      options: {
        list: [
          { title: "2 Columns", value: 2 },
          { title: "3 Columns", value: 3 },
          { title: "4 Columns", value: 4 },
        ],
      },
    }),
  ],
  preview: {
    select: {
      title: "title",
      products: "products",
    },
    prepare({ title, products }) {
      return {
        title: title || "Product Grid",
        subtitle: `${products?.length || 0} products`,
      };
    },
  },
});
```

#### 3. Register the Schema

```typescript
// apps/studio/schemaTypes/index.ts
import { product } from "./documents/product";
import { productGrid } from "./blocks/product-grid";

export const schemaTypes = [
  // ... existing schemas
  product,
  productGrid,
];
```

#### 4. Add Block to Page Builder

```typescript
// apps/studio/schemaTypes/common.ts
export const pageBuilderField = defineField({
  name: "pageBuilder",
  title: "Page Builder",
  type: "array",
  of: [
    { type: "hero" },
    { type: "cta" },
    { type: "productGrid" }, // Add new block
    // ... other blocks
  ],
});
```

#### 5. Generate TypeScript Types

```bash
cd apps/studio
pnpm run type
```

### Editing Existing Schemas

#### Adding Fields

```typescript
// Add to existing schema
defineField({
  name: 'featured',
  title: 'Featured Product',
  type: 'boolean',
  initialValue: false,
}),
```

#### Modifying Field Types

⚠️ **Warning**: Changing field types can cause data loss. Consider:

1. Create new field with different name
2. Migrate data via script
3. Remove old field later

#### Adding Validation

```typescript
defineField({
  name: 'email',
  type: 'string',
  validation: (Rule) =>
    Rule.required()
      .email()
      .error('Please enter a valid email'),
}),
```

### Common Field Patterns

#### Rich Text with Custom Marks

```typescript
import { richTextField } from "../common";

defineField({
  ...richTextField,
  name: "content",
  title: "Content",
});
```

#### Reference Fields

```typescript
defineField({
  name: 'author',
  title: 'Author',
  type: 'reference',
  to: [{ type: 'author' }],
  validation: (Rule) => Rule.required(),
}),
```

#### Array of References

```typescript
defineField({
  name: 'relatedProducts',
  title: 'Related Products',
  type: 'array',
  of: [{ type: 'reference', to: [{ type: 'product' }] }],
}),
```

#### Conditional Fields

```typescript
defineField({
  name: 'salePrice',
  title: 'Sale Price',
  type: 'number',
  hidden: ({ parent }) => !parent?.onSale,
}),
```

## Schema to Component Architecture

### Overview of Data Flow

```
Sanity Schema → GROQ Query → Type Generation → React Component
     ↓              ↓              ↓                ↓
  Studio CMS    Query.ts      sanity.types.ts   Component.tsx
```

### Creating Components for Schemas

#### 1. Define the GROQ Query

```typescript
// apps/web/src/lib/sanity/query.ts

// Define reusable fragments
const productFragment = /* groq */ `
  _id,
  _type,
  title,
  slug,
  price,
  "salePrice": salePrice,
  description,
  image{
    ...,
    ...asset->{
      "alt": coalesce(altText, originalFilename, "no-alt"),
      "blurData": metadata.lqip,
      "dominantColor": metadata.palette.dominant.background
    },
  }
`;

// Add to pageBuilder blocks
const productGridBlock = /* groq */ `
  _type == "productGrid" => {
    ...,
    "products": products[]->{
      ${productFragment}
    }
  }
`;

// Export query
export const PRODUCTS_QUERY = /* groq */ `
  *[_type == "product"] | order(featured desc, _createdAt desc) {
    ${productFragment}
  }
`;
```

#### 2. Create the Component

```typescript
// apps/web/src/components/blocks/product-grid.tsx
import { SanityImage } from "@/components/sanity-image";
import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
import type { PagebuilderType } from "@/types";

type ProductGridProps = PagebuilderType<"productGrid">;

export function ProductGrid({ title, products, columns = 3 }: ProductGridProps) {
  const gridCols = {
    2: "grid-cols-2",
    3: "grid-cols-3",
    4: "grid-cols-4",
  };

  return (
    <section className="py-16">
      {title && (
        <h2 className="text-3xl font-bold text-center mb-8">{title}</h2>
      )}
      <div className={`grid gap-6 ${gridCols[columns]}`}>
        {products?.map((product) => (
          <article key={product._id} className="group">
            <div className="relative overflow-hidden rounded-lg">
              {product.salePrice && (
                <Badge className="absolute top-2 right-2 z-10">
                  Sale
                </Badge>
              )}
              <SanityImage
                asset={product.image}
                className="aspect-square object-cover group-hover:scale-105 transition-transform"
              />
            </div>
            <h3 className="mt-4 font-semibold">{product.title}</h3>
            <div className="flex items-center gap-2">
              {product.salePrice ? (
                <>
                  <span className="text-muted-foreground line-through">
                    ${product.price}
                  </span>
                  <span className="text-lg font-bold">${product.salePrice}</span>
                </>
              ) : (
                <span className="text-lg font-bold">${product.price}</span>
              )}
            </div>
            <Button asChild className="mt-2 w-full">
              <a href={`/products/${product.slug.current}`}>View Product</a>
            </Button>
          </article>
        ))}
      </div>
    </section>
  );
}
```

#### 3. Register Component in PageBuilder

```typescript
// apps/web/src/components/pagebuilder.tsx
import { ProductGrid } from "./blocks/product-grid";

const BLOCK_COMPONENTS = {
  cta: CTABlock,
  faqAccordion: FaqAccordion,
  hero: HeroBlock,
  productGrid: ProductGrid, // Add new component
  // ... other components
} as const;
```

#### 4. Create Shared UI Components

```typescript
// packages/ui/src/components/product-card.tsx
import { cn } from "@workspace/ui/lib/utils";

interface ProductCardProps {
  title: string;
  price: number;
  salePrice?: number;
  image?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
}

export function ProductCard({
  title,
  price,
  salePrice,
  image,
  className,
  children,
}: ProductCardProps) {
  return (
    <article className={cn("group", className)}>
      {image && (
        <div className="relative overflow-hidden rounded-lg">
          {image}
        </div>
      )}
      <h3 className="mt-4 font-semibold">{title}</h3>
      <div className="flex items-center gap-2">
        {salePrice ? (
          <>
            <span className="text-muted-foreground line-through">
              ${price}
            </span>
            <span className="text-lg font-bold">${salePrice}</span>
          </>
        ) : (
          <span className="text-lg font-bold">${price}</span>
        )}
      </div>
      {children}
    </article>
  );
}
```

### Key Patterns for Component Reusability

#### 1. Use GROQ Fragments

Define reusable query fragments for consistent data shapes:

```typescript
const imageFragment = /* groq */ `
  image{
    ...,
    ...asset->{
      "alt": coalesce(altText, originalFilename, "no-alt"),
      "blurData": metadata.lqip,
    },
  }
`;
```

#### 2. Wrapper Components for Sanity Data

Create wrapper components that handle Sanity-specific data:

```typescript
// components/sanity-buttons.tsx
export function SanityButtons({ buttons }: { buttons?: ButtonType[] }) {
  if (!buttons?.length) return null;

  return (
    <div className="flex gap-4">
      {buttons.map((button, index) => (
        <Button key={index} variant={button.variant} asChild>
          <a href={button.link?.url}>{button.text}</a>
        </Button>
      ))}
    </div>
  );
}
```

#### 3. Type Extraction Utilities

Use TypeScript utilities to extract types from queries:

```typescript
// types.ts
import type { QueryHomePageDataResult } from "@/data/sanity.types";

// Extract specific block type
export type PagebuilderType<T extends string> = Extract<
  NonNullable<NonNullable<QueryHomePageDataResult>["pageBuilder"]>[number],
  { _type: T }
>;
```

#### 4. Portable Text Components

Customize portable text rendering:

```typescript
// components/richtext.tsx
const components: Partial<PortableTextReactComponents> = {
  types: {
    // Custom type for products in rich text
    product: ({ value }) => (
      <ProductCard
        title={value.title}
        price={value.price}
        salePrice={value.salePrice}
      />
    ),
  },
};
```

### Best Practices

1. **Consistent Naming**: Schema field names should match component props
2. **Data Transformation**: Use GROQ to transform data into component-friendly shapes
3. **Shared Components**: Build generic UI components in `packages/ui`
4. **Type Safety**: Always run `pnpm run type` after schema changes
5. **Visual Editing**: Add `data-sanity` attributes for live preview

### GROQ Query Examples

```groq
// Get all blog posts
*[_type == "blog"] | order(publishedAt desc) {
  _id,
  title,
  slug,
  publishedAt,
  excerpt,
  mainImage
}

// Get products with references expanded
*[_type == "product"] {
  ...,
  "category": category->,
  "relatedProducts": relatedProducts[]->{
    _id,
    title,
    slug,
    price,
    image
  }
}

// Get page with page builder blocks
*[_type == "page" && slug.current == $slug][0] {
  ...,
  pageBuilder[] {
    ...,
    _type == "productGrid" => {
      ...,
      "products": products[]->{
        _id,
        title,
        slug,
        price,
        image
      }
    }
  }
}
```

## Next.js App Development

### Key Files & Patterns

#### Data Fetching (`apps/web/src/data/`)

- `sanity.fetch.ts` - Main fetch utility with caching
- `sanity.queries.ts` - All GROQ queries
- Use `loadQuery()` for server components
- Queries are cached and revalidated on content changes

#### Components (`apps/web/src/components/`)

- Server Components by default
- Client components marked with `'use client'`
- Shared UI components in `packages/ui/`

#### Live Preview Setup

```tsx
// In any page component
import { LiveQuery } from "@/data/sanity.types";
import { QueryParams } from "next-sanity";

const data = await loadQuery<BlogPost>(BLOG_QUERY, params, {
  perspective: draftMode().isEnabled ? "previewDrafts" : "published",
});

// Wrap with LiveQuery for preview
<LiveQuery
  enabled={draftMode().isEnabled}
  query={query}
  params={params}
  initial={data}
>
  {(data) => <BlogPost post={data} />}
</LiveQuery>;
```

### Environment Variables

#### Required for Web App

```bash
NEXT_PUBLIC_SANITY_PROJECT_ID=7pbquh5r
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_READ_TOKEN=<your-token>  # For draft mode
```

#### Required for Studio

```bash
SANITY_STUDIO_PROJECT_ID=7pbquh5r
SANITY_STUDIO_DATASET=production
SANITY_STUDIO_TITLE="Your Site Title"
SANITY_STUDIO_PRESENTATION_URL=https://your-site.com
```

## Common Tasks

### Creating Blog Posts

1. Open Studio at `/studio` or `https://[your-project].sanity.studio`
2. Create new Blog document
3. Fill required fields: title, slug, author, body
4. Publish when ready

### Adding Images

- Use Sanity's image pipeline for optimization
- Images are automatically served from Sanity's CDN
- Use `next-sanity/image` for URL generation:

```tsx
import { urlForImage } from "@/utils/image";

<img src={urlForImage(image).width(800).url()} />;
```

### Updating Navigation

1. Edit Navbar document in Studio
2. Add/remove navigation items
3. Changes reflect immediately after publishing

### Creating New Pages

1. Create Page document in Studio
2. Set slug (e.g., "about" for /about)
3. Add content blocks
4. Publish to make live

## Debugging & Troubleshooting

### Check Sanity Connection

```bash
# In studio directory
npx sanity debug
```

### View GROQ Query Results

Use Vision plugin at `/studio/vision` to test queries

### Clear Next.js Cache

```bash
rm -rf apps/web/.next
```

### Common Issues

1. **"projectId can only contain only a-z, 0-9 and dashes"**
   - Environment variables must not include quotes
   - Use: `NEXT_PUBLIC_SANITY_PROJECT_ID=7pbquh5r`
   - Not: `NEXT_PUBLIC_SANITY_PROJECT_ID="7pbquh5r"`

2. **Preview not working**
   - Ensure `SANITY_API_READ_TOKEN` is set
   - Check browser allows third-party cookies
   - Verify `SANITY_STUDIO_PRESENTATION_URL` matches your domain

3. **Types out of sync**
   - Run `pnpm run type` in studio directory
   - Restart TypeScript server in your editor

## Performance Tips

1. **Image Optimization**
   - Always use Sanity's image pipeline
   - Set appropriate widths: `urlForImage(img).width(800)`
   - Use `blur` placeholder for better LCP

2. **Query Optimization**
   - Limit fields returned: `{ title, slug, excerpt }`
   - Use projections to reshape data
   - Paginate large datasets

3. **Caching Strategy**
   - Static pages use ISR by default
   - Dynamic pages cache for 60 seconds
   - Use `revalidate` in fetch options to customize

## Useful Resources

- [GROQ Cheat Sheet](https://www.sanity.io/docs/groq-syntax)
- [Sanity Image URL Docs](https://www.sanity.io/docs/image-url)
- [Next.js App Router Docs](https://nextjs.org/docs/app)
- [Vision Plugin](http://localhost:3333/vision) - Test GROQ queries locally
