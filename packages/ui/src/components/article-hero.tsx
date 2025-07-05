import * as React from "react";
import { cn } from "@workspace/ui/lib/utils";
import { Badge } from "./badge";
import { Caption } from "./typography";
import { Button } from "./button";

export interface ArticleHeroProps extends React.HTMLAttributes<HTMLElement> {
  title: string;
  category: string;
  date: string;
  readTime: string;
  image: string;
  imageAlt?: string;
  excerpt?: string;
  href?: string;
  variant?: "default" | "overlay" | "split";
}

export const ArticleHero = React.forwardRef<HTMLElement, ArticleHeroProps>(
  (
    {
      className,
      title,
      category,
      date,
      readTime,
      image,
      imageAlt,
      excerpt,
      href,
      variant = "default",
      ...props
    },
    ref
  ) => {
    if (variant === "split") {
      return (
        <section
          ref={ref}
          className={cn(
            "relative overflow-hidden bg-white dark:bg-gray-900",
            className
          )}
          {...props}
        >
          <div className="container mx-auto px-4 md:px-6 py-12 md:py-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
              <div className="order-2 lg:order-1">
                <Badge variant="secondary" className="mb-4">
                  {category}
                </Badge>
                
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                  {title}
                </h1>
                
                {excerpt && (
                  <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
                    {excerpt}
                  </p>
                )}
                
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-8">
                  <Caption>{date}</Caption>
                  <span>•</span>
                  <Caption>{readTime}</Caption>
                </div>
                
                {href && (
                  <Button variant="primary" size="lg" asChild>
                    <a href={href}>Read Article →</a>
                  </Button>
                )}
              </div>
              
              <div className="order-1 lg:order-2">
                <div className="aspect-[4/3] overflow-hidden rounded-xl">
                  <img
                    src={image}
                    alt={imageAlt || title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      );
    }
    
    if (variant === "overlay") {
      return (
        <section
          ref={ref}
          className={cn(
            "relative h-[600px] overflow-hidden bg-gray-900",
            className
          )}
          {...props}
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${image})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30" />
          </div>
          
          <div className="relative h-full container mx-auto px-4 md:px-6 flex items-end pb-12 md:pb-16">
            <div className="max-w-3xl">
              <Badge variant="secondary" className="mb-4">
                {category}
              </Badge>
              
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                {title}
              </h1>
              
              {excerpt && (
                <p className="text-lg text-gray-200 mb-6">
                  {excerpt}
                </p>
              )}
              
              <div className="flex items-center gap-2 text-sm text-gray-300 mb-8">
                <Caption>{date}</Caption>
                <span>•</span>
                <Caption>{readTime}</Caption>
              </div>
              
              {href && (
                <Button variant="secondary" size="lg" asChild>
                  <a href={href}>Read Article →</a>
                </Button>
              )}
            </div>
          </div>
        </section>
      );
    }
    
    // Default variant
    return (
      <section
        ref={ref}
        className={cn(
          "relative overflow-hidden bg-white dark:bg-gray-900",
          className
        )}
        {...props}
      >
        <div className="container mx-auto px-4 md:px-6 py-12 md:py-16">
          <div className="max-w-4xl mx-auto">
            <div className="aspect-[21/9] overflow-hidden rounded-xl mb-8">
              <img
                src={image}
                alt={imageAlt || title}
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="text-center">
              <Badge variant="secondary" className="mb-4">
                {category}
              </Badge>
              
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                {title}
              </h1>
              
              {excerpt && (
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
                  {excerpt}
                </p>
              )}
              
              <div className="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-8">
                <Caption>{date}</Caption>
                <span>•</span>
                <Caption>{readTime}</Caption>
              </div>
              
              {href && (
                <Button variant="primary" size="lg" asChild>
                  <a href={href}>Read Article →</a>
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>
    );
  }
);
ArticleHero.displayName = "ArticleHero";