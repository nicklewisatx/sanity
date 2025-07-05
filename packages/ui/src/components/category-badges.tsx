import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Badge } from "./badge";
import { cn } from "@workspace/ui/lib/utils";

// Article Type Badge Variants - using contrasting colors from the design system
const articleTypeBadgeVariants = cva("", {
  variants: {
    color: {
      blue: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800",
      green: "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800",
      purple: "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-800",
      red: "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800",
      orange: "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/20 dark:text-orange-300 dark:border-orange-800",
      yellow: "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300 dark:border-yellow-800",
      pink: "bg-pink-100 text-pink-800 border-pink-200 dark:bg-pink-900/20 dark:text-pink-300 dark:border-pink-800",
      indigo: "bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-900/20 dark:text-indigo-300 dark:border-indigo-800",
      gray: "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-300 dark:border-gray-800",
    },
  },
  defaultVariants: {
    color: "blue",
  },
});

// Technology Badge Variants - distinctive styling
const technologyBadgeVariants = cva("", {
  variants: {
    rating: {
      thumbsUp: "bg-green-50 text-green-700 border-green-200 dark:bg-green-950/30 dark:text-green-400 dark:border-green-800",
      thumbsSideways: "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-950/30 dark:text-yellow-400 dark:border-yellow-800",
      thumbsDown: "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/30 dark:text-red-400 dark:border-red-800",
    },
  },
  defaultVariants: {
    rating: "thumbsSideways",
  },
});

export interface ArticleTypeBadgeProps extends VariantProps<typeof articleTypeBadgeVariants> {
  children: React.ReactNode;
  className?: string;
}

export interface TechnologyBadgeProps {
  children: React.ReactNode;
  className?: string;
  rating?: -1 | 0 | 1;
  showIcon?: boolean;
}

export interface CategoryBadgesProps extends React.HTMLAttributes<HTMLDivElement> {
  articleType?: {
    name: string;
    color: string;
  };
  technologies?: Array<{
    name: string;
    overallRating: -1 | 0 | 1;
  }>;
  maxTechnologies?: number;
}

// Article Type Badge Component
export function ArticleTypeBadge({ className, color, children }: ArticleTypeBadgeProps) {
  return (
    <Badge
      className={cn(
        articleTypeBadgeVariants({ color }),
        "font-medium",
        className
      )}
    >
      {children}
    </Badge>
  );
}

// Technology Badge Component
export function TechnologyBadge({ className, rating = 0, showIcon = true, children }: TechnologyBadgeProps) {
  const ratingVariant = rating === 1 ? "thumbsUp" : rating === -1 ? "thumbsDown" : "thumbsSideways";
  const ratingIcon = rating === 1 ? "👍" : rating === -1 ? "👎" : "👌";

  return (
    <Badge
      className={cn(
        technologyBadgeVariants({ rating: ratingVariant }),
        "font-medium",
        className
      )}
    >
      {showIcon && <span className="mr-1 text-xs">{ratingIcon}</span>}
      {children}
    </Badge>
  );
}

// Combined Category Badges Component
export function CategoryBadges({ className, articleType, technologies = [], maxTechnologies = 3, ...props }: CategoryBadgesProps) {
  const displayedTechnologies = technologies.slice(0, maxTechnologies);
  const remainingCount = technologies.length - maxTechnologies;

  return (
    <div
      className={cn("flex flex-wrap items-center gap-2", className)}
      {...props}
    >
      {articleType && (
        <ArticleTypeBadge color={articleType.color as "blue" | "green" | "purple" | "red" | "orange" | "yellow" | "pink" | "indigo" | "gray"}>
          {articleType.name}
        </ArticleTypeBadge>
      )}
      
      {displayedTechnologies.map((tech, index) => (
        <TechnologyBadge
          key={`${tech.name}-${index}`}
          rating={tech.overallRating}
        >
          {tech.name}
        </TechnologyBadge>
      ))}
      
      {remainingCount > 0 && (
        <Badge variant="outline" className="text-xs font-normal">
          +{remainingCount} more
        </Badge>
      )}
    </div>
  );
}

// Export all variants for external use
export { articleTypeBadgeVariants, technologyBadgeVariants };