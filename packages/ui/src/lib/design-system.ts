/**
 * Design System Configuration
 * Following industry best practices for scalable, maintainable design systems
 */

// Typography Scale - Using modular scale (1.25 ratio)
export const typography = {
  scale: {
    xs: "0.75rem", // 12px
    sm: "0.875rem", // 14px
    base: "1rem", // 16px
    lg: "1.25rem", // 20px
    xl: "1.5625rem", // 25px
    "2xl": "1.953rem", // 31.25px
    "3xl": "2.441rem", // 39px
    "4xl": "3.052rem", // 48.8px
    "5xl": "3.815rem", // 61px
  },
  weight: {
    normal: "400",
    medium: "500",
    semibold: "600",
    bold: "700",
  },
  lineHeight: {
    tight: "1.2",
    snug: "1.4",
    normal: "1.6",
    relaxed: "1.8",
  },
  letterSpacing: {
    tight: "-0.02em",
    normal: "0",
    wide: "0.02em",
  },
} as const;

// Spacing System - 8px baseline grid
export const spacing = {
  0: "0",
  px: "1px",
  0.5: "0.25rem", // 4px
  1: "0.5rem", // 8px
  1.5: "0.75rem", // 12px
  2: "1rem", // 16px
  3: "1.5rem", // 24px
  4: "2rem", // 32px
  5: "2.5rem", // 40px
  6: "3rem", // 48px
  8: "4rem", // 64px
  10: "5rem", // 80px
  12: "6rem", // 96px
  16: "8rem", // 128px
  20: "10rem", // 160px
} as const;

// Color System - Semantic tokens
export const colors = {
  // Base colors
  white: "#FFFFFF",
  black: "#000000",
  
  // Gray scale - Using perceptually uniform scale
  gray: {
    50: "#FAFAFA",
    100: "#F4F4F5",
    200: "#E4E4E7",
    300: "#D4D4D8",
    400: "#A1A1AA",
    500: "#71717A",
    600: "#52525B",
    700: "#3F3F46",
    800: "#27272A",
    900: "#18181B",
    950: "#09090B",
  },
  
  // Brand colors
  primary: {
    50: "#EFF6FF",
    100: "#DBEAFE",
    200: "#BFDBFE",
    300: "#93BBFD",
    400: "#60A5FA",
    500: "#3B82F6",
    600: "#2563EB",
    700: "#1D4ED8",
    800: "#1E40AF",
    900: "#1E3A8A",
  },
  
  // Semantic colors
  success: {
    50: "#F0FDF4",
    500: "#22C55E",
    700: "#15803D",
  },
  warning: {
    50: "#FFFBEB",
    500: "#F59E0B",
    700: "#B45309",
  },
  error: {
    50: "#FEF2F2",
    500: "#EF4444",
    700: "#B91C1C",
  },
  info: {
    50: "#EFF6FF",
    500: "#3B82F6",
    700: "#1D4ED8",
  },
} as const;

// Elevation (Shadows)
export const elevation = {
  none: "none",
  sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
  base: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
  md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
  lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
  xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
} as const;

// Border Radius
export const radius = {
  none: "0",
  sm: "0.25rem", // 4px
  base: "0.375rem", // 6px
  md: "0.5rem", // 8px
  lg: "0.75rem", // 12px
  xl: "1rem", // 16px
  "2xl": "1.5rem", // 24px
  full: "9999px",
} as const;

// Breakpoints
export const breakpoints = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
} as const;

// Animation
export const animation = {
  duration: {
    fast: "150ms",
    base: "200ms",
    slow: "300ms",
    slower: "400ms",
  },
  easing: {
    linear: "linear",
    in: "cubic-bezier(0.4, 0, 1, 1)",
    out: "cubic-bezier(0, 0, 0.2, 1)",
    inOut: "cubic-bezier(0.4, 0, 0.2, 1)",
  },
} as const;

// Z-index scale
export const zIndex = {
  base: 0,
  dropdown: 10,
  sticky: 20,
  fixed: 30,
  modalBackdrop: 40,
  modal: 50,
  popover: 60,
  tooltip: 70,
} as const;

// Component-specific tokens
export const components = {
  button: {
    height: {
      sm: "2rem", // 32px
      md: "2.5rem", // 40px
      lg: "3rem", // 48px
    },
    padding: {
      sm: "0 0.75rem",
      md: "0 1rem",
      lg: "0 1.5rem",
    },
    fontSize: {
      sm: typography.scale.sm,
      md: typography.scale.base,
      lg: typography.scale.lg,
    },
  },
  input: {
    height: {
      sm: "2rem",
      md: "2.5rem",
      lg: "3rem",
    },
  },
  card: {
    padding: {
      sm: spacing[3],
      md: spacing[4],
      lg: spacing[6],
    },
  },
} as const;

// Helper functions
export const pxToRem = (px: number): string => `${px / 16}rem`;
export const remToPx = (rem: string): number => parseFloat(rem) * 16;

// Type exports
export type TypographyScale = keyof typeof typography.scale;
export type TypographyWeight = keyof typeof typography.weight;
export type SpacingScale = keyof typeof spacing;
export type ColorName = keyof typeof colors;
export type GrayShade = keyof typeof colors.gray;
export type PrimaryShade = keyof typeof colors.primary;
export type Breakpoint = keyof typeof breakpoints;
export type AnimationDuration = keyof typeof animation.duration;
export type AnimationEasing = keyof typeof animation.easing;
export type ZIndex = keyof typeof zIndex;