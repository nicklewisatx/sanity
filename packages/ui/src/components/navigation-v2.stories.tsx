import type { Meta, StoryObj } from "@storybook/react";
import { NavigationV2, NavbarV2, type NavColumn, type NavLink, type NavButton } from "./navigation-v2";
import { Logo } from "./logo";
import { ButtonV2 as Button } from "./button-v2";
import { Moon, Sun } from "lucide-react";
import { 
  Home, 
  FileText, 
  Settings, 
  Users, 
  BarChart, 
  Shield, 
  Zap,
  Package,
  Briefcase,
  ShoppingCart,
  BookOpen,
  HelpCircle,
  Mail
} from "lucide-react";

const meta = {
  title: "Design System/Navigation V2",
  component: NavigationV2,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
A modern navigation system built on our design system principles:

- **Responsive**: Automatic mobile/desktop switching
- **Flexible**: Support for dropdowns, simple links, and buttons
- **Accessible**: Full keyboard navigation and ARIA support
- **Customizable**: Multiple variants and configurations
- **Dark mode**: Automatic theme adaptation
        `,
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof NavigationV2>;

export default meta;
type Story = StoryObj<typeof meta>;

// Sample navigation data
const sampleColumns: (NavColumn | NavLink)[] = [
  {
    title: "Products",
    links: [
      {
        name: "Analytics",
        href: "/analytics",
        description: "Real-time insights and reporting",
        icon: <BarChart className="h-5 w-5" />,
      },
      {
        name: "Security",
        href: "/security",
        description: "Enterprise-grade protection",
        icon: <Shield className="h-5 w-5" />,
      },
      {
        name: "Automation",
        href: "/automation",
        description: "Streamline your workflows",
        icon: <Zap className="h-5 w-5" />,
      },
    ],
  },
  {
    title: "Solutions",
    links: [
      {
        name: "Enterprise",
        href: "/enterprise",
        description: "For large organizations",
        icon: <Briefcase className="h-5 w-5" />,
      },
      {
        name: "Startups",
        href: "/startups",
        description: "Get started quickly",
        icon: <Package className="h-5 w-5" />,
      },
      {
        name: "E-commerce",
        href: "/ecommerce",
        description: "Sell online effectively",
        icon: <ShoppingCart className="h-5 w-5" />,
      },
    ],
  },
  {
    name: "Pricing",
    href: "/pricing",
  },
  {
    name: "Docs",
    href: "/docs",
    external: true,
  },
];

const sampleButtons: NavButton[] = [
  {
    text: "Sign In",
    href: "/signin",
    variant: "ghost",
  },
  {
    text: "Get Started",
    href: "/signup",
    variant: "primary",
  },
];

// Basic navigation
export const Default: Story = {
  args: {
    logo: <Logo />,
    columns: sampleColumns,
    buttons: sampleButtons,
  },
};

// Simple navigation without dropdowns
export const SimpleLinks: Story = {
  args: {
    logo: <Logo />,
    columns: [
      { name: "Home", href: "/" },
      { name: "About", href: "/about" },
      { name: "Services", href: "/services" },
      { name: "Contact", href: "/contact" },
    ],
    buttons: [
      { text: "Get Started", variant: "primary", href: "/signup" },
    ],
  },
};

// Complex navigation with many items
export const ComplexNavigation: Story = {
  args: {
    logo: <Logo />,
    columns: [
      {
        title: "Products",
        links: [
          {
            name: "Dashboard",
            href: "/dashboard",
            description: "Central command center",
            icon: <Home className="h-5 w-5" />,
          },
          {
            name: "Analytics",
            href: "/analytics",
            description: "Data insights and reporting",
            icon: <BarChart className="h-5 w-5" />,
          },
          {
            name: "Reports",
            href: "/reports",
            description: "Custom report generation",
            icon: <FileText className="h-5 w-5" />,
          },
          {
            name: "Team Management",
            href: "/team",
            description: "Manage your team members",
            icon: <Users className="h-5 w-5" />,
          },
          {
            name: "Settings",
            href: "/settings",
            description: "Configure your workspace",
            icon: <Settings className="h-5 w-5" />,
          },
          {
            name: "Security",
            href: "/security",
            description: "Security and compliance",
            icon: <Shield className="h-5 w-5" />,
          },
        ],
      },
      {
        title: "Resources",
        links: [
          {
            name: "Documentation",
            href: "/docs",
            description: "Guides and API reference",
            icon: <BookOpen className="h-5 w-5" />,
          },
          {
            name: "Support",
            href: "/support",
            description: "Get help when you need it",
            icon: <HelpCircle className="h-5 w-5" />,
          },
          {
            name: "Contact",
            href: "/contact",
            description: "Get in touch with us",
            icon: <Mail className="h-5 w-5" />,
          },
        ],
      },
      { name: "Pricing", href: "/pricing" },
      { name: "Blog", href: "/blog" },
    ],
    buttons: [
      { text: "Sign In", variant: "outline", href: "/signin" },
      { text: "Start Free Trial", variant: "primary", href: "/trial" },
    ],
  },
};

// Mock ModeToggle for demo
const ModeToggleMock = () => (
  <Button variant="outline" size="sm">
    <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
    <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
    <span className="sr-only">Toggle theme</span>
  </Button>
);

// With custom right content
export const WithRightContent: Story = {
  args: {
    logo: <Logo />,
    columns: sampleColumns,
    rightContent: <ModeToggleMock />,
    buttons: sampleButtons,
  },
};

// Different mobile breakpoints
export const MobileBreakpointSm: Story = {
  args: {
    logo: <Logo />,
    columns: sampleColumns,
    buttons: sampleButtons,
    mobileBreakpoint: "sm",
  },
  parameters: {
    docs: {
      description: {
        story: "Shows mobile menu on small screens only (< 640px)",
      },
    },
  },
};

export const MobileBreakpointLg: Story = {
  args: {
    logo: <Logo />,
    columns: sampleColumns,
    buttons: sampleButtons,
    mobileBreakpoint: "lg",
  },
  parameters: {
    docs: {
      description: {
        story: "Shows mobile menu on medium screens and below (< 1024px)",
      },
    },
  },
};

// Navbar variants
export const NavbarDefault: Story = {
  render: () => (
    <div className="-mx-8 -mt-8">
      <NavbarV2
        logo={<Logo />}
        columns={sampleColumns}
        buttons={sampleButtons}
        variant="default"
      />
      <div className="container mx-auto px-4 md:px-6 py-8">
        <h1 className="text-3xl font-bold">Page Content</h1>
        <p className="mt-4 text-muted-foreground">
          This navbar has the default styling.
        </p>
      </div>
    </div>
  ),
};

export const NavbarBordered: Story = {
  render: () => (
    <div className="-mx-8 -mt-8">
      <NavbarV2
        logo={<Logo />}
        columns={sampleColumns}
        buttons={sampleButtons}
        variant="bordered"
      />
      <div className="container mx-auto px-4 md:px-6 py-8">
        <h1 className="text-3xl font-bold">Page Content</h1>
        <p className="mt-4 text-muted-foreground">
          This navbar has a bottom border.
        </p>
      </div>
    </div>
  ),
};

export const NavbarElevated: Story = {
  render: () => (
    <div className="-mx-8 -mt-8">
      <NavbarV2
        logo={<Logo />}
        columns={sampleColumns}
        buttons={sampleButtons}
        variant="elevated"
      />
      <div className="container mx-auto px-4 md:px-6 py-8">
        <h1 className="text-3xl font-bold">Page Content</h1>
        <p className="mt-4 text-muted-foreground">
          This navbar has a subtle shadow.
        </p>
      </div>
    </div>
  ),
};

// Sticky navbar
export const StickyNavbar: Story = {
  render: () => (
    <div className="-mx-8 -mt-8">
      <NavbarV2
        logo={<Logo />}
        columns={sampleColumns}
        buttons={sampleButtons}
        variant="bordered"
        sticky
        background="blur"
      />
      <div className="container mx-auto px-4 md:px-6 py-8">
        <h1 className="text-3xl font-bold">Scroll to see sticky navbar</h1>
        <div className="mt-4 space-y-4">
          {Array.from({ length: 20 }).map((_, i) => (
            <p key={i} className="text-muted-foreground">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
              ad minim veniam, quis nostrud exercitation ullamco laboris.
            </p>
          ))}
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Navbar sticks to the top when scrolling with blur background",
      },
    },
  },
};

// Transparent background
export const TransparentNavbar: Story = {
  render: () => (
    <div className="-mx-8 -mt-8 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950">
      <NavbarV2
        logo={<Logo />}
        columns={sampleColumns}
        buttons={sampleButtons}
        background="transparent"
      />
      <div className="container mx-auto px-4 md:px-6 py-8">
        <h1 className="text-3xl font-bold">Page Content</h1>
        <p className="mt-4 text-muted-foreground">
          This navbar has a transparent background.
        </p>
      </div>
    </div>
  ),
};

// Minimal navigation
export const Minimal: Story = {
  args: {
    columns: [
      { name: "Home", href: "/" },
      { name: "About", href: "/about" },
      { name: "Contact", href: "/contact" },
    ],
  },
  parameters: {
    docs: {
      description: {
        story: "Navigation without logo or buttons",
      },
    },
  },
};

// Dark mode example
export const DarkMode: Story = {
  render: () => (
    <div className="grid grid-cols-1 gap-8">
      <div className="p-8 bg-white rounded-lg">
        <h4 className="font-semibold mb-4">Light Mode</h4>
        <NavigationV2
          logo={<Logo />}
          columns={sampleColumns}
          buttons={sampleButtons}
        />
      </div>
      
      <div className="p-8 bg-gray-900 rounded-lg dark">
        <h4 className="font-semibold mb-4 text-white">Dark Mode</h4>
        <NavigationV2
          logo={<Logo />}
          columns={sampleColumns}
          buttons={sampleButtons}
        />
      </div>
    </div>
  ),
  parameters: {
    backgrounds: { default: "light" },
  },
};

// Click handlers example
export const WithClickHandlers: Story = {
  args: {
    logo: <Logo />,
    onLogoClick: () => alert("Logo clicked!"),
    columns: [
      { name: "Home", href: "/" },
      { name: "About", href: "/about" },
    ],
    buttons: [
      {
        text: "Action Button",
        onClick: () => alert("Button clicked!"),
        variant: "primary",
      },
    ],
  },
  parameters: {
    docs: {
      description: {
        story: "Navigation with click handlers for logo and buttons",
      },
    },
  },
};