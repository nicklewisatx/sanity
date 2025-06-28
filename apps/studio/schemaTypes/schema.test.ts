import { describe, it, expect } from "vitest";
import { schemaTypes } from "./index";

describe("Sanity Schema", () => {
  it("should have valid schema types", () => {
    expect(schemaTypes).toBeDefined();
    expect(schemaTypes.length).toBeGreaterThan(0);
  });

  it("should have required document types", () => {
    const typeNames = schemaTypes.map((t) => t.name);
    expect(typeNames).toContain("blog");
    expect(typeNames).toContain("page");
    expect(typeNames).toContain("author");
    expect(typeNames).toContain("homePage");
    expect(typeNames).toContain("settings");
  });

  it("should have block types for page builder", () => {
    const typeNames = schemaTypes.map((t) => t.name);
    expect(typeNames).toContain("hero");
    expect(typeNames).toContain("cta");
    expect(typeNames).toContain("faqAccordion");
    expect(typeNames).toContain("featureCardsIcon");
  });

  it("should have shared object types", () => {
    const typeNames = schemaTypes.map((t) => t.name);
    expect(typeNames).toContain("button");
    expect(typeNames).toContain("customUrl");
    expect(typeNames).toContain("richText");
  });
});
