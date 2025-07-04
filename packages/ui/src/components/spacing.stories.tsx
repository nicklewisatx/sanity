import type { Meta, StoryObj } from "@storybook/react";
import { spacing } from "../lib/design-system";

const meta = {
  title: "Design System/Spacing",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
A consistent spacing system based on an 8px baseline grid:

- **Predictable**: All spacing values are multiples of 8px (with a few exceptions)
- **Scalable**: From 0 to 160px, covering all use cases
- **Memorable**: Simple naming convention (1 = 8px, 2 = 16px, etc.)
- **Flexible**: Includes half steps for fine-tuning (0.5 = 4px, 1.5 = 12px)

This spacing system ensures visual rhythm and consistency across all components.
        `,
      },
    },
  },
} satisfies Meta;

export default meta;

export const SpacingScale: StoryObj = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-4">Spacing Scale</h3>
        <div className="space-y-2">
          {Object.entries(spacing).map(([key, value]) => (
            <div key={key} className="flex items-center gap-4">
              <code className="text-sm font-mono w-16 text-right">{key}</code>
              <div className="flex items-center gap-2 flex-1">
                <div
                  className="bg-blue-500 h-8"
                  style={{ width: value }}
                  aria-label={`Spacing ${key}: ${value}`}
                />
                <span className="text-sm text-gray-600">{value}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  ),
};

export const PaddingExamples: StoryObj = {
  render: () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Padding Examples</h3>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="border-2 border-dashed border-gray-300">
          <div className="bg-blue-100 p-2">
            <div className="bg-blue-500 text-white p-2 text-center">p-2 (16px)</div>
          </div>
        </div>
        
        <div className="border-2 border-dashed border-gray-300">
          <div className="bg-blue-100 p-4">
            <div className="bg-blue-500 text-white p-2 text-center">p-4 (32px)</div>
          </div>
        </div>
        
        <div className="border-2 border-dashed border-gray-300">
          <div className="bg-blue-100 p-6">
            <div className="bg-blue-500 text-white p-2 text-center">p-6 (48px)</div>
          </div>
        </div>
        
        <div className="border-2 border-dashed border-gray-300">
          <div className="bg-blue-100 p-8">
            <div className="bg-blue-500 text-white p-2 text-center">p-8 (64px)</div>
          </div>
        </div>
      </div>
    </div>
  ),
};

export const MarginExamples: StoryObj = {
  render: () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Margin Examples (Vertical Spacing)</h3>
      
      <div className="bg-gray-50 p-4 rounded">
        <div className="bg-white p-4 rounded shadow-sm">First section</div>
        <div className="bg-white p-4 rounded shadow-sm mt-2">mt-2 (16px gap)</div>
        <div className="bg-white p-4 rounded shadow-sm mt-4">mt-4 (32px gap)</div>
        <div className="bg-white p-4 rounded shadow-sm mt-6">mt-6 (48px gap)</div>
        <div className="bg-white p-4 rounded shadow-sm mt-8">mt-8 (64px gap)</div>
      </div>
    </div>
  ),
};

export const ComponentSpacing: StoryObj = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-4">Component Spacing Patterns</h3>
        
        <div className="space-y-6">
          {/* Card Example */}
          <div className="bg-white border rounded-lg p-6 shadow-sm">
            <h4 className="text-base font-semibold">Card Component</h4>
            <p className="text-sm text-gray-600 mt-2">
              Uses p-6 (48px) for generous internal spacing
            </p>
            <div className="flex gap-3 mt-4">
              <button className="px-4 py-2 bg-blue-500 text-white rounded">Action</button>
              <button className="px-4 py-2 border rounded">Cancel</button>
            </div>
          </div>
          
          {/* Compact Card */}
          <div className="bg-white border rounded-lg p-4 shadow-sm">
            <h4 className="text-base font-semibold">Compact Card</h4>
            <p className="text-sm text-gray-600 mt-1">
              Uses p-4 (32px) for tighter spacing
            </p>
          </div>
          
          {/* Section Example */}
          <div className="bg-gray-50 rounded-lg">
            <div className="p-8">
              <h3 className="text-xl font-semibold">Section Heading</h3>
              <p className="text-gray-600 mt-3">
                Sections use p-8 (64px) for clear visual separation
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
};

export const ResponsiveSpacing: StoryObj = {
  render: () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Responsive Spacing</h3>
      
      <div className="space-y-4">
        <div className="bg-blue-100 p-4 md:p-6 lg:p-8 rounded">
          <div className="bg-blue-500 text-white p-3 rounded text-center">
            <div>p-4 on mobile</div>
            <div>md:p-6 on tablet</div>
            <div>lg:p-8 on desktop</div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 lg:gap-8">
          <div className="bg-gray-100 p-4 rounded">
            <div className="bg-gray-500 text-white p-3 rounded text-center">
              Responsive gap
            </div>
          </div>
          <div className="bg-gray-100 p-4 rounded">
            <div className="bg-gray-500 text-white p-3 rounded text-center">
              Responsive gap
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
};

export const SpacingGuidelines: StoryObj = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-6">Spacing Guidelines</h3>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-medium">Small Spacing (0.5 - 2)</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-blue-500">•</span>
                <span>Use for related elements within components</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500">•</span>
                <span>Icon to text spacing</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500">•</span>
                <span>Form label to input spacing</span>
              </li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-medium">Medium Spacing (3 - 6)</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-blue-500">•</span>
                <span>Between distinct sections within a component</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500">•</span>
                <span>Card padding</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500">•</span>
                <span>Modal content padding</span>
              </li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-medium">Large Spacing (8 - 12)</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-blue-500">•</span>
                <span>Between major page sections</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500">•</span>
                <span>Hero section padding</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500">•</span>
                <span>Footer padding</span>
              </li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-medium">Extra Large Spacing (16 - 20)</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-blue-500">•</span>
                <span>Between unrelated page sections</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500">•</span>
                <span>Top/bottom page margins</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500">•</span>
                <span>Breathing room for important content</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  ),
};