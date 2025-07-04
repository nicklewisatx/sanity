import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Hero } from "./hero";

describe("Hero", () => {
  it("renders with default variant", () => {
    render(<Hero title="Test Hero" description="Test description" />);
    
    expect(screen.getByText("Test Hero")).toBeInTheDocument();
    expect(screen.getByText("Test description")).toBeInTheDocument();
  });

  it("renders with background image", () => {
    const { container } = render(
      <Hero
        title="Hero with Background"
        backgroundImage="https://example.com/image.jpg"
        overlay={true}
      />
    );
    
    const backgroundDiv = container.querySelector('[style*="background-image"]');
    expect(backgroundDiv).toBeInTheDocument();
    expect(backgroundDiv).toHaveStyle({
      backgroundImage: 'url(https://example.com/image.jpg)',
    });
    
    const overlay = container.querySelector('.bg-black\\/50');
    expect(overlay).toBeInTheDocument();
  });

  it("renders with background-image variant", () => {
    const { container } = render(
      <Hero
        title="Background Image Variant"
        variant="background-image"
        backgroundImage="https://example.com/hero.jpg"
      />
    );
    
    expect(screen.getByText("Background Image Variant")).toBeInTheDocument();
    
    const section = container.querySelector('section');
    expect(section).toHaveClass('text-white');
  });

  it("renders actions correctly", () => {
    render(
      <Hero
        title="Hero with Actions"
        actions={[
          { text: "Primary Action", variant: "default" },
          { text: "Secondary Action", variant: "outline" },
        ]}
      />
    );
    
    expect(screen.getByText("Primary Action")).toBeInTheDocument();
    expect(screen.getByText("Secondary Action")).toBeInTheDocument();
  });
});