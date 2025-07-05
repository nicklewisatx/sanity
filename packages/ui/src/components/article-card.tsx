import * as React from "react";
import { cn } from "@workspace/ui/lib/utils";
import { Card, CardContent } from "./card";
import { Badge } from "./badge";
import { Caption } from "./typography";
import { CategoryBadges } from "./category-badges";

export interface ArticleCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  category?: string; // Made optional to support new category system
  articleType?: {
    name: string;
    color: string;
  };
  technologies?: Array<{
    name: string;
    overallRating: -1 | 0 | 1;
  }>;
  date: string;
  readTime: string;
  image: string;
  imageAlt?: string;
  href?: string;
  maxTechnologies?: number;
}

export const ArticleCard = React.forwardRef<HTMLDivElement, ArticleCardProps>(
  ({ 
    className, 
    title, 
    category, 
    articleType, 
    technologies, 
    date, 
    readTime, 
    image, 
    imageAlt, 
    href, 
    maxTechnologies = 3,
    ...props 
  }, ref) => {
    const CardWrapper = href ? "a" : "div";
    const cardProps = href ? { href } : {};
    
    return (
      <Card
        ref={ref}
        variant="interactive"
        radius="lg"
        size="sm"
        className={cn("overflow-hidden group", className)}
        as={CardWrapper}
        {...cardProps}
        {...props}
      >
        <div className="aspect-[16/9] overflow-hidden -m-4 mb-0">
          <img
            src={image}
            alt={imageAlt || title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        
        <CardContent className="pt-4">
          {/* Support both old category system and new article type + technologies */}
          {(articleType || technologies?.length) ? (
            <CategoryBadges
              articleType={articleType}
              technologies={technologies}
              maxTechnologies={maxTechnologies}
              className="mb-3"
            />
          ) : category ? (
            <Badge variant="secondary" className="mb-3">
              {category}
            </Badge>
          ) : null}
          
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 line-clamp-2">
            {title}
          </h3>
          
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Caption>{date}</Caption>
            <span>•</span>
            <Caption>{readTime}</Caption>
          </div>
        </CardContent>
      </Card>
    );
  }
);
ArticleCard.displayName = "ArticleCard";