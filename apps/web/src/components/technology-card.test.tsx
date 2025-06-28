import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { TechnologyCard } from "./technology-card";
import type { QueryTechnologiesDataResult } from "@/lib/sanity/sanity.types";

describe("TechnologyCard", () => {
  const mockTechnology: NonNullable<QueryTechnologiesDataResult>[number] = {
    _id: "1",
    _type: "technology",
    title: "React",
    slug: { current: "react", _type: "slug" },
    tags: ["frontend", "javascript"],
    description: null,
    logo: null,
    homepage: "https://react.dev",
    buzzRating: "fire",
  };

  it("renders without crashing", () => {
    const { container } = render(
      <TechnologyCard technology={mockTechnology} />,
    );
    expect(container).toBeTruthy();
  });

  it("displays technology title", () => {
    const { getByText } = render(
      <TechnologyCard technology={mockTechnology} />,
    );
    expect(getByText("React")).toBeInTheDocument();
  });

  it("displays buzz rating badge with correct styling", () => {
    const { getByText } = render(
      <TechnologyCard technology={mockTechnology} />,
    );
    const badge = getByText("🔥 Fire");
    expect(badge).toBeInTheDocument();
    expect(badge.className).toContain("bg-orange-100");
  });

  it("displays tags", () => {
    const { getByText } = render(
      <TechnologyCard technology={mockTechnology} />,
    );
    expect(getByText("frontend")).toBeInTheDocument();
    expect(getByText("javascript")).toBeInTheDocument();
  });

  it("displays homepage link", () => {
    const { getByText } = render(
      <TechnologyCard technology={mockTechnology} />,
    );
    const link = getByText("Visit Homepage →");
    expect(link).toBeInTheDocument();
    expect(link.closest("a")).toHaveAttribute("href", "https://react.dev");
    expect(link.closest("a")).toHaveAttribute("target", "_blank");
  });

  it("handles missing buzz rating", () => {
    const techWithoutRating = { ...mockTechnology, buzzRating: null };
    const { queryByText } = render(
      <TechnologyCard technology={techWithoutRating} />,
    );
    // Should not show any buzz rating badge
    expect(queryByText("🔥 Fire")).not.toBeInTheDocument();
  });

  it("handles missing tags", () => {
    const techWithoutTags = { ...mockTechnology, tags: null };
    const { container } = render(
      <TechnologyCard technology={techWithoutTags} />,
    );
    expect(container.textContent).not.toContain("frontend");
  });

  it("handles missing homepage", () => {
    const techWithoutHomepage = { ...mockTechnology, homepage: null };
    const { queryByText } = render(
      <TechnologyCard technology={techWithoutHomepage} />,
    );
    expect(queryByText("Visit Homepage →")).not.toBeInTheDocument();
  });
});
