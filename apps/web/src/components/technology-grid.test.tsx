import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { TechnologyGrid } from "./technology-grid";
import type { QueryTechnologiesDataResult } from "@/lib/sanity/sanity.types";

describe("TechnologyGrid", () => {
  const mockTechnologies: QueryTechnologiesDataResult = [
    {
      _id: "1",
      _type: "technology",
      title: "React",
      slug: { current: "react", _type: "slug" },
      tags: ["frontend"],
      description: null,
      logo: null,
      homepage: "https://react.dev",
      buzzRating: "fire",
    },
    {
      _id: "2",
      _type: "technology",
      title: "Next.js",
      slug: { current: "nextjs", _type: "slug" },
      tags: ["frontend", "framework"],
      description: null,
      logo: null,
      homepage: "https://nextjs.org",
      buzzRating: "exciting",
    },
  ];

  it("renders without crashing", () => {
    const { container } = render(
      <TechnologyGrid technologies={mockTechnologies} />,
    );
    expect(container).toBeTruthy();
  });

  it("renders all technologies", () => {
    const { getByText } = render(
      <TechnologyGrid technologies={mockTechnologies} />,
    );
    expect(getByText("React")).toBeInTheDocument();
    expect(getByText("Next.js")).toBeInTheDocument();
  });

  it("applies correct grid columns class", () => {
    const { container } = render(
      <TechnologyGrid technologies={mockTechnologies} columns={3} />,
    );
    const grid = container.querySelector("div");
    expect(grid?.className).toContain("lg:grid-cols-3");
  });

  it("handles 2 column layout", () => {
    const { container } = render(
      <TechnologyGrid technologies={mockTechnologies} columns={2} />,
    );
    const grid = container.querySelector("div");
    expect(grid?.className).toContain("md:grid-cols-2");
    expect(grid?.className).not.toContain("lg:grid-cols-3");
  });

  it("handles 4 column layout", () => {
    const { container } = render(
      <TechnologyGrid technologies={mockTechnologies} columns={4} />,
    );
    const grid = container.querySelector("div");
    expect(grid?.className).toContain("lg:grid-cols-4");
  });

  it("renders nothing when technologies array is empty", () => {
    const { container } = render(<TechnologyGrid technologies={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it("renders nothing when technologies is null", () => {
    const { container } = render(<TechnologyGrid technologies={null as any} />);
    expect(container.firstChild).toBeNull();
  });

  it("applies custom className", () => {
    const { container } = render(
      <TechnologyGrid
        technologies={mockTechnologies}
        className="custom-class"
      />,
    );
    const grid = container.querySelector("div");
    expect(grid?.className).toContain("custom-class");
  });
});
