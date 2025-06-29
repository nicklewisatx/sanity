# Performance Optimization Guide

Techniques and best practices for optimizing performance in your Sanity + Next.js application.

## Image Optimization

### Use Sanity's Image Pipeline

Always leverage Sanity's built-in image transformation API:

```typescript
import { urlForImage } from "@/utils/image";

// Basic optimization
const imageUrl = urlForImage(image)
  .width(800)
  .height(600)
  .format("webp")
  .quality(85)
  .url();

// Responsive images
const srcSet = [400, 800, 1200]
  .map((width) => `${urlForImage(image).width(width).url()} ${width}w`)
  .join(", ");
```

### Image Component Best Practices

```tsx
import Image from "next/image";

// Optimized image component
<Image
  src={urlForImage(image).width(800).url()}
  alt={image.alt}
  width={800}
  height={600}
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  placeholder="blur"
  blurDataURL={image.blurData} // LQIP from Sanity
  loading="lazy" // Below the fold
  priority={false} // Above the fold images only
/>;
```

### Sanity Image Configuration

```typescript
// Define image with metadata for better performance
defineField({
  name: "image",
  type: "image",
  options: {
    hotspot: true,
    metadata: ["lqip", "palette", "dimensions"],
  },
});
```

## Query Optimization

### Limit Fields Returned

```groq
// ❌ Bad: Returns all fields
*[_type == "product"]

// ✅ Good: Only required fields
*[_type == "product"] {
  _id,
  title,
  slug,
  price,
  "imageUrl": image.asset->url
}
```

### Use Projections Efficiently

```groq
// ❌ Bad: Multiple queries
*[_type == "product"][0...10]
*[_type == "category"]

// ✅ Good: Single query with joins
*[_type == "product"][0...10] {
  ...,
  "category": category->{
    _id,
    title
  }
}
```

### Implement Pagination

```typescript
const PAGE_SIZE = 20;

export const PRODUCTS_PAGINATED = /* groq */ `
  *[_type == "product"] | order(_createdAt desc) [$start...$end] {
    _id,
    title,
    slug,
    price
  }
`;

// Usage
const { data } = await loadQuery(PRODUCTS_PAGINATED, {
  start: page * PAGE_SIZE,
  end: (page + 1) * PAGE_SIZE,
});
```

### Query Fragments for Reusability

```typescript
// Define once, use everywhere
const baseProductFields = /* groq */ `
  _id,
  title,
  slug,
  price
`;

const productWithImage = /* groq */ `
  ${baseProductFields},
  image {
    ...,
    asset->{
      url,
      "blurData": metadata.lqip
    }
  }
`;
```

## Caching Strategy

### Next.js Caching

```typescript
// Static pages with ISR
export const revalidate = 3600; // Revalidate every hour

// Or use on-demand revalidation
export async function GET(request: Request) {
  const data = await sanityFetch({
    query: PRODUCTS_QUERY,
    // Cache for 1 hour
    next: { revalidate: 3600 },
  });

  return Response.json(data);
}
```

### Sanity CDN Configuration

```typescript
// Enable CDN for production
const client = createClient({
  projectId,
  dataset,
  useCdn: process.env.NODE_ENV === "production",
  apiVersion,
});
```

### Cache Tags for Granular Invalidation

```typescript
// Tag-based revalidation
const data = await sanityFetch({
  query: PRODUCT_QUERY,
  params: { slug },
  tags: [`product:${slug}`, "products"],
});

// Invalidate specific tags
revalidateTag("products");
revalidateTag(`product:${slug}`);
```

## Bundle Size Optimization

### Dynamic Imports

```typescript
// ❌ Bad: Import everything
import { Chart } from 'heavy-chart-library';

// ✅ Good: Dynamic import
const Chart = dynamic(() =>
  import('heavy-chart-library').then(mod => mod.Chart),
  {
    loading: () => <Skeleton />,
    ssr: false
  }
);
```

### Tree Shaking Imports

```typescript
// ❌ Bad: Import entire library
import * as Icons from "lucide-react";

// ✅ Good: Import only what you need
import { Home, User, Settings } from "lucide-react";
```

### Optimize Sanity Imports

```typescript
// ❌ Bad: Import entire package
import { createClient } from "sanity";

// ✅ Good: Use next-sanity optimized imports
import { createClient } from "next-sanity";
```

## Server Components Strategy

### Default to Server Components

```tsx
// ✅ Server Component (default)
export default async function ProductList() {
  const products = await loadQuery(PRODUCTS_QUERY);

  return (
    <div>
      {products.map((product) => (
        <ProductCard key={product._id} {...product} />
      ))}
    </div>
  );
}
```

### Client Components Only When Needed

```tsx
// Only use client components for interactivity
"use client";

export function AddToCart({ productId }: { productId: string }) {
  const [quantity, setQuantity] = useState(1);

  return (
    <button onClick={() => addToCart(productId, quantity)}>Add to Cart</button>
  );
}
```

## Loading States & Streaming

### Implement Loading UI

```tsx
// loading.tsx
export default function Loading() {
  return <ProductGridSkeleton />;
}

// Use Suspense for granular loading
<Suspense fallback={<ProductsSkeleton />}>
  <ProductList />
</Suspense>;
```

### Stream Large Data Sets

```tsx
// Stream products as they load
export default async function ProductsPage() {
  return (
    <>
      <Suspense fallback={<FeaturedSkeleton />}>
        <FeaturedProducts />
      </Suspense>

      <Suspense fallback={<GridSkeleton />}>
        <AllProducts />
      </Suspense>
    </>
  );
}
```

## Monitoring & Analysis

### Web Vitals Tracking

```typescript
// app/layout.tsx
import { WebVitals } from './web-vitals';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <WebVitals />
        {children}
      </body>
    </html>
  );
}
```

### Performance Logging

```typescript
import logger from "@workspace/logger";

// Log slow queries
const start = performance.now();
const data = await loadQuery(query);
const duration = performance.now() - start;

if (duration > 1000) {
  logger.warn("Slow query detected", {
    query,
    duration: `${duration}ms`,
  });
}
```

## Best Practices Checklist

### Images

- [ ] Use Sanity image pipeline for all images
- [ ] Set appropriate `sizes` attribute
- [ ] Include blur placeholder (LQIP)
- [ ] Use WebP format when possible
- [ ] Lazy load below-the-fold images

### Queries

- [ ] Limit fields to only what's needed
- [ ] Use projections to reshape data
- [ ] Implement pagination for lists
- [ ] Cache queries appropriately
- [ ] Monitor query performance

### Components

- [ ] Default to Server Components
- [ ] Use dynamic imports for heavy components
- [ ] Implement proper loading states
- [ ] Stream content when possible

### Caching

- [ ] Enable Sanity CDN in production
- [ ] Use ISR for static pages
- [ ] Implement cache tags for invalidation
- [ ] Set appropriate cache headers

### Bundle

- [ ] Tree shake imports
- [ ] Code split at route level
- [ ] Optimize third-party scripts
- [ ] Monitor bundle size

## Performance Budget

Set targets for key metrics:

```javascript
// next.config.js
module.exports = {
  experimental: {
    webVitalsAttribution: ["CLS", "LCP", "FCP", "FID", "TTFB"],
  },
};
```

**Recommended Targets:**

- LCP: < 2.5s
- FID: < 100ms
- CLS: < 0.1
- TTFB: < 600ms
- Bundle Size: < 200KB (JS)

## Tools for Performance Analysis

1. **Lighthouse CI**

   ```bash
   npm install -g @lhci/cli
   lhci autorun
   ```

2. **Bundle Analyzer**

   ```bash
   ANALYZE=true pnpm build
   ```

3. **Sanity Vision**
   - Test query performance at `/studio/vision`
   - Use explain mode for query analysis

4. **Chrome DevTools**
   - Performance tab for runtime analysis
   - Network tab for request waterfall
   - Coverage tab for unused code
