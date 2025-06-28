import { describe, expect, it } from "vitest";

import {
  queryBlogIndexPageData,
  queryBlogPaths,
  queryBlogSlugPageData,
  queryHomePageData,
  querySlugPageData,
  querySlugPagePaths,
} from "./query";

describe("GROQ Queries", () => {
  it("should have valid home page query", () => {
    expect(queryHomePageData).toBeDefined();
    expect(queryHomePageData).toContain(
      '*[_type == "homePage" && _id == "homePage"][0]',
    );
    expect(queryHomePageData).toContain("pageBuilder");
  });

  it("should have valid slug page query with parameter", () => {
    expect(querySlugPageData).toBeDefined();
    expect(querySlugPageData).toContain(
      '*[_type == "page" && slug.current == $slug][0]',
    );
    expect(querySlugPageData).toContain("pageBuilder");
  });

  it("should have valid blog index query", () => {
    expect(queryBlogIndexPageData).toBeDefined();
    expect(queryBlogIndexPageData).toContain('*[_type == "blogIndex"][0]');
    expect(queryBlogIndexPageData).toContain('*[_type == "blog"');
  });

  it("should have valid blog slug query with parameter", () => {
    expect(queryBlogSlugPageData).toBeDefined();
    expect(queryBlogSlugPageData).toContain(
      '*[_type == "blog" && slug.current == $slug][0]',
    );
    expect(queryBlogSlugPageData).toContain("authors");
    expect(queryBlogSlugPageData).toContain("richText");
  });

  it("should have valid path queries", () => {
    expect(queryBlogPaths).toContain(
      '*[_type == "blog" && defined(slug.current)].slug.current',
    );
    expect(querySlugPagePaths).toContain(
      '*[_type == "page" && defined(slug.current)].slug.current',
    );
  });

  it("should include image fragments with proper fields", () => {
    expect(queryHomePageData).toContain("image{");
    expect(queryHomePageData).toContain("asset->");
    expect(queryHomePageData).toContain("blurData");
    expect(queryHomePageData).toContain("dominantColor");
  });
});
