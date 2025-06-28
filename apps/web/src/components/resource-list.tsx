import { Badge } from "@workspace/ui/components/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { ExternalLink } from "lucide-react";
import type { QueryResourcesDataResult } from "@/lib/sanity/sanity.types";
import { TechnologyCard } from "./technology-card";
import { RichText } from "./richtext";

type Resource = NonNullable<QueryResourcesDataResult>[number];

interface ResourceListProps {
  resources: QueryResourcesDataResult;
  showTechnology?: boolean;
}

export function ResourceList({
  resources,
  showTechnology = true,
}: ResourceListProps) {
  if (!resources || resources.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-8">
        No resources available yet.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {resources.map((resource) => (
        <ResourceCard
          key={resource._id}
          resource={resource}
          showTechnology={showTechnology}
        />
      ))}
    </div>
  );
}

interface ResourceCardProps {
  resource: Resource;
  showTechnology?: boolean;
}

function ResourceCard({ resource, showTechnology = true }: ResourceCardProps) {
  const formattedDate = resource.date
    ? new Date(resource.date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <Card className="group hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="flex items-center gap-2">
              {resource.title}
              <ExternalLink className="h-4 w-4 text-muted-foreground" />
            </CardTitle>
            {formattedDate && (
              <CardDescription>{formattedDate}</CardDescription>
            )}
          </div>
          {showTechnology && resource.technology && (
            <div className="ml-4">
              <TechnologyBadge technology={resource.technology} />
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {resource.description && (
          <div className="prose prose-sm dark:prose-invert mb-4">
            <RichText richText={resource.description} />
          </div>
        )}

        {resource.tags && resource.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {resource.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        <a
          href={resource.link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
        >
          View Resource
          <ExternalLink className="h-3 w-3" />
        </a>
      </CardContent>
    </Card>
  );
}

function TechnologyBadge({
  technology,
}: {
  technology: Resource["technology"];
}) {
  if (!technology) return null;

  const buzzRating = technology.buzzRating as
    | "bummer"
    | "meh"
    | "good"
    | "exciting"
    | "fire"
    | undefined;

  const buzzRatingColors = {
    bummer: "text-red-600",
    meh: "text-gray-600",
    good: "text-green-600",
    exciting: "text-blue-600",
    fire: "text-orange-600",
  };

  return (
    <div className="flex items-center gap-2">
      <Badge variant="outline">{technology.title}</Badge>
      {buzzRating && (
        <span className={`text-sm ${buzzRatingColors[buzzRating]}`}>
          {buzzRating === "fire" && "🔥"}
          {buzzRating === "exciting" && "🎉"}
          {buzzRating === "good" && "👍"}
          {buzzRating === "meh" && "😐"}
          {buzzRating === "bummer" && "👎"}
        </span>
      )}
    </div>
  );
}
