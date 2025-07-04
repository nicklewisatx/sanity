# Test Utilities Package - AI Context

This package provides shared testing utilities and helpers for the Sanity + Next.js monorepo.

**Last Updated by Claude:** 2025-07-03 - Initial documentation creation

## Purpose

The test-utils package centralizes common testing functionality to ensure consistent testing patterns across all packages and applications in the monorepo.

## Package Structure

```
test-utils/
├── src/
│   ├── index.ts          # Main exports
│   ├── api/              # API testing utilities
│   │   └── index.ts      # Mock request/response helpers
│   ├── ci/               # CI parity testing
│   │   ├── index.ts      # CI environment checks
│   │   └── ci-parity.test.ts  # CI/local consistency tests
│   └── sanity/           # Sanity-specific test helpers
│       └── index.ts      # Sanity mocks and utilities
├── package.json          # Package configuration
├── tsconfig.json         # TypeScript configuration
├── vitest.config.ts      # Vitest configuration
└── eslint.config.js      # ESLint rules
```

## Key Features

### API Testing Utilities

- Mock HTTP request/response objects
- Authentication helpers for testing protected routes
- Common API test scenarios and assertions

### CI Parity Testing

- Ensures tests behave consistently between local and CI environments
- Validates environment variable handling
- Checks for common CI/local discrepancies

### Sanity Test Helpers

- Mock Sanity client implementations
- GROQ query test utilities
- Schema validation helpers

## Usage Patterns

### Import Test Utilities

```typescript
import { mockRequest, mockResponse } from "@workspace/test-utils/api";
import { ensureCIParity } from "@workspace/test-utils/ci";
import { mockSanityClient } from "@workspace/test-utils/sanity";
```

### API Route Testing

```typescript
import { mockRequest, mockResponse } from "@workspace/test-utils/api";

test("API route handles request", async () => {
  const req = mockRequest({
    method: "POST",
    body: { data: "test" },
  });
  const res = mockResponse();

  await handler(req, res);

  expect(res.status).toHaveBeenCalledWith(200);
});
```

### CI Parity Checks

```typescript
import { ensureCIParity } from "@workspace/test-utils/ci";

describe("Environment consistency", () => {
  ensureCIParity({
    requiredEnvVars: ["NODE_ENV", "SANITY_PROJECT_ID"],
    expectedBehavior: "consistent-across-environments",
  });
});
```

## Integration with Other Packages

- Used by `apps/web` for API route testing
- Used by `apps/studio` for schema validation tests
- Used by `packages/ui` for component testing utilities
- Provides base configuration for consistent test environments

## Development Guidelines

1. **Keep Utilities Generic**: Test helpers should be reusable across different contexts
2. **Avoid Package Dependencies**: Minimize dependencies to prevent circular references
3. **Document Helper Functions**: Include JSDoc comments for all exported utilities
4. **Test the Test Utils**: Ensure test utilities themselves are well-tested
5. **Version Carefully**: Breaking changes affect all consuming packages

## Common Test Patterns

### Mocking Next.js

- Mock `next/headers` for cookie/header testing
- Mock `next/navigation` for routing tests
- Mock `next/cache` for caching behavior

### Mocking External Services

- Sanity client responses
- OpenTelemetry spans
- HTTP fetch requests

### Test Data Factories

- Generate consistent test data
- Create valid Sanity documents
- Build mock API responses

## Future Enhancements

- Visual regression testing utilities
- Performance testing helpers
- Accessibility testing utilities
- Snapshot testing improvements

Remember: Good test utilities make writing tests easier and more consistent across the entire monorepo!
