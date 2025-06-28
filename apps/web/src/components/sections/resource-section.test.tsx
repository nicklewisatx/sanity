import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { ResourceSection } from "./resource-section";
import type { PagebuilderType } from "@/types";

// Mock the RichText component
vi.mock("../richtext", () => ({
  RichText: ({ value }: any) => <div>{JSON.stringify(value)}</div>,
}));

describe("ResourceSection", () => {
  const mockProps: PagebuilderType<"resourceSection"> = {
    _type: "resourceSection",
    title: "Learning Resources",
    subtitle: "Curated resources to help you learn",
    resources: [
      {
        _id: "1",
        _type: "resource",
        title: "React Documentation",
        slug: { current: "react-docs", _type: "slug" },
        link: "https://react.dev/docs",
        description: null,
        date: "2024-01-15T00:00:00Z",
        tags: ["documentation"],
        technology: {
          _id: "tech1",
          _type: "technology",
          title: "React",
          slug: { current: "react", _type: "slug" },
          tags: null,
          description: null,
          logo: null,
          homepage: null,
          buzzRating: "fire",
        },
      },
      {
        _id: "2",
        _type: "resource",
        title: "TypeScript Handbook",
        slug: { current: "ts-handbook", _type: "slug" },
        link: "https://typescriptlang.org/docs",
        description: null,
        date: "2024-01-10T00:00:00Z",
        tags: ["documentation", "handbook"],
        technology: {
          _id: "tech2",
          _type: "technology",
          title: "TypeScript",
          slug: { current: "typescript", _type: "slug" },
          tags: null,
          description: null,
          logo: null,
          homepage: null,
          buzzRating: "good",
        },
      },
    ],
    showTechnology: true,
  };

  it("renders without crashing", () => {
    const { container } = render(<ResourceSection {...mockProps} />);
    expect(container).toBeTruthy();
  });

  it("displays title and subtitle", () => {
    const { getByText } = render(<ResourceSection {...mockProps} />);
    expect(getByText("Learning Resources")).toBeInTheDocument();
    expect(
      getByText("Curated resources to help you learn"),
    ).toBeInTheDocument();
  });

  it("renders resource list", () => {
    const { getByText } = render(<ResourceSection {...mockProps} />);
    expect(getByText("React Documentation")).toBeInTheDocument();
    expect(getByText("TypeScript Handbook")).toBeInTheDocument();
  });

  it("renders without title", () => {
    const propsWithoutTitle = { ...mockProps, title: undefined };
    const { container, queryByText } = render(
      <ResourceSection {...propsWithoutTitle} />,
    );
    expect(container).toBeTruthy();
    expect(queryByText("Learning Resources")).not.toBeInTheDocument();
  });

  it("renders without subtitle", () => {
    const propsWithoutSubtitle = { ...mockProps, subtitle: undefined };
    const { container, queryByText } = render(
      <ResourceSection {...propsWithoutSubtitle} />,
    );
    expect(container).toBeTruthy();
    expect(
      queryByText("Curated resources to help you learn"),
    ).not.toBeInTheDocument();
  });

  it("passes showTechnology prop correctly", () => {
    const propsHideTech = { ...mockProps, showTechnology: false };
    const { container } = render(<ResourceSection {...propsHideTech} />);
    // Should still render resources but without technology badges
    expect(container.textContent).toContain("React Documentation");
  });

  it("uses default showTechnology value when not specified", () => {
    const propsWithoutShowTech = { ...mockProps, showTechnology: undefined };
    const { getByText } = render(<ResourceSection {...propsWithoutShowTech} />);
    // Should show technology badges by default
    expect(getByText("React")).toBeInTheDocument();
  });

  it("renders with empty resources array", () => {
    const propsWithEmptyResources = { ...mockProps, resources: [] };
    const { getByText } = render(
      <ResourceSection {...propsWithEmptyResources} />,
    );
    expect(getByText("No resources available yet.")).toBeInTheDocument();
  });

  it("renders without resources property", () => {
    const propsWithoutResources = { ...mockProps, resources: undefined };
    const { getByText } = render(
      <ResourceSection {...propsWithoutResources} />,
    );
    expect(getByText("No resources available yet.")).toBeInTheDocument();
  });
});
