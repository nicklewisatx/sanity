"use client";
import { useOptimistic } from "@sanity/visual-editing/react";
import { createDataAttribute, type SanityDocument } from "next-sanity";
import Link from "next/link";

import { Hero } from "@workspace/ui/components/hero";
import { Button } from "@workspace/ui/components/button";
import { dataset, projectId, studioUrl } from "@/lib/sanity/api";
import type { QueryBlogIndexPageDataResult } from "@/lib/sanity/sanity.types";
import { SanityImage } from "./sanity-image";

type Blog = NonNullable<
  NonNullable<QueryBlogIndexPageDataResult>["blogs"]
>[number];

interface BlogHeroProps {
  blog: Blog;
  id: string;
  type: string;
}

type BlogData = {
  _id: string;
  _type: string;
  blogs?: Blog[];
};

export function BlogHero({ blog: initialBlog, id, type }: BlogHeroProps) {
  // Use optimistic updates for visual editing
  const blog = useOptimistic<Blog, SanityDocument<BlogData>>(
    initialBlog,
    (currentBlog, action) => {
      if (action.id === id && action.document.blogs?.[0]) {
        return action.document.blogs[0];
      }
      return currentBlog;
    },
  );

  // Use blog image or fallback to default
  const heroBackgroundImage = blog.image?.asset
    ? `https://cdn.sanity.io/images/${projectId}/${dataset}/${blog.image.asset._ref?.replace('image-', '').replace('-jpg', '.jpg').replace('-png', '.png')}?w=1920&h=1080&fit=crop`
    : "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1920&h=1080&fit=crop";

  return (
    <div
      data-sanity={createDataAttribute({
        id: id,
        baseUrl: studioUrl,
        projectId: projectId,
        dataset: dataset,
        type: type,
        path: "blogs[0]",
      }).toString()}
    >
      <Hero
        variant="background-image"
        size="sm"
        alignment="left"
        backgroundImage={heroBackgroundImage}
        overlay={true}
        subtitle="Article"
        title={blog.title || ""}
        description={blog.description || ""}
      >
        <Button asChild variant="default" size="lg">
          <Link href={`/blog/${blog.slug}`}>Read More</Link>
        </Button>
      </Hero>
    </div>
  );
}