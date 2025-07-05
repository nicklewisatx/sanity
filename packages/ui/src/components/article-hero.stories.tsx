import type { Meta, StoryObj } from "@storybook/react";
import { ArticleHero } from "./article-hero";

const meta = {
  title: "Design System/Article Hero",
  component: ArticleHero,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `
A hero component specifically designed for featured articles:

- **Three variants**: Default (centered), Overlay (text over image), Split (side-by-side)
- **Rich metadata**: Category badge, title, excerpt, date, and read time
- **Responsive design**: Adapts beautifully across all screen sizes
- **Call-to-action**: Optional button linking to the full article
        `,
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof ArticleHero>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "The Future of Web Development: What's Next in 2025",
    category: "Technology",
    date: "December 28, 2024",
    readTime: "12 min read",
    excerpt: "Explore the cutting-edge technologies and methodologies shaping the future of web development, from AI-powered tools to next-generation frameworks.",
    image: "https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=1600&q=80",
    imageAlt: "Futuristic technology visualization",
    href: "#",
  },
};

export const OverlayVariant: Story = {
  args: {
    variant: "overlay",
    title: "Building Scalable Applications with Modern Architecture",
    category: "Engineering",
    date: "December 27, 2024",
    readTime: "15 min read",
    excerpt: "Learn how to design and implement scalable architectures that can grow with your business needs.",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1600&q=80",
    imageAlt: "Server infrastructure",
    href: "#",
  },
};

export const SplitVariant: Story = {
  args: {
    variant: "split",
    title: "Mastering TypeScript: Advanced Patterns and Best Practices",
    category: "Tutorial",
    date: "December 26, 2024",
    readTime: "10 min read",
    excerpt: "Take your TypeScript skills to the next level with advanced patterns, type gymnastics, and real-world best practices.",
    image: "https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=1600&q=80",
    imageAlt: "TypeScript code on screen",
    href: "#",
  },
};

export const WithoutExcerpt: Story = {
  args: {
    title: "Quick Guide to Performance Optimization",
    category: "Performance",
    date: "December 25, 2024",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1600&q=80",
    imageAlt: "Performance metrics dashboard",
    href: "#",
  },
};

export const WithoutCTA: Story = {
  args: {
    title: "Understanding React Server Components",
    category: "React",
    date: "December 24, 2024",
    readTime: "8 min read",
    excerpt: "A deep dive into React Server Components and how they're changing the way we build React applications.",
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1600&q=80",
    imageAlt: "React logo visualization",
  },
};

export const LongTitle: Story = {
  args: {
    variant: "split",
    title: "The Complete Guide to Building, Testing, and Deploying Production-Ready Applications with Next.js, TypeScript, and Modern DevOps Practices",
    category: "Comprehensive Guide",
    date: "December 23, 2024",
    readTime: "25 min read",
    excerpt: "Everything you need to know about modern full-stack development in one comprehensive guide.",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1600&q=80",
    imageAlt: "Development workspace",
    href: "#",
  },
};

export const VariantComparison = {
  render: () => (
    <div className="space-y-8 bg-gray-50 dark:bg-gray-950">
      <ArticleHero
        variant="default"
        title="Default Variant: Centered Layout"
        category="Design System"
        date="Today"
        readTime="3 min read"
        excerpt="The default variant centers content below a wide hero image."
        image="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1600&q=80"
        href="#"
      />
      
      <ArticleHero
        variant="overlay"
        title="Overlay Variant: Text Over Image"
        category="Design System"
        date="Today"
        readTime="3 min read"
        excerpt="The overlay variant places text content over the hero image with a gradient."
        image="https://images.unsplash.com/photo-1559028012-481c04fa702d?w=1600&q=80"
        href="#"
      />
      
      <ArticleHero
        variant="split"
        title="Split Variant: Side-by-Side"
        category="Design System"
        date="Today"
        readTime="3 min read"
        excerpt="The split variant places content and image side-by-side on larger screens."
        image="https://images.unsplash.com/photo-1561736778-92e52a7769ef?w=1600&q=80"
        href="#"
      />
    </div>
  ),
};