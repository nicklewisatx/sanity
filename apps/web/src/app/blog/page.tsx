import { BlogCard } from "@/components/blog-card";
import { BlogHero } from "@/components/blog-hero";
import { PageBuilder } from "@/components/pagebuilder";
import { sanityFetch } from "@/lib/sanity/fetch-with-tracing";
import { queryBlogIndexPageData } from "@/lib/sanity/query";
import { getSEOMetadata } from "@/lib/seo";

async function fetchBlogIndexData() {
  return await sanityFetch({
    query: queryBlogIndexPageData,
  });
}

export async function generateMetadata() {
  const { data: blogIndexData } = await fetchBlogIndexData();
  return getSEOMetadata(
    blogIndexData
      ? {
          title: blogIndexData?.title ?? blogIndexData?.seoTitle ?? "Blog",
          description:
            blogIndexData?.description ?? 
            blogIndexData?.seoDescription ?? 
            "Read our latest blog posts and insights.",
          slug: blogIndexData?.slug,
          contentId: blogIndexData?._id,
          contentType: blogIndexData?._type,
        }
      : {},
  );
}

export default async function BlogPage() {
  const { data: blogIndexData } = await fetchBlogIndexData();

  if (!blogIndexData) {
    return <div>No blog data found</div>;
  }

  const { _id, _type, pageBuilder, blogs = [] } = blogIndexData;
  
  // Get the latest article (first in the ordered array from Sanity)
  const [latestArticle, ...remainingArticles] = blogs;

  return (
    <main className="bg-background">
      {/* Hero Section featuring the Latest Article */}
      {latestArticle && (
        <BlogHero 
          blog={latestArticle}
          id={_id}
          type={_type}
        />
      )}

      {/* Page Builder Content (if any) */}
      {pageBuilder && pageBuilder.length > 0 && (
        <PageBuilder pageBuilder={pageBuilder} id={_id} type={_type} />
      )}

      {/* Remaining Blog Cards */}
      {remainingArticles.length > 0 && (
        <div className="container mx-auto px-4 md:px-6 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {remainingArticles.map((blog: typeof remainingArticles[0], index: number) => (
              <BlogCard 
                key={blog._id} 
                blog={blog}
                index={index + 1} // +1 because index 0 is the hero blog
                parentId={_id}
                parentType={_type}
              />
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
