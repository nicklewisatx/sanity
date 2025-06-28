import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { TechnologyShowcase } from "./technology-showcase";
import type { PagebuilderType } from "@/types";

describe("TechnologyShowcase", () => {
  const mockProps: PagebuilderType<"technologyShowcase"> = {
    _type: "technologyShowcase",
    title: "Our Tech Stack",
    subtitle: "Technologies we love and use",
    technologies: [
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
        title: "TypeScript",
        slug: { current: "typescript", _type: "slug" },
        tags: ["language"],
        description: null,
        logo: null,
        homepage: "https://typescriptlang.org",
        buzzRating: "good",
      },
    ],
    columns: 3,
  };

  it("renders without crashing", () => {
    const { container } = render(<TechnologyShowcase {...mockProps} />);
    expect(container).toBeTruthy();
  });

  it("displays title and subtitle", () => {
    const { getByText } = render(<TechnologyShowcase {...mockProps} />);
    expect(getByText("Our Tech Stack")).toBeInTheDocument();
    expect(getByText("Technologies we love and use")).toBeInTheDocument();
  });

  it("renders technology cards", () => {
    const { getByText } = render(<TechnologyShowcase {...mockProps} />);
    expect(getByText("React")).toBeInTheDocument();
    expect(getByText("TypeScript")).toBeInTheDocument();
  });

  it("renders without title", () => {
    const propsWithoutTitle = { ...mockProps, title: undefined };
    const { container, queryByText } = render(
      <TechnologyShowcase {...propsWithoutTitle} />,
    );
    expect(container).toBeTruthy();
    expect(queryByText("Our Tech Stack")).not.toBeInTheDocument();
  });

  it("renders without subtitle", () => {
    const propsWithoutSubtitle = { ...mockProps, subtitle: undefined };
    const { container, queryByText } = render(
      <TechnologyShowcase {...propsWithoutSubtitle} />,
    );
    expect(container).toBeTruthy();
    expect(queryByText("Technologies we love and use")).not.toBeInTheDocument();
  });

  it("renders nothing when technologies array is empty", () => {
    const propsWithEmptyTech = { ...mockProps, technologies: [] };
    const { container } = render(
      <TechnologyShowcase {...propsWithEmptyTech} />,
    );
    expect(container.firstChild).toBeNull();
  });

  it("renders nothing when technologies is undefined", () => {
    const propsWithNoTech = { ...mockProps, technologies: undefined };
    const { container } = render(<TechnologyShowcase {...propsWithNoTech} />);
    expect(container.firstChild).toBeNull();
  });

  it("passes columns prop correctly", () => {
    const propsWithTwoColumns = { ...mockProps, columns: 2 as const };
    const { container } = render(
      <TechnologyShowcase {...propsWithTwoColumns} />,
    );
    const grid = container.querySelector('[class*="grid"]');
    expect(grid?.className).toContain("md:grid-cols-2");
  });

  it("uses default columns when not specified", () => {
    const propsWithoutColumns = { ...mockProps, columns: undefined };
    const { container } = render(
      <TechnologyShowcase {...propsWithoutColumns} />,
    );
    const grid = container.querySelector('[class*="grid"]');
    expect(grid?.className).toContain("lg:grid-cols-3");
  });
});
