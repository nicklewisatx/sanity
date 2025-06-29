# Sanity Backend Development Guide

This guide covers everything you need to know about developing with Sanity Studio and managing content schemas.

## Schema Organization

```
apps/studio/schemaTypes/
├── documents/       # Main content types (blog, page, etc.)
├── blocks/          # Reusable page builder blocks
├── objects/         # Shared object types (button, link, etc.)
├── common.ts        # Common field definitions
└── index.ts         # Schema exports
```

## Schema Types Overview

### Document Schemas (`/documents/`)

Main content types that appear in Studio:

- `author.ts` - Author profiles
- `blog.ts` - Blog posts with rich content
- `page.ts` - Generic pages with page builder
- `homePage.ts` - Homepage with specific fields
- `settings.ts` - Site-wide settings

### Block Schemas (`/blocks/`)

Reusable components for page builder:

- `hero.ts` - Hero sections
- `cta.ts` - Call-to-action blocks
- `faq-accordion.ts` - FAQ sections
- `feature-cards-icon.ts` - Feature cards

### Object Schemas (`/objects/`)

Shared data structures:

- `button.ts` - Button with link and style
- `custom-url.ts` - URL with internal/external handling
- `custom-link.ts` - Link for portable text

## Creating New Schemas

### 1. Create a New Document Type

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

### 2. Create a Reusable Block

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

### 3. Register the Schema

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

### 4. Add Block to Page Builder

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

### 5. Generate TypeScript Types

```bash
cd apps/studio
pnpm run type
```

## Editing Existing Schemas

### Adding Fields

```typescript
// Add to existing schema
defineField({
  name: 'featured',
  title: 'Featured Product',
  type: 'boolean',
  initialValue: false,
}),
```

### Modifying Field Types

⚠️ **Warning**: Changing field types can cause data loss. Consider:

1. Create new field with different name
2. Migrate data via script
3. Remove old field later

### Adding Validation

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

## Common Field Patterns

### Rich Text with Custom Marks

```typescript
import { richTextField } from "../common";

defineField({
  ...richTextField,
  name: "content",
  title: "Content",
});
```

### Reference Fields

```typescript
defineField({
  name: 'author',
  title: 'Author',
  type: 'reference',
  to: [{ type: 'author' }],
  validation: (Rule) => Rule.required(),
}),
```

### Array of References

```typescript
defineField({
  name: 'relatedProducts',
  title: 'Related Products',
  type: 'array',
  of: [{ type: 'reference', to: [{ type: 'product' }] }],
}),
```

### Conditional Fields

```typescript
defineField({
  name: 'salePrice',
  title: 'Sale Price',
  type: 'number',
  hidden: ({ parent }) => !parent?.onSale,
}),
```

## GROQ Query Language

### Basic Queries

```groq
// Get all documents of a type
*[_type == "product"]

// Get with ordering
*[_type == "blog"] | order(publishedAt desc)

// Get with pagination
*[_type == "product"][0...10]

// Get single document by slug
*[_type == "page" && slug.current == "about"][0]
```

### Advanced Queries

```groq
// Get with field projection
*[_type == "product"] {
  _id,
  title,
  price,
  "imageUrl": image.asset->url
}

// Expand references
*[_type == "product"] {
  ...,
  "category": category->,
  "relatedProducts": relatedProducts[]->{
    _id,
    title,
    slug,
    price
  }
}

// Conditional projections
*[_type == "page"] {
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

### Query Fragments

Define reusable query fragments:

```typescript
// apps/web/src/lib/sanity/query.ts
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

export const PRODUCTS_QUERY = /* groq */ `
  *[_type == "product"] | order(featured desc, _createdAt desc) {
    ${productFragment}
  }
`;
```

## Studio Configuration

### Basic Setup

```typescript
// apps/studio/sanity.config.ts
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./schemaTypes";

export default defineConfig({
  name: "default",
  title: "My Site",
  projectId: process.env.SANITY_STUDIO_PROJECT_ID!,
  dataset: process.env.SANITY_STUDIO_DATASET!,
  plugins: [
    structureTool(),
    visionTool(), // GROQ query playground
  ],
  schema: {
    types: schemaTypes,
  },
});
```

### Custom Document Actions

```typescript
// Add custom actions to documents
import { definePlugin } from "sanity";

export const customActions = definePlugin({
  name: "custom-actions",
  document: {
    actions: (prev, context) => {
      // Add custom action
      return [...prev, MyCustomAction];
    },
  },
});
```

## Working with Assets

### Image Handling

```typescript
// Define image field with metadata
defineField({
  name: "heroImage",
  type: "image",
  options: {
    hotspot: true, // Enable focal point selection
    metadata: ["lqip", "palette"], // Include blur hash and colors
  },
  fields: [
    {
      name: "alt",
      type: "string",
      title: "Alternative text",
      validation: (Rule) => Rule.required(),
    },
  ],
});
```

### File Uploads

```typescript
defineField({
  name: "downloadFile",
  type: "file",
  options: {
    accept: ".pdf,.doc,.docx", // Restrict file types
  },
});
```

## Best Practices

1. **Consistent Naming**: Use camelCase for field names
2. **Required Fields**: Mark essential fields as required
3. **Helpful Descriptions**: Add descriptions to complex fields
4. **Preview Configuration**: Set up meaningful previews
5. **Type Generation**: Run type generation after schema changes
6. **Validation Rules**: Add appropriate validation for data integrity
7. **Organized Structure**: Group related schemas in folders
