import type { Meta, StoryObj } from "@storybook/react";
import { ArticleCard } from "./article-card";
import { CardGrid } from "./card";

const meta = {
  title: "Design System/Article Card",
  component: ArticleCard,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
An article card component designed for blog posts and news articles:

- **Visual hierarchy**: Image, category badge, title, and metadata
- **Interactive**: Hover effects on both card and image
- **Accessible**: Proper alt text and semantic markup
- **Flexible**: Can be used with or without links
        `,
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof ArticleCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "Building Modern Web Applications with Next.js and TypeScript",
    category: "Engineering",
    date: "Dec 28, 2024",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80",
    imageAlt: "Code on a computer screen",
    href: "#",
  },
};

export const LongTitle: Story = {
  args: {
    title: "The Complete Guide to Building Scalable, Maintainable, and Performant Web Applications Using Modern JavaScript Frameworks and Best Practices",
    category: "Tutorial",
    date: "Dec 27, 2024",
    readTime: "12 min read",
    image: "https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=800&q=80",
    imageAlt: "Laptop with code",
    href: "#",
  },
};

export const GridOfArticles = {
  render: () => (
    <CardGrid cols={3} gap={6}>
      <ArticleCard
        title="Getting Started with AI Development"
        category="AI & ML"
        date="Dec 28, 2024"
        readTime="8 min read"
        image="https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80"
        href="#"
      />
      <ArticleCard
        title="Understanding React Server Components"
        category="React"
        date="Dec 27, 2024"
        readTime="6 min read"
        image="https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80"
        href="#"
      />
      <ArticleCard
        title="Deploy to Production with Confidence"
        category="DevOps"
        date="Dec 26, 2024"
        readTime="10 min read"
        image="https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=800&q=80"
        href="#"
      />
    </CardGrid>
  ),
};

export const DifferentCategories = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <ArticleCard
        title="Design Systems at Scale"
        category="Design"
        date="Today"
        readTime="4 min read"
        image="https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80"
        href="#"
      />
      <ArticleCard
        title="Performance Optimization Techniques"
        category="Performance"
        date="Yesterday"
        readTime="7 min read"
        image="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80"
        href="#"
      />
      <ArticleCard
        title="Security Best Practices for 2025"
        category="Security"
        date="2 days ago"
        readTime="9 min read"
        image="https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&q=80"
        href="#"
      />
      <ArticleCard
        title="Mobile-First Development Strategies"
        category="Mobile"
        date="3 days ago"
        readTime="5 min read"
        image="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&q=80"
        href="#"
      />
    </div>
  ),
};

export const WithoutLink: Story = {
  args: {
    title: "Static Article Card Without Link",
    category: "News",
    date: "Dec 25, 2024",
    readTime: "3 min read",
    image: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&q=80",
  },
};

export const ResponsiveGrid = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-4">Responsive 3-Column Grid</h3>
        <CardGrid cols={3} gap={6}>
          {Array.from({ length: 6 }, (_, i) => (
            <ArticleCard
              key={i}
              title={`Article ${i + 1}: Exploring Modern Web Development`}
              category={["Tutorial", "Guide", "News", "Update", "Feature", "Release"][i % 6] || "Tutorial"}
              date={`Dec ${28 - i}, 2024`}
              readTime={`${5 + i} min read`}
              image={`https://picsum.photos/seed/${i}/800/450`}
              href="#"
            />
          ))}
        </CardGrid>
      </div>
    </div>
  ),
};

// New stories showcasing the category badge system
export const WithNewCategorySystem: Story = {
  args: {
    title: "Building Modern React Apps with TypeScript and Next.js",
    articleType: {
      name: "Tutorial",
      color: "blue",
    },
    technologies: [
      { name: "React", overallRating: 1 },
      { name: "TypeScript", overallRating: 1 },
      { name: "Next.js", overallRating: 1 },
    ],
    date: "Dec 28, 2024",
    readTime: "8 min read",
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80",
    imageAlt: "React code on screen",
    href: "#",
  },
};

export const MixedTechnologyRatings: Story = {
  args: {
    title: "Framework Comparison: React vs Vue vs Angular in 2025",
    articleType: {
      name: "Review",
      color: "pink",
    },
    technologies: [
      { name: "React", overallRating: 1 },
      { name: "Vue.js", overallRating: 0 },
      { name: "Angular", overallRating: -1 },
      { name: "Svelte", overallRating: 1 },
      { name: "Solid.js", overallRating: 0 },
    ],
    maxTechnologies: 3,
    date: "Dec 27, 2024",
    readTime: "12 min read",
    image: "https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=800&q=80",
    imageAlt: "Multiple framework logos",
    href: "#",
  },
};

export const OnlyArticleType: Story = {
  args: {
    title: "The Future of Web Development: Trends to Watch",
    articleType: {
      name: "Opinion",
      color: "orange",
    },
    date: "Dec 26, 2024",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=800&q=80",
    imageAlt: "Futuristic web interface",
    href: "#",
  },
};

export const OnlyTechnologies: Story = {
  args: {
    title: "Deep Dive into Database Performance Optimization",
    technologies: [
      { name: "PostgreSQL", overallRating: 1 },
      { name: "Redis", overallRating: 1 },
      { name: "MongoDB", overallRating: 0 },
    ],
    date: "Dec 25, 2024",
    readTime: "15 min read",
    image: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&q=80",
    imageAlt: "Database visualization",
    href: "#",
  },
};

export const GridWithNewCategories = {
  render: () => (
    <CardGrid cols={2} gap={6}>
      <ArticleCard
        title="AI-Powered Development Tools That Will Change Your Workflow"
        articleType={{ name: "Deep Dive", color: "purple" }}
        technologies={[
          { name: "GitHub Copilot", overallRating: 1 },
          { name: "ChatGPT", overallRating: 1 },
          { name: "Claude", overallRating: 1 },
        ]}
        date="Dec 28, 2024"
        readTime="10 min read"
        image="https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80"
        href="#"
      />
      <ArticleCard
        title="Security Vulnerabilities in Popular npm Packages"
        articleType={{ name: "News", color: "red" }}
        technologies={[
          { name: "npm", overallRating: 0 },
          { name: "Node.js", overallRating: 1 },
          { name: "ESLint", overallRating: 1 },
        ]}
        date="Dec 27, 2024"
        readTime="7 min read"
        image="https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&q=80"
        href="#"
      />
      <ArticleCard
        title="Getting Started with Rust: A Beginner's Guide"
        articleType={{ name: "Guide", color: "indigo" }}
        technologies={[
          { name: "Rust", overallRating: 1 },
          { name: "Cargo", overallRating: 1 },
          { name: "WebAssembly", overallRating: 0 },
        ]}
        date="Dec 26, 2024"
        readTime="12 min read"
        image="https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80"
        href="#"
      />
      <ArticleCard
        title="Mobile Development in 2025: Native vs Cross-Platform"
        articleType={{ name: "Case Study", color: "green" }}
        technologies={[
          { name: "React Native", overallRating: 0 },
          { name: "Flutter", overallRating: 1 },
          { name: "Swift", overallRating: 1 },
          { name: "Kotlin", overallRating: 1 },
          { name: "Expo", overallRating: 0 },
        ]}
        maxTechnologies={3}
        date="Dec 25, 2024"
        readTime="14 min read"
        image="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&q=80"
        href="#"
      />
    </CardGrid>
  ),
};

export const BackwardCompatibility = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Old Category System (Backward Compatible)</h3>
        <CardGrid cols={2} gap={4}>
          <ArticleCard
            title="Legacy Article with Category Badge"
            category="Engineering"
            date="Dec 28, 2024"
            readTime="5 min read"
            image="https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=800&q=80"
            href="#"
          />
          <ArticleCard
            title="Another Legacy Article"
            category="Design"
            date="Dec 27, 2024"
            readTime="3 min read"
            image="https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80"
            href="#"
          />
        </CardGrid>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-4">New Category System</h3>
        <CardGrid cols={2} gap={4}>
          <ArticleCard
            title="Modern Article with Article Type + Technologies"
            articleType={{ name: "Tutorial", color: "blue" }}
            technologies={[
              { name: "React", overallRating: 1 },
              { name: "TypeScript", overallRating: 1 },
            ]}
            date="Dec 28, 2024"
            readTime="5 min read"
            image="https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80"
            href="#"
          />
          <ArticleCard
            title="Another Modern Article"
            articleType={{ name: "Review", color: "pink" }}
            technologies={[
              { name: "Figma", overallRating: 1 },
              { name: "Sketch", overallRating: 0 },
            ]}
            date="Dec 27, 2024"
            readTime="3 min read"
            image="https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80"
            href="#"
          />
        </CardGrid>
      </div>
    </div>
  ),
};