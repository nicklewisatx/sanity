import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { HeroBlock } from "@/components/sections/hero";

describe("HeroBlock", () => {
  it("renders without crashing", () => {
    const { container } = render(
      <HeroBlock _type="hero" title="Test Hero Title" buttons={[]} />,
    );
    expect(container).toBeTruthy();
  });

  it("displays title", () => {
    const { getByText } = render(
      <HeroBlock _type="hero" title="Welcome to our site" buttons={[]} />,
    );

    expect(getByText("Welcome to our site")).toBeInTheDocument();
  });

  it("renders buttons when provided", () => {
    const { getByText } = render(
      <HeroBlock
        _type="hero"
        title="Test Hero"
        buttons={[
          {
            _key: "button1",
            text: "Get Started",
            href: "/get-started",
            variant: "default" as const,
          },
        ]}
      />,
    );

    expect(getByText("Get Started")).toBeInTheDocument();
  });
});
