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

// Color System - Modern Art Inspired
export const colors = {
  // Base colors
  white: "#FFFFFF",
  black: "#000000",
  
  // Neutral scale - Purple-tinted grays for sophistication
  gray: {
    50: "#FAF9FB",  // Hint of purple
    100: "#F5F3F7",
    200: "#EDE8F5",
    300: "#DDD6E8",
    400: "#A599B5",
    500: "#776B87",
    600: "#5A4F6B",
    700: "#443B54",
    800: "#2B253A",
    900: "#1B1725",
    950: "#0E0B15",
  },
  
  // Primary - Electric Blue (Klein Blue inspired)
  primary: {
    50: "#E6F0FF",
    100: "#CCE0FF",
    200: "#99C2FF",
    300: "#66A3FF",
    400: "#3384FF",
    500: "#1971F2", // Main brand blue
    600: "#1461D9",
    700: "#0F4CAB",
    800: "#0A3680",
    900: "#052155",
  },
  
  // Secondary - Coral Pink (Memphis Design)
  coral: {
    50: "#FFF5F7",
    100: "#FFEBEF",
    200: "#FFD6E0",
    300: "#FFC2D1",
    400: "#FF99B3",
    500: "#FF6B96", // Main coral
    600: "#E6507A",
    700: "#CC3A5F",
    800: "#992B47",
    900: "#661D2F",
  },
  
  // Accent - Vibrant Yellow (Bauhaus)
  yellow: {
    50: "#FFFEF5",
    100: "#FFFCE6",
    200: "#FFF9CC",
    300: "#FFF3A3",
    400: "#FFEB7A",
    500: "#F7C41F", // Main yellow
    600: "#DBA919",
    700: "#B38A14",
    800: "#8C6B0F",
    900: "#664C0A",
  },
  
  // Additional accent - Mint Green
  mint: {
    50: "#F0FDF9",
    100: "#CCFBEF",
    200: "#99F6DF",
    300: "#5FECC8",
    400: "#2DD9AA",
    500: "#14C38E", // Main mint
    600: "#0FA573",
    700: "#0F8B61",
    800: "#10714F",
    900: "#0E5940",
  },
  
  // Additional accent - Purple
  purple: {
    50: "#FAF5FF",
    100: "#F3E8FF",
    200: "#E9D5FF",
    300: "#D8B4FE",
    400: "#C084FC",
    500: "#A855F7", // Main purple
    600: "#9333EA",
    700: "#7C3AED",
    800: "#6B21A8",
    900: "#581C87",
  },
  
  // Semantic colors with modern art twist
  success: {
    50: "#F0FDF9",
    500: "#14C38E", // Using mint for success
    700: "#0F8B61",
  },
  warning: {
    50: "#FFFEF5",
    500: "#F7C41F", // Using yellow for warning
    700: "#B38A14",
  },
  error: {
    50: "#FFF5F5",
    500: "#F23E3E", // Vivid red
    700: "#CC2E2E",
  },
  info: {
    50: "#E6F0FF",
    500: "#1971F2", // Using primary blue
    700: "#0F4CAB",
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

// Border Radius - More playful, modern art inspired
export const radius = {
  none: "0",
  sm: "0.375rem", // 6px
  base: "0.5rem", // 8px
  md: "0.75rem", // 12px - Default
  lg: "1rem", // 16px
  xl: "1.25rem", // 20px
  "2xl": "1.75rem", // 28px
  "3xl": "2.5rem", // 40px - Memphis style
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