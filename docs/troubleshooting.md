# Troubleshooting Guide

Common issues and their solutions when working with this Sanity + Next.js project.

## Environment Variables

### "projectId can only contain only a-z, 0-9 and dashes"

**Problem**: Error when starting the application about invalid project ID.

**Cause**: Environment variables include quotes.

**Solution**:
```bash
# ❌ Wrong
NEXT_PUBLIC_SANITY_PROJECT_ID="7pbquh5r"

# ✅ Correct
NEXT_PUBLIC_SANITY_PROJECT_ID=7pbquh5r
```

### Missing Environment Variables

**Problem**: Application crashes or shows errors about missing configuration.

**Solution**: Ensure all required variables are set:

```bash
# apps/web/.env.local
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_READ_TOKEN=your-token

# apps/studio/.env.local
SANITY_STUDIO_PROJECT_ID=your-project-id
SANITY_STUDIO_DATASET=production
SANITY_STUDIO_TITLE="Your Site Title"
SANITY_STUDIO_PRESENTATION_URL=http://localhost:3000
```

## Preview Mode Issues

### Preview Not Working

**Problem**: Live preview doesn't show draft changes.

**Possible Causes & Solutions**:

1. **Missing API Token**
   ```bash
   # Ensure SANITY_API_READ_TOKEN is set with read permissions
   SANITY_API_READ_TOKEN=sk...
   ```

2. **Browser Blocking Cookies**
   - Enable third-party cookies for localhost
   - Try incognito/private mode
   - Check browser console for cookie errors

3. **Wrong Presentation URL**
   ```bash
   # Must match your frontend URL exactly
   SANITY_STUDIO_PRESENTATION_URL=http://localhost:3000
   ```

4. **Draft Mode Not Enabled**
   ```typescript
   // Check if draft mode is properly enabled
   const data = await loadQuery(query, params, {
     perspective: draftMode().isEnabled ? "previewDrafts" : "published",
   });
   ```

## TypeScript Errors

### Types Out of Sync

**Problem**: TypeScript errors after changing Sanity schemas.

**Solution**:
```bash
# Regenerate types
cd apps/studio
pnpm run type

# Restart TypeScript server in VSCode
Cmd/Ctrl + Shift + P → "TypeScript: Restart TS Server"
```

### Cannot Find Module Errors

**Problem**: Import errors for `@workspace/*` packages.

**Solution**:
```bash
# Clean install dependencies
rm -rf node_modules pnpm-lock.yaml
pnpm install

# Rebuild packages
pnpm build --filter="./packages/*"
```

## Build Errors

### Next.js Build Failures

**Problem**: Build fails with various errors.

**Common Solutions**:

1. **Clear Next.js Cache**
   ```bash
   rm -rf apps/web/.next
   pnpm build --filter=web
   ```

2. **Check for Missing Dependencies**
   ```bash
   # Ensure all imports are installed
   pnpm install
   ```

3. **Verify Environment Variables**
   - Build-time variables must be available during `pnpm build`
   - Use `.env.production` for production builds

### TurboRepo Cache Issues

**Problem**: Old cached results causing problems.

**Solution**:
```bash
# Clear TurboRepo cache
pnpm turbo prune

# Force rebuild without cache
pnpm build --force
```

## Sanity Studio Issues

### Studio Won't Start

**Problem**: Sanity Studio shows blank page or errors.

**Solutions**:

1. **Check Node Version**
   ```bash
   node --version  # Should be 18+
   ```

2. **Verify Project Configuration**
   ```bash
   cd apps/studio
   npx sanity debug
   ```

3. **Clear Module Cache**
   ```bash
   rm -rf node_modules/.cache
   pnpm install
   ```

### Schema Changes Not Reflected

**Problem**: New fields don't appear in Studio.

**Solution**:
1. Ensure schema is exported in `schemaTypes/index.ts`
2. Restart the Studio dev server
3. Hard refresh browser (Cmd/Ctrl + Shift + R)

### GROQ Queries Not Working

**Problem**: Queries return unexpected results.

**Debugging Steps**:

1. **Test in Vision Plugin**
   - Navigate to `http://localhost:3333/vision`
   - Test your query directly
   - Check for syntax errors

2. **Common Query Issues**
   ```groq
   // ❌ Wrong: Missing quotes
   *[_type == blog]
   
   // ✅ Correct
   *[_type == "blog"]
   
   // ❌ Wrong: Invalid reference expansion
   *[_type == "product"]{
     ...,
     category->
   }
   
   // ✅ Correct: Specify fields
   *[_type == "product"]{
     ...,
     "category": category->
   }
   ```

## Development Server Issues

### Port Already in Use

**Problem**: `EADDRINUSE` error when starting dev server.

**Solution**:
```bash
# Find process using port
lsof -i :3000  # or :3333 for Studio

# Kill the process
kill -9 <PID>

# Or use different port
pnpm --filter=web dev -- --port 3001
```

### Hot Reload Not Working

**Problem**: Changes don't reflect without manual refresh.

**Solutions**:

1. **Check File Watching Limits (Linux/WSL)**
   ```bash
   # Increase watchers
   echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
   sudo sysctl -p
   ```

2. **Disable Fast Refresh Temporarily**
   ```javascript
   // next.config.js
   module.exports = {
     reactStrictMode: false, // Try disabling
   }
   ```

## Deployment Issues

### Vercel Build Failures

**Problem**: Build works locally but fails on Vercel.

**Common Causes**:

1. **Missing Environment Variables**
   - Add all variables to Vercel dashboard
   - Include build-time variables

2. **Different Node Version**
   ```json
   // package.json
   {
     "engines": {
       "node": ">=18.0.0"
     }
   }
   ```

3. **Module Resolution**
   - Ensure all imports use correct casing
   - Linux is case-sensitive

### Sanity Studio Deploy Issues

**Problem**: `sanity deploy` fails.

**Solutions**:

1. **Login First**
   ```bash
   npx sanity login
   ```

2. **Check Permissions**
   - Ensure you have deploy access to the project

3. **Clear Auth Cache**
   ```bash
   npx sanity logout
   npx sanity login
   ```

## Performance Issues

### Slow Page Loads

**Problem**: Pages take too long to load.

**Debugging**:

1. **Check Query Performance**
   - Use Vision to time queries
   - Optimize projections
   - Limit returned fields

2. **Image Optimization**
   - Ensure using Sanity image pipeline
   - Set appropriate widths
   - Use blur placeholders

3. **Enable Caching**
   ```typescript
   // Check cache headers
   const data = await sanityFetch({
     query,
     params,
     tags: ['products'], // For revalidation
   });
   ```

## Common Error Messages

### "Cannot read properties of undefined"

Usually means data is missing. Add optional chaining:
```typescript
// ❌ Will error if product.category is undefined
product.category.name

// ✅ Safe access
product.category?.name
```

### "Invalid block type"

Missing component mapping in PageBuilder:
```typescript
// Ensure all block types have components
const BLOCK_COMPONENTS = {
  hero: HeroBlock,
  cta: CTABlock,
  // Add missing block type here
};
```

### "Failed to fetch"

Network or CORS issues:
1. Check if Sanity project is accessible
2. Verify API token permissions
3. Check browser network tab for details

## Getting Help

### Debugging Tools

1. **Sanity CLI Debug**
   ```bash
   npx sanity debug
   ```

2. **Next.js Debug Mode**
   ```bash
   NODE_OPTIONS='--inspect' pnpm --filter=web dev
   ```

3. **Verbose Logging**
   ```bash
   DEBUG=* pnpm dev
   ```

### Resources

- Check browser console for detailed errors
- Use React Developer Tools
- Enable source maps in production for better stack traces
- Join Sanity Community Slack for help