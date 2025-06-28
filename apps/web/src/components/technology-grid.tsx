import { cn } from "@workspace/ui/lib/utils";
import type { QueryTechnologiesDataResult } from "@/lib/sanity/sanity.types";
import { TechnologyCard } from "./technology-card";

interface TechnologyGridProps {
  technologies: QueryTechnologiesDataResult;
  columns?: 2 | 3 | 4;
  className?: string;
}

export function TechnologyGrid({
  technologies,
  columns = 3,
  className,
}: TechnologyGridProps) {
  if (!technologies || technologies.length === 0) {
    return null;
  }

  const gridCols = {
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
  };

  return (
    <div className={cn("grid gap-6", gridCols[columns], className)}>
      {technologies.map((technology) => (
        <TechnologyCard key={technology._id} technology={technology} />
      ))}
    </div>
  );
}
