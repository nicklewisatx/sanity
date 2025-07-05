// Category Configuration - Shared between Storybook and Sanity
// This file defines the canonical set of colors and article types that can be used
// across both the UI components and the Sanity Studio schemas

export const ARTICLE_TYPE_COLORS = {
  blue: {
    name: "Blue",
    value: "blue",
    description: "Technology, tutorials, development guides",
    storybook: "bg-blue-100 text-blue-800 border-blue-200",
    tailwind: "blue",
  },
  green: {
    name: "Green",
    value: "green", 
    description: "News, updates, success stories",
    storybook: "bg-green-100 text-green-800 border-green-200",
    tailwind: "green",
  },
  purple: {
    name: "Purple",
    value: "purple",
    description: "Deep dives, advanced topics, research",
    storybook: "bg-purple-100 text-purple-800 border-purple-200",
    tailwind: "purple",
  },
  red: {
    name: "Red",
    value: "red",
    description: "Breaking news, alerts, important updates",
    storybook: "bg-red-100 text-red-800 border-red-200",
    tailwind: "red",
  },
  orange: {
    name: "Orange",
    value: "orange",
    description: "Opinions, editorials, community content",
    storybook: "bg-orange-100 text-orange-800 border-orange-200",
    tailwind: "orange",
  },
  yellow: {
    name: "Yellow",
    value: "yellow",
    description: "Tips, quick wins, productivity",
    storybook: "bg-yellow-100 text-yellow-800 border-yellow-200",
    tailwind: "yellow",
  },
  pink: {
    name: "Pink",
    value: "pink",
    description: "Reviews, comparisons, evaluations",
    storybook: "bg-pink-100 text-pink-800 border-pink-200",
    tailwind: "pink",
  },
  indigo: {
    name: "Indigo",
    value: "indigo",
    description: "Guides, how-tos, step-by-step content",
    storybook: "bg-indigo-100 text-indigo-800 border-indigo-200",
    tailwind: "indigo",
  },
  gray: {
    name: "Gray",
    value: "gray",
    description: "Archive, legacy content, neutral topics",
    storybook: "bg-gray-100 text-gray-800 border-gray-200",
    tailwind: "gray",
  },
} as const;

export const DEFAULT_ARTICLE_TYPES = [
  {
    name: "Tutorial",
    slug: "tutorial",
    description: "Step-by-step learning content",
    suggestedColor: "blue",
  },
  {
    name: "Deep Dive",
    slug: "deep-dive", 
    description: "In-depth analysis and exploration",
    suggestedColor: "purple",
  },
  {
    name: "News",
    slug: "news",
    description: "Latest updates and announcements",
    suggestedColor: "green",
  },
  {
    name: "Opinion",
    slug: "opinion",
    description: "Editorial and opinion pieces",
    suggestedColor: "orange",
  },
  {
    name: "Review",
    slug: "review",
    description: "Product and technology reviews",
    suggestedColor: "pink",
  },
  {
    name: "Guide",
    slug: "guide",
    description: "Comprehensive how-to guides",
    suggestedColor: "indigo",
  },
  {
    name: "Case Study",
    slug: "case-study",
    description: "Real-world implementation examples",
    suggestedColor: "red",
  },
  {
    name: "Tips",
    slug: "tips",
    description: "Quick tips and productivity hacks",
    suggestedColor: "yellow",
  },
] as const;

export const TECHNOLOGY_RATINGS = {
  thumbsUp: {
    value: 1,
    label: "👍 Thumbs Up",
    description: "Recommended technology",
    color: "green",
  },
  thumbsSideways: {
    value: 0,
    label: "👌 Thumbs Sideways", 
    description: "Neutral/conditional recommendation",
    color: "yellow",
  },
  thumbsDown: {
    value: -1,
    label: "👎 Thumbs Down",
    description: "Not recommended",
    color: "red",
  },
} as const;

// Helper functions for Sanity schema integration
export function getColorOptionsForSanity() {
  return Object.values(ARTICLE_TYPE_COLORS).map(color => ({
    title: color.name,
    value: color.value,
  }));
}

export function getRatingOptionsForSanity() {
  return Object.values(TECHNOLOGY_RATINGS).map(rating => ({
    title: rating.label,
    value: rating.value,
  }));
}

// Helper functions for frontend integration
export function getColorClassName(color: keyof typeof ARTICLE_TYPE_COLORS) {
  return ARTICLE_TYPE_COLORS[color]?.storybook || ARTICLE_TYPE_COLORS.blue.storybook;
}

export function getRatingFromValue(value: -1 | 0 | 1) {
  return Object.values(TECHNOLOGY_RATINGS).find(rating => rating.value === value);
}

// Type exports for TypeScript support
export type ArticleTypeColor = keyof typeof ARTICLE_TYPE_COLORS;
export type TechnologyRating = -1 | 0 | 1;
export type ArticleTypeDefinition = typeof DEFAULT_ARTICLE_TYPES[number];
export type ColorDefinition = typeof ARTICLE_TYPE_COLORS[ArticleTypeColor];
export type RatingDefinition = typeof TECHNOLOGY_RATINGS[keyof typeof TECHNOLOGY_RATINGS];