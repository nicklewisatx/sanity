import type { Meta, StoryObj } from "@storybook/react";
import { Navigation, Navbar, type NavLink, type NavButton } from "./navigation";
import { Logo } from "./logo";
import { Button } from "./button";
import { Moon, Sun } from "lucide-react";

const meta = {
  title: "Design System/Navigation",
  component: Navigation,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
A simple navigation system for blog layouts:

- **Responsive**: Automatic mobile/desktop switching
- **Flexible**: Support for links and buttons
- **Accessible**: Full keyboard navigation and ARIA support
- **Customizable**: Multiple navbar variants
- **Dark mode**: Automatic theme adaptation
        `,
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Navigation>;

export default meta;
type Story = StoryObj<typeof meta>;

// Sample navigation data
const blogLinks: NavLink[] = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Blog", href: "/blog" },
  { name: "Contact", href: "/contact" },
];

const blogButtons: NavButton[] = [
  {
    text: "Subscribe",
    href: "/subscribe",
    variant: "primary",
  },
];

// Basic navigation
export const Default: Story = {
  args: {
    logo: <Logo />,
    links: blogLinks,
    buttons: blogButtons,
  },
};

// Simple navigation without buttons
export const SimpleLinks: Story = {
  args: {
    logo: <Logo />,
    links: blogLinks,
  },
};

// Navigation with external links
export const WithExternalLinks: Story = {
  args: {
    logo: <Logo />,
    links: [
      { name: "Home", href: "/" },
      { name: "Blog", href: "/blog" },
      { name: "GitHub", href: "https://github.com", external: true },
      { name: "Twitter", href: "https://twitter.com", external: true },
    ],
    buttons: [
      { text: "RSS Feed", href: "/feed.xml", variant: "secondary" },
    ],
  },
};

// Mock ModeToggle for demo
const ModeToggleMock = () => (
  <Button variant="ghost" size="icon">
    <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
    <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
    <span className="sr-only">Toggle theme</span>
  </Button>
);

// With custom right content
export const WithRightContent: Story = {
  args: {
    logo: <Logo />,
    links: blogLinks,
    rightContent: <ModeToggleMock />,
    buttons: blogButtons,
  },
};

// Navbar variants
export const NavbarDefault: Story = {
  render: () => (
    <div className="-mx-8 -mt-8">
      <Navbar
        logo={<Logo />}
        links={blogLinks}
        buttons={blogButtons}
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
      <Navbar
        logo={<Logo />}
        links={blogLinks}
        buttons={blogButtons}
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
      <Navbar
        logo={<Logo />}
        links={blogLinks}
        buttons={blogButtons}
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
      <Navbar
        logo={<Logo />}
        links={blogLinks}
        buttons={blogButtons}
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
      <Navbar
        logo={<Logo />}
        links={blogLinks}
        buttons={blogButtons}
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
    links: blogLinks,
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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="p-8 bg-white rounded-lg">
        <h4 className="font-semibold mb-4">Light Mode</h4>
        <Navigation
          logo={<Logo />}
          links={blogLinks}
          buttons={blogButtons}
        />
      </div>
      
      <div className="p-8 bg-gray-900 rounded-lg dark">
        <h4 className="font-semibold mb-4 text-white">Dark Mode</h4>
        <Navigation
          logo={<Logo />}
          links={blogLinks}
          buttons={blogButtons}
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
    links: blogLinks,
    buttons: [
      {
        text: "Newsletter",
        onClick: () => alert("Newsletter signup!"),
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