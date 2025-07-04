import type { Meta, StoryObj } from "@storybook/react";
import { colors } from "../lib/design-system";

const meta = {
  title: "Design System/Colors",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
A comprehensive color system with semantic naming and accessibility in mind:

- **Semantic tokens**: Colors have meaningful names (primary, success, error)
- **Accessible contrasts**: All color combinations meet WCAG AA standards
- **Systematic shades**: Each color has a full range from 50 to 900
- **Dark mode ready**: Colors work in both light and dark themes
        `,
      },
    },
  },
} satisfies Meta;

export default meta;

// Color swatch component
const ColorSwatch = ({ 
  name, 
  value, 
  textColor = "black" 
}: { 
  name: string; 
  value: string; 
  textColor?: string;
}) => (
  <div className="space-y-2">
    <div 
      className="h-24 rounded-lg shadow-sm border flex items-end p-3"
      style={{ backgroundColor: value, color: textColor }}
    >
      <div className="text-sm font-medium">{name}</div>
    </div>
    <div className="text-xs font-mono text-gray-600">{value}</div>
  </div>
);

export const GrayScale: StoryObj = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Gray Scale</h3>
        <p className="text-sm text-gray-600 mb-6">
          A perceptually uniform gray scale for UI elements and text
        </p>
        <div className="grid grid-cols-6 gap-4">
          {Object.entries(colors.gray).map(([shade, value]) => (
            <ColorSwatch
              key={shade}
              name={`Gray ${shade}`}
              value={value}
              textColor={parseInt(shade) >= 500 ? "white" : "black"}
            />
          ))}
        </div>
      </div>
    </div>
  ),
};

export const BrandColors: StoryObj = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Primary Brand Colors</h3>
        <p className="text-sm text-gray-600 mb-6">
          Main brand colors used for primary actions and brand elements
        </p>
        <div className="grid grid-cols-5 gap-4">
          {Object.entries(colors.primary).map(([shade, value]) => (
            <ColorSwatch
              key={shade}
              name={`Primary ${shade}`}
              value={value}
              textColor={parseInt(shade) >= 500 ? "white" : "black"}
            />
          ))}
        </div>
      </div>
    </div>
  ),
};

export const SemanticColors: StoryObj = {
  render: () => (
    <div className="space-y-8">
      <h3 className="text-lg font-semibold">Semantic Colors</h3>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Success */}
        <div className="space-y-3">
          <h4 className="font-medium">Success</h4>
          <ColorSwatch name="Light" value={colors.success[50]} />
          <ColorSwatch name="Default" value={colors.success[500]} textColor="white" />
          <ColorSwatch name="Dark" value={colors.success[700]} textColor="white" />
        </div>
        
        {/* Warning */}
        <div className="space-y-3">
          <h4 className="font-medium">Warning</h4>
          <ColorSwatch name="Light" value={colors.warning[50]} />
          <ColorSwatch name="Default" value={colors.warning[500]} textColor="white" />
          <ColorSwatch name="Dark" value={colors.warning[700]} textColor="white" />
        </div>
        
        {/* Error */}
        <div className="space-y-3">
          <h4 className="font-medium">Error</h4>
          <ColorSwatch name="Light" value={colors.error[50]} />
          <ColorSwatch name="Default" value={colors.error[500]} textColor="white" />
          <ColorSwatch name="Dark" value={colors.error[700]} textColor="white" />
        </div>
        
        {/* Info */}
        <div className="space-y-3">
          <h4 className="font-medium">Info</h4>
          <ColorSwatch name="Light" value={colors.info[50]} />
          <ColorSwatch name="Default" value={colors.info[500]} textColor="white" />
          <ColorSwatch name="Dark" value={colors.info[700]} textColor="white" />
        </div>
      </div>
    </div>
  ),
};

export const ColorUsageExamples: StoryObj = {
  render: () => (
    <div className="space-y-8">
      <h3 className="text-lg font-semibold">Color Usage Examples</h3>
      
      {/* Buttons */}
      <div className="space-y-4">
        <h4 className="font-medium">Buttons</h4>
        <div className="flex gap-3 flex-wrap">
          <button 
            className="px-4 py-2 rounded-md text-white font-medium"
            style={{ backgroundColor: colors.primary[600] }}
          >
            Primary Action
          </button>
          <button 
            className="px-4 py-2 rounded-md text-white font-medium"
            style={{ backgroundColor: colors.success[500] }}
          >
            Success
          </button>
          <button 
            className="px-4 py-2 rounded-md text-white font-medium"
            style={{ backgroundColor: colors.error[500] }}
          >
            Danger
          </button>
          <button 
            className="px-4 py-2 rounded-md text-white font-medium"
            style={{ backgroundColor: colors.warning[500] }}
          >
            Warning
          </button>
          <button 
            className="px-4 py-2 rounded-md border font-medium"
            style={{ 
              borderColor: colors.gray[300],
              color: colors.gray[700],
              backgroundColor: colors.white
            }}
          >
            Secondary
          </button>
        </div>
      </div>
      
      {/* Alerts */}
      <div className="space-y-4">
        <h4 className="font-medium">Alert Messages</h4>
        <div className="space-y-3">
          <div 
            className="p-4 rounded-lg border"
            style={{ 
              backgroundColor: colors.info[50],
              borderColor: colors.info[500],
              color: colors.info[700]
            }}
          >
            <strong>Info:</strong> This is an informational message
          </div>
          <div 
            className="p-4 rounded-lg border"
            style={{ 
              backgroundColor: colors.success[50],
              borderColor: colors.success[500],
              color: colors.success[700]
            }}
          >
            <strong>Success:</strong> Operation completed successfully
          </div>
          <div 
            className="p-4 rounded-lg border"
            style={{ 
              backgroundColor: colors.warning[50],
              borderColor: colors.warning[500],
              color: colors.warning[700]
            }}
          >
            <strong>Warning:</strong> Please review before proceeding
          </div>
          <div 
            className="p-4 rounded-lg border"
            style={{ 
              backgroundColor: colors.error[50],
              borderColor: colors.error[500],
              color: colors.error[700]
            }}
          >
            <strong>Error:</strong> Something went wrong
          </div>
        </div>
      </div>
      
      {/* Form States */}
      <div className="space-y-4">
        <h4 className="font-medium">Form Input States</h4>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Normal Input</label>
            <input
              type="text"
              className="w-full px-3 py-2 rounded-md border"
              style={{ borderColor: colors.gray[300] }}
              placeholder="Enter text..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: colors.error[500] }}>
              Error Input
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 rounded-md border"
              style={{ borderColor: colors.error[500] }}
              placeholder="Invalid input"
            />
            <p className="text-sm mt-1" style={{ color: colors.error[500] }}>
              This field is required
            </p>
          </div>
        </div>
      </div>
    </div>
  ),
};

export const AccessibilityContrast: StoryObj = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-4">Accessibility Contrast Ratios</h3>
        <p className="text-sm text-gray-600 mb-6">
          All text colors meet WCAG AA standards for contrast
        </p>
        
        <div className="space-y-6">
          {/* On White Background */}
          <div>
            <h4 className="font-medium mb-3">Text on White Background</h4>
            <div className="bg-white p-6 rounded-lg border space-y-2">
              <p style={{ color: colors.gray[900] }}>
                Gray 900 on white - Primary text (Contrast: 19.3:1) ✓ AAA
              </p>
              <p style={{ color: colors.gray[700] }}>
                Gray 700 on white - Secondary text (Contrast: 11.5:1) ✓ AAA
              </p>
              <p style={{ color: colors.gray[500] }}>
                Gray 500 on white - Muted text (Contrast: 4.8:1) ✓ AA
              </p>
              <p style={{ color: colors.primary[500] }}>
                Primary 500 on white - Links (Contrast: 4.5:1) ✓ AA
              </p>
            </div>
          </div>
          
          {/* On Dark Background */}
          <div>
            <h4 className="font-medium mb-3">Text on Dark Background</h4>
            <div className="p-6 rounded-lg space-y-2" style={{ backgroundColor: colors.gray[900] }}>
              <p style={{ color: colors.white }}>
                White on Gray 900 - Primary text (Contrast: 19.3:1) ✓ AAA
              </p>
              <p style={{ color: colors.gray[300] }}>
                Gray 300 on Gray 900 - Secondary text (Contrast: 11.9:1) ✓ AAA
              </p>
              <p style={{ color: colors.gray[400] }}>
                Gray 400 on Gray 900 - Muted text (Contrast: 7.8:1) ✓ AA
              </p>
              <p style={{ color: colors.primary[400] }}>
                Primary 400 on Gray 900 - Links (Contrast: 8.2:1) ✓ AA
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
};

export const ColorPalette: StoryObj = {
  name: "Complete Palette",
  render: () => (
    <div className="space-y-12">
      {/* Base Colors */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Base Colors</h3>
        <div className="grid grid-cols-2 gap-4">
          <ColorSwatch name="White" value={colors.white} />
          <ColorSwatch name="Black" value={colors.black} textColor="white" />
        </div>
      </div>
      
      {/* All Color Scales */}
      {Object.entries({
        Gray: colors.gray,
        Primary: colors.primary,
      }).map(([name, scale]) => (
        <div key={name}>
          <h3 className="text-lg font-semibold mb-4">{name} Scale</h3>
          <div className="grid grid-cols-5 md:grid-cols-10 gap-3">
            {Object.entries(scale).map(([shade, value]) => (
              <div key={shade} className="space-y-1">
                <div 
                  className="h-16 rounded flex items-end p-2 shadow-sm border"
                  style={{ 
                    backgroundColor: value,
                    color: parseInt(shade) >= 500 ? "white" : "black"
                  }}
                >
                  <div className="text-xs font-medium">{shade}</div>
                </div>
                <div className="text-[10px] font-mono text-gray-600 truncate">
                  {value}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  ),
};