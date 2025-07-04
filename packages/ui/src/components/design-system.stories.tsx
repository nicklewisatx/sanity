import type { Meta, StoryObj } from "@storybook/react";
import { 
  typography, 
  spacing, 
  colors, 
  elevation, 
  radius, 
  animation,
  breakpoints,
  zIndex
} from "../lib/design-system";

const meta = {
  title: "Design System/Overview",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
# Design System Overview

A comprehensive design system built on industry best practices:

## Core Principles

1. **Consistency**: Unified visual language across all components
2. **Scalability**: Flexible system that grows with your needs
3. **Accessibility**: WCAG AA compliant with proper contrast and focus states
4. **Performance**: Optimized for fast rendering and small bundle sizes
5. **Developer Experience**: Intuitive APIs and comprehensive documentation

## Foundation

- **8px Grid**: All spacing based on 8px baseline for visual rhythm
- **Modular Scale**: Typography uses 1.25 ratio for harmonious sizing
- **Semantic Tokens**: Meaningful names for colors and components
- **Responsive**: Mobile-first with consistent breakpoints
        `,
      },
    },
  },
} satisfies Meta;

export default meta;

export const QuickStart: StoryObj = {
  render: () => (
    <div className="space-y-12 max-w-4xl">
      <section>
        <h2 className="text-2xl font-semibold mb-6">Quick Start Guide</h2>
        
        <div className="space-y-8">
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="font-semibold mb-3">1. Import Design Tokens</h3>
            <pre className="bg-gray-900 text-gray-100 p-4 rounded overflow-x-auto">
              <code>{`import { 
  colors, 
  spacing, 
  typography,
  elevation
} from '@workspace/ui/lib/design-system';`}</code>
            </pre>
          </div>
          
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="font-semibold mb-3">2. Use Components</h3>
            <pre className="bg-gray-900 text-gray-100 p-4 rounded overflow-x-auto">
              <code>{`import { ButtonV2 } from '@workspace/ui/components/button-v2';
import { Heading, Text } from '@workspace/ui/components/typography-v2';

<Heading level={1}>Welcome</Heading>
<Text size="lg" color="muted">Build amazing interfaces</Text>
<ButtonV2 variant="primary">Get Started</ButtonV2>`}</code>
            </pre>
          </div>
          
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="font-semibold mb-3">3. Apply Consistent Spacing</h3>
            <pre className="bg-gray-900 text-gray-100 p-4 rounded overflow-x-auto">
              <code>{`// Use spacing tokens
<div className="p-4 mt-6 mb-8">
  // p-4 = 32px padding
  // mt-6 = 48px top margin
  // mb-8 = 64px bottom margin
</div>`}</code>
            </pre>
          </div>
        </div>
      </section>
    </div>
  ),
};

export const DesignTokens: StoryObj = {
  render: () => (
    <div className="space-y-12">
      <section>
        <h2 className="text-2xl font-semibold mb-6">Design Tokens Reference</h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Typography Tokens */}
          <div className="space-y-4">
            <h3 className="font-semibold">Typography Scale</h3>
            <div className="bg-white border rounded-lg p-4 space-y-2">
              {Object.entries(typography.scale).slice(0, 5).map(([key, value]) => (
                <div key={key} className="flex justify-between text-sm">
                  <code className="font-mono">{key}</code>
                  <span className="text-gray-600">{value}</span>
                </div>
              ))}
              <div className="text-sm text-gray-500">...and more</div>
            </div>
          </div>
          
          {/* Spacing Tokens */}
          <div className="space-y-4">
            <h3 className="font-semibold">Spacing Scale</h3>
            <div className="bg-white border rounded-lg p-4 space-y-2">
              {Object.entries(spacing).slice(0, 5).map(([key, value]) => (
                <div key={key} className="flex justify-between text-sm">
                  <code className="font-mono">{key}</code>
                  <span className="text-gray-600">{value}</span>
                </div>
              ))}
              <div className="text-sm text-gray-500">...and more</div>
            </div>
          </div>
          
          {/* Color Tokens */}
          <div className="space-y-4">
            <h3 className="font-semibold">Color Tokens</h3>
            <div className="bg-white border rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-3">
                <div 
                  className="w-8 h-8 rounded"
                  style={{ backgroundColor: colors.primary[500] }}
                />
                <div className="text-sm">
                  <code className="font-mono">primary</code>
                  <span className="text-gray-600 ml-2">Brand color</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div 
                  className="w-8 h-8 rounded"
                  style={{ backgroundColor: colors.success[500] }}
                />
                <div className="text-sm">
                  <code className="font-mono">success</code>
                  <span className="text-gray-600 ml-2">Positive actions</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div 
                  className="w-8 h-8 rounded"
                  style={{ backgroundColor: colors.error[500] }}
                />
                <div className="text-sm">
                  <code className="font-mono">error</code>
                  <span className="text-gray-600 ml-2">Error states</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Elevation Tokens */}
          <div className="space-y-4">
            <h3 className="font-semibold">Elevation (Shadows)</h3>
            <div className="bg-white border rounded-lg p-4 space-y-3">
              {Object.entries(elevation).slice(0, 4).map(([key, value]) => (
                <div 
                  key={key} 
                  className="p-3 bg-white rounded"
                  style={{ boxShadow: value }}
                >
                  <code className="font-mono text-sm">{key}</code>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  ),
};

export const ResponsiveDesign: StoryObj = {
  render: () => (
    <div className="space-y-8">
      <section>
        <h2 className="text-2xl font-semibold mb-6">Responsive Design</h2>
        
        <div className="space-y-6">
          <div>
            <h3 className="font-semibold mb-3">Breakpoints</h3>
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="grid gap-4">
                {Object.entries(breakpoints).map(([key, value]) => (
                  <div key={key} className="flex items-center gap-4">
                    <code className="font-mono text-sm w-16">{key}:</code>
                    <div className="flex-1 bg-blue-100 rounded p-2">
                      <div 
                        className="bg-blue-500 h-8 rounded flex items-center px-3 text-white text-sm"
                        style={{ maxWidth: value }}
                      >
                        {value}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold mb-3">Responsive Utilities</h3>
            <pre className="bg-gray-900 text-gray-100 p-4 rounded overflow-x-auto">
              <code>{`// Responsive padding
<div className="p-4 md:p-6 lg:p-8">

// Responsive text
<h1 className="text-2xl md:text-3xl lg:text-4xl">

// Responsive grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">`}</code>
            </pre>
          </div>
        </div>
      </section>
    </div>
  ),
};

export const AnimationSystem: StoryObj = {
  render: () => (
    <div className="space-y-8">
      <section>
        <h2 className="text-2xl font-semibold mb-6">Animation System</h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold mb-3">Duration</h3>
            <div className="space-y-3">
              {Object.entries(animation.duration).map(([key, value]) => (
                <div key={key} className="flex items-center gap-4">
                  <code className="font-mono text-sm w-20">{key}:</code>
                  <div className="flex-1">
                    <div 
                      className="h-2 bg-blue-500 rounded transition-all hover:w-full"
                      style={{ 
                        width: '20%',
                        transitionDuration: value 
                      }}
                    />
                  </div>
                  <span className="text-sm text-gray-600">{value}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold mb-3">Easing Functions</h3>
            <div className="space-y-3">
              {Object.entries(animation.easing).map(([key, value]) => (
                <div key={key} className="p-3 bg-gray-50 rounded">
                  <code className="font-mono text-sm">{key}</code>
                  <p className="text-xs text-gray-600 mt-1">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="mt-8">
          <h3 className="font-semibold mb-3">Interactive Examples</h3>
          <div className="flex gap-4">
            <button 
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-200"
            >
              Hover Transition
            </button>
            <button 
              className="px-4 py-2 bg-gray-200 rounded hover:scale-105 transition-transform duration-200"
            >
              Scale on Hover
            </button>
            <button 
              className="px-4 py-2 border rounded hover:shadow-lg transition-shadow duration-300"
            >
              Shadow Transition
            </button>
          </div>
        </div>
      </section>
    </div>
  ),
};

export const ZIndexSystem: StoryObj = {
  render: () => (
    <div className="space-y-8">
      <section>
        <h2 className="text-2xl font-semibold mb-6">Z-Index Layering</h2>
        
        <div className="relative h-64 bg-gray-50 rounded-lg p-8">
          {Object.entries(zIndex).reverse().map(([key, value], index) => (
            <div
              key={key}
              className="absolute bg-white border-2 border-blue-500 rounded-lg p-4 shadow-lg"
              style={{
                zIndex: value,
                top: `${index * 20}px`,
                left: `${index * 20}px`,
                right: `${index * 20}px`,
              }}
            >
              <code className="font-mono text-sm">z-{key}: {value}</code>
              <p className="text-xs text-gray-600 mt-1">
                {key === 'tooltip' && 'Highest priority'}
                {key === 'modal' && 'Modals and overlays'}
                {key === 'dropdown' && 'Dropdowns and menus'}
                {key === 'base' && 'Base content layer'}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  ),
};

export const BestPractices: StoryObj = {
  render: () => (
    <div className="space-y-12 max-w-4xl">
      <section>
        <h2 className="text-2xl font-semibold mb-6">Best Practices</h2>
        
        <div className="space-y-8">
          <div className="border-l-4 border-blue-500 pl-6">
            <h3 className="font-semibold mb-2">Use Semantic Tokens</h3>
            <p className="text-gray-600 mb-3">
              Always use semantic color tokens instead of raw color values. This ensures 
              consistency and makes theme changes easier.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-red-50 p-3 rounded">
                <p className="text-sm font-medium text-red-700 mb-1">❌ Don't</p>
                <code className="text-xs">color: "#3B82F6"</code>
              </div>
              <div className="bg-green-50 p-3 rounded">
                <p className="text-sm font-medium text-green-700 mb-1">✅ Do</p>
                <code className="text-xs">color: colors.primary[500]</code>
              </div>
            </div>
          </div>
          
          <div className="border-l-4 border-blue-500 pl-6">
            <h3 className="font-semibold mb-2">Maintain Spacing Rhythm</h3>
            <p className="text-gray-600 mb-3">
              Use consistent spacing tokens to create visual rhythm. Stick to the 8px grid.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-red-50 p-3 rounded">
                <p className="text-sm font-medium text-red-700 mb-1">❌ Don't</p>
                <code className="text-xs">margin: "13px"</code>
              </div>
              <div className="bg-green-50 p-3 rounded">
                <p className="text-sm font-medium text-green-700 mb-1">✅ Do</p>
                <code className="text-xs">margin: spacing[2] // 16px</code>
              </div>
            </div>
          </div>
          
          <div className="border-l-4 border-blue-500 pl-6">
            <h3 className="font-semibold mb-2">Responsive First</h3>
            <p className="text-gray-600 mb-3">
              Design for mobile first and enhance for larger screens using responsive utilities.
            </p>
            <pre className="bg-gray-900 text-gray-100 p-3 rounded text-xs overflow-x-auto">
              <code>{`// Mobile first approach
<div className="p-4 md:p-6 lg:p-8">
  <h1 className="text-xl md:text-2xl lg:text-3xl">
</div>`}</code>
            </pre>
          </div>
          
          <div className="border-l-4 border-blue-500 pl-6">
            <h3 className="font-semibold mb-2">Accessibility Always</h3>
            <p className="text-gray-600 mb-3">
              Ensure proper contrast ratios, focus states, and ARIA labels in all components.
            </p>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Minimum contrast ratio of 4.5:1 for normal text</li>
              <li>• Clear focus indicators for keyboard navigation</li>
              <li>• Semantic HTML and proper ARIA labels</li>
              <li>• Test with screen readers and keyboard only</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  ),
};