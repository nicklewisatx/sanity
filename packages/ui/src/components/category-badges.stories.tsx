import type { Meta, StoryObj } from "@storybook/react";
import { CategoryBadges, ArticleTypeBadge, TechnologyBadge } from "./category-badges";

const meta = {
  title: "Design System/Category Badges",
  component: CategoryBadges,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof CategoryBadges>;

export default meta;
type Story = StoryObj<typeof meta>;

// Sample data for stories
const sampleArticleTypes = [
  { name: "Tutorial", color: "blue" },
  { name: "Deep Dive", color: "purple" },
  { name: "News", color: "green" },
  { name: "Opinion", color: "orange" },
  { name: "Review", color: "pink" },
  { name: "Guide", color: "indigo" },
  { name: "Case Study", color: "red" },
  { name: "Tips", color: "yellow" },
];

const sampleTechnologies: Array<{ name: string; overallRating: -1 | 0 | 1 }> = [
  { name: "React", overallRating: 1 },
  { name: "TypeScript", overallRating: 1 },
  { name: "Vue.js", overallRating: 0 },
  { name: "Angular", overallRating: -1 },
  { name: "Svelte", overallRating: 1 },
  { name: "Next.js", overallRating: 1 },
  { name: "Nuxt.js", overallRating: 0 },
  { name: "Remix", overallRating: 0 },
];

// Main stories
export const Default: Story = {
  args: {
    articleType: sampleArticleTypes[0],
    technologies: sampleTechnologies.slice(0, 3),
  },
};

export const FullExample: Story = {
  args: {
    articleType: { name: "Deep Dive", color: "purple" },
    technologies: [
      { name: "React", overallRating: 1 },
      { name: "TypeScript", overallRating: 1 },
      { name: "Next.js", overallRating: 1 },
      { name: "Tailwind", overallRating: 0 },
      { name: "Storybook", overallRating: 1 },
    ],
    maxTechnologies: 3,
  },
};

export const OnlyArticleType: Story = {
  args: {
    articleType: { name: "Tutorial", color: "blue" },
  },
};

export const OnlyTechnologies: Story = {
  args: {
    technologies: sampleTechnologies.slice(0, 4),
    maxTechnologies: 3,
  },
};

export const ManyTechnologies: Story = {
  args: {
    articleType: { name: "Guide", color: "indigo" },
    technologies: sampleTechnologies,
    maxTechnologies: 2,
  },
};

// Individual component stories
export const ArticleTypeBadges: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-sm font-medium">All Article Type Colors</h3>
        <div className="flex flex-wrap gap-2">
          {sampleArticleTypes.map((type) => (
            <ArticleTypeBadge key={type.name} color={type.color as any}>
              {type.name}
            </ArticleTypeBadge>
          ))}
        </div>
      </div>
    </div>
  ),
};

export const TechnologyBadges: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-sm font-medium">Technology Ratings</h3>
        <div className="flex flex-wrap gap-2">
          <TechnologyBadge rating={1}>Recommended</TechnologyBadge>
          <TechnologyBadge rating={0}>Neutral</TechnologyBadge>
          <TechnologyBadge rating={-1}>Not Recommended</TechnologyBadge>
        </div>
      </div>
      
      <div className="space-y-2">
        <h3 className="text-sm font-medium">With/Without Icons</h3>
        <div className="flex flex-wrap gap-2">
          <TechnologyBadge rating={1} showIcon={true}>React</TechnologyBadge>
          <TechnologyBadge rating={1} showIcon={false}>React (No Icon)</TechnologyBadge>
        </div>
      </div>
      
      <div className="space-y-2">
        <h3 className="text-sm font-medium">Popular Technologies</h3>
        <div className="flex flex-wrap gap-2">
          {sampleTechnologies.slice(0, 6).map((tech) => (
            <TechnologyBadge key={tech.name} rating={tech.overallRating}>
              {tech.name}
            </TechnologyBadge>
          ))}
        </div>
      </div>
    </div>
  ),
};

// Interactive examples
export const BlogPostExample: Story = {
  render: () => (
    <div className="max-w-md space-y-4">
      <div className="p-4 border rounded-lg">
        <CategoryBadges
          articleType={{ name: "Tutorial", color: "blue" }}
          technologies={[
            { name: "React", overallRating: 1 },
            { name: "TypeScript", overallRating: 1 },
            { name: "Tailwind", overallRating: 0 },
          ]}
          className="mb-3"
        />
        <h3 className="font-semibold text-lg mb-2">
          Building Modern React Apps with TypeScript
        </h3>
        <p className="text-gray-600 text-sm">
          Learn how to set up a production-ready React application with TypeScript, 
          including best practices for type safety and component architecture.
        </p>
      </div>
      
      <div className="p-4 border rounded-lg">
        <CategoryBadges
          articleType={{ name: "Review", color: "pink" }}
          technologies={[
            { name: "Vue.js", overallRating: 0 },
            { name: "Nuxt.js", overallRating: 0 },
            { name: "Vite", overallRating: 1 },
            { name: "Pinia", overallRating: 1 },
            { name: "Vitest", overallRating: 1 },
          ]}
          maxTechnologies={3}
          className="mb-3"
        />
        <h3 className="font-semibold text-lg mb-2">
          Vue.js 3 Ecosystem Review: Is It Ready for Production?
        </h3>
        <p className="text-gray-600 text-sm">
          A comprehensive review of the Vue.js 3 ecosystem, covering the latest tools 
          and libraries available for building modern web applications.
        </p>
      </div>
    </div>
  ),
};

// Accessibility and responsive examples
export const ResponsiveExample: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="max-w-xs">
        <h3 className="text-sm font-medium mb-2">Narrow Container</h3>
        <CategoryBadges
          articleType={{ name: "Deep Dive", color: "purple" }}
          technologies={sampleTechnologies.slice(0, 5)}
          maxTechnologies={2}
        />
      </div>
      
      <div className="max-w-lg">
        <h3 className="text-sm font-medium mb-2">Medium Container</h3>
        <CategoryBadges
          articleType={{ name: "Guide", color: "indigo" }}
          technologies={sampleTechnologies.slice(0, 5)}
          maxTechnologies={4}
        />
      </div>
      
      <div className="max-w-2xl">
        <h3 className="text-sm font-medium mb-2">Wide Container</h3>
        <CategoryBadges
          articleType={{ name: "Case Study", color: "red" }}
          technologies={sampleTechnologies}
          maxTechnologies={6}
        />
      </div>
    </div>
  ),
};