# Frontend Development Guide

This guide covers Next.js 15 App Router development patterns and integration with Sanity CMS.

## Key Files & Patterns

### Data Fetching (`apps/web/src/data/`)
- `sanity.fetch.ts` - Main fetch utility with caching
- `sanity.queries.ts` - All GROQ queries
- Use `loadQuery()` for server components
- Queries are cached and revalidated on content changes

### Components (`apps/web/src/components/`)
- Server Components by default
- Client components marked with `'use client'`
- Shared UI components in `packages/ui/`

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

## Live Preview Setup

Enable real-time content updates during editing:

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
</LiveQuery>
```

## Key Patterns for Component Reusability

### 1. Use GROQ Fragments

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

### 2. Wrapper Components for Sanity Data

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

### 3. Type Extraction Utilities

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

### 4. Portable Text Components

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

## Creating Shared UI Components

Build reusable components in the shared UI package:

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

## Image Handling

Use Sanity's image pipeline for optimization:

```tsx
import { urlForImage } from "@/utils/image";

// Basic usage
<img src={urlForImage(image).width(800).url()} />

// With Next.js Image component
import Image from "next/image";

<Image
  src={urlForImage(image).width(800).url()}
  alt={image.alt || ""}
  width={800}
  height={600}
  placeholder="blur"
  blurDataURL={image.blurData}
/>

// SanityImage component wrapper
<SanityImage
  asset={image}
  className="w-full h-auto"
  sizes="(max-width: 768px) 100vw, 50vw"
/>
```

## Server vs Client Components

### Server Components (Default)

```tsx
// app/products/page.tsx
import { loadQuery } from "@/data/sanity.fetch";
import { PRODUCTS_QUERY } from "@/data/sanity.queries";

export default async function ProductsPage() {
  const { data: products } = await loadQuery(PRODUCTS_QUERY);
  
  return (
    <div>
      {products.map(product => (
        <ProductCard key={product._id} {...product} />
      ))}
    </div>
  );
}
```

### Client Components

```tsx
// components/interactive-filter.tsx
'use client';

import { useState } from 'react';

export function InteractiveFilter({ products }) {
  const [filter, setFilter] = useState('all');
  
  // Client-side interactivity
  const filtered = products.filter(p => 
    filter === 'all' || p.category === filter
  );
  
  return (
    <>
      <select onChange={(e) => setFilter(e.target.value)}>
        <option value="all">All</option>
        <option value="electronics">Electronics</option>
      </select>
      {/* Render filtered products */}
    </>
  );
}
```

## Best Practices

1. **Consistent Naming**: Schema field names should match component props
2. **Data Transformation**: Use GROQ to transform data into component-friendly shapes
3. **Shared Components**: Build generic UI components in `packages/ui`
4. **Type Safety**: Always run `pnpm run type` after schema changes
5. **Visual Editing**: Add `data-sanity` attributes for live preview
6. **Performance**: Use server components by default, client components only when needed
7. **Image Optimization**: Always use Sanity's image pipeline with appropriate sizing