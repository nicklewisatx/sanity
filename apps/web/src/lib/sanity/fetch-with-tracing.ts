import type { Span } from "@opentelemetry/api";
import { withSpan } from "@workspace/observability";
import type { QueryParams } from "next-sanity";

import { sanityFetch as originalSanityFetch } from "./live";

/**
 * Wrapper around sanityFetch that adds OpenTelemetry tracing
 */
export async function sanityFetch<T = any>(options: {
  query: string;
  params?: QueryParams;
  tags?: string[];
  stega?: boolean;
}): Promise<T> {
  const { query, params = {}, tags, stega } = options;

  return withSpan(
    "sanity.fetch",
    async (span: Span) => {
      // Add attributes to the span
      span.setAttributes({
        "sanity.query": query.slice(0, 200), // Truncate long queries
        "sanity.params": JSON.stringify(params).slice(0, 200),
        "sanity.tags": tags?.join(",") || "",
      });

      const result = (await originalSanityFetch({
        query,
        params,
        tags,
        stega,
      })) as T;

      // Add result metadata
      if (result && typeof result === "object") {
        if (Array.isArray(result)) {
          span.setAttribute("sanity.result.count", result.length);
        }
        span.setAttribute(
          "sanity.result.type",
          Array.isArray(result) ? "array" : "object",
        );
      }

      return result;
    },
    {
      attributes: {
        "db.system": "sanity",
        "db.operation": "query",
      },
    },
  );
}

// Re-export SanityLive
export { SanityLive } from "./live";
