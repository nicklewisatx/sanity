import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { ResourceList } from "./resource-list";
import type { QueryResourcesDataResult } from "@/lib/sanity/sanity.types";

// Mock the RichText component
vi.mock("./richtext", () => ({
  RichText: ({ value }: any) => <div>{JSON.stringify(value)}</div>,
}));

describe("ResourceList", () => {
  const mockResources: QueryResourcesDataResult = [
    {
      _id: "1",
      _type: "resource",
      title: "React Documentation",
      slug: { current: "react-docs", _type: "slug" },
      link: "https://react.dev/docs",
      description: null,
      date: "2024-01-15T00:00:00Z",
      tags: ["documentation", "official"],
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
      title: "Next.js Tutorial",
      slug: { current: "nextjs-tutorial", _type: "slug" },
      link: "https://nextjs.org/learn",
      description: null,
      date: "2024-01-10T00:00:00Z",
      tags: ["tutorial"],
      technology: {
        _id: "tech2",
        _type: "technology",
        title: "Next.js",
        slug: { current: "nextjs", _type: "slug" },
        tags: null,
        description: null,
        logo: null,
        homepage: null,
        buzzRating: "exciting",
      },
    },
  ];

  it("renders without crashing", () => {
    const { container } = render(<ResourceList resources={mockResources} />);
    expect(container).toBeTruthy();
  });

  it("renders all resources", () => {
    const { getByText } = render(<ResourceList resources={mockResources} />);
    expect(getByText("React Documentation")).toBeInTheDocument();
    expect(getByText("Next.js Tutorial")).toBeInTheDocument();
  });

  it("displays formatted dates", () => {
    const { container } = render(<ResourceList resources={mockResources} />);
    // Check that dates are displayed (the exact date might vary by timezone)
    const text = container.textContent || "";
    // The dates should be formatted as "Month Day, Year"
    expect(text).toMatch(/January \d{1,2}, 2024/);
    expect(text).toMatch(/React Documentation.*January \d{1,2}, 2024/);
    expect(text).toMatch(/Next.js Tutorial.*January \d{1,2}, 2024/);
  });

  it("displays technology badges", () => {
    const { getByText } = render(<ResourceList resources={mockResources} />);
    expect(getByText("React")).toBeInTheDocument();
    expect(getByText("Next.js")).toBeInTheDocument();
  });

  it("displays resource tags", () => {
    const { getByText } = render(<ResourceList resources={mockResources} />);
    expect(getByText("documentation")).toBeInTheDocument();
    expect(getByText("official")).toBeInTheDocument();
    expect(getByText("tutorial")).toBeInTheDocument();
  });

  it("renders resource links", () => {
    const { getAllByText } = render(<ResourceList resources={mockResources} />);
    const links = getAllByText("View Resource");
    expect(links).toHaveLength(2);
    expect(links[0].closest("a")).toHaveAttribute(
      "href",
      "https://react.dev/docs",
    );
    expect(links[1].closest("a")).toHaveAttribute(
      "href",
      "https://nextjs.org/learn",
    );
  });

  it("hides technology when showTechnology is false", () => {
    const { queryByText } = render(
      <ResourceList resources={mockResources} showTechnology={false} />,
    );
    // Titles should still be there
    expect(queryByText("React Documentation")).toBeInTheDocument();
    // But technology names should not appear as badges
    expect(queryByText("React")).toBeNull();
    expect(queryByText("Next.js")).toBeNull();
  });

  it("displays empty state when no resources", () => {
    const { getByText } = render(<ResourceList resources={[]} />);
    expect(getByText("No resources available yet.")).toBeInTheDocument();
  });

  it("displays empty state when resources is null", () => {
    const { getByText } = render(<ResourceList resources={null as any} />);
    expect(getByText("No resources available yet.")).toBeInTheDocument();
  });

  it("handles resources without technology", () => {
    const resourcesWithoutTech = [
      { ...mockResources[0], technology: null as any },
    ];
    const { getByText, queryByText } = render(
      <ResourceList resources={resourcesWithoutTech} />,
    );
    expect(getByText("React Documentation")).toBeInTheDocument();
    // Should not crash and should not show technology badge
    expect(queryByText("🔥")).not.toBeInTheDocument();
  });

  it("displays buzz rating emojis correctly", () => {
    const { container } = render(<ResourceList resources={mockResources} />);
    expect(container.textContent).toContain("🔥"); // fire rating
    expect(container.textContent).toContain("🎉"); // exciting rating
  });
});
