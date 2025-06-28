import type { PagebuilderType } from "@/types";
import { ResourceList } from "../resource-list";

type ResourceSectionProps = PagebuilderType<"resourceSection">;

export function ResourceSection({
  title,
  subtitle,
  resources,
  showTechnology = true,
}: ResourceSectionProps) {
  return (
    <section className="py-16">
      <div className="container">
        {(title || subtitle) && (
          <div className="mb-8">
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
        <ResourceList resources={resources} showTechnology={showTechnology} />
      </div>
    </section>
  );
}
