import type { PagebuilderType } from "@/types";
import { TechnologyGrid } from "../technology-grid";

type TechnologyShowcaseProps = PagebuilderType<"technologyShowcase">;

export function TechnologyShowcase({
  title,
  subtitle,
  technologies,
  columns = 3,
}: TechnologyShowcaseProps) {
  if (!technologies || technologies.length === 0) {
    return null;
  }

  return (
    <section className="py-16">
      <div className="container">
        {(title || subtitle) && (
          <div className="mb-8 text-center">
            {title && (
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="mt-2 text-lg text-muted-foreground">{subtitle}</p>
            )}
          </div>
        )}
        <TechnologyGrid
          technologies={technologies}
          columns={columns as 2 | 3 | 4}
        />
      </div>
    </section>
  );
}
