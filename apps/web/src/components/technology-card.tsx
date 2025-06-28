import { Badge } from "@workspace/ui/components/badge";
import { cn } from "@workspace/ui/lib/utils";
import Link from "next/link";
import type { QueryTechnologiesDataResult } from "@/lib/sanity/sanity.types";
import { SanityImage } from "./sanity-image";

type Technology = NonNullable<QueryTechnologiesDataResult>[number];

interface TechnologyCardProps {
  technology: Technology;
  className?: string;
}

const buzzRatingStyles = {
  bummer: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  meh: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
  good: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  exciting: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  fire: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
};

const buzzRatingLabels = {
  bummer: "👎 Bummer",
  meh: "😐 Meh",
  good: "👍 Good",
  exciting: "🎉 Exciting",
  fire: "🔥 Fire",
};

export function TechnologyCard({ technology, className }: TechnologyCardProps) {
  const buzzRating = technology.buzzRating as keyof typeof buzzRatingStyles;

  return (
    <article
      className={cn(
        "group relative overflow-hidden rounded-lg border bg-card transition-all hover:shadow-lg",
        className,
      )}
    >
      <div className="p-6">
        <Link
          href={`/technologies/${technology.slug?.current}`}
          className="block"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="mb-2 flex items-center gap-2">
                {technology.logo && (
                  <div className="relative h-12 w-12 overflow-hidden rounded-md bg-muted">
                    <SanityImage
                      asset={technology.logo}
                      className="h-full w-full object-contain"
                      width={48}
                      height={48}
                    />
                  </div>
                )}
                <h3 className="text-xl font-semibold tracking-tight">
                  {technology.title}
                </h3>
              </div>

              {buzzRating && (
                <Badge
                  className={cn("mb-3", buzzRatingStyles[buzzRating])}
                  variant="secondary"
                >
                  {buzzRatingLabels[buzzRating]}
                </Badge>
              )}

              {technology.tags && technology.tags.length > 0 && (
                <div className="mb-3 flex flex-wrap gap-1">
                  {technology.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        </Link>

        {technology.homepage && (
          <div className="mt-4 text-sm text-muted-foreground">
            <a
              href={technology.homepage}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground"
            >
              Visit Homepage →
            </a>
          </div>
        )}
      </div>
    </article>
  );
}
