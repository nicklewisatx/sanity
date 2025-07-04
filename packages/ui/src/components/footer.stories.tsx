import type { Meta, StoryObj } from "@storybook/react";
import { Footer } from "./footer.js";
import { Logo } from "./logo.js";

// Simple social media icons for demo purposes
const TwitterIcon = () => (
  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
  </svg>
);

const GitHubIcon = () => (
  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
    <path
      fillRule="evenodd"
      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      clipRule="evenodd"
    />
  </svg>
);

const LinkedInIcon = () => (
  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
  </svg>
);

const meta = {
  title: "Components/Footer",
  component: Footer,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "dark", "minimal"],
    },
    size: {
      control: "select",
      options: ["sm", "default", "lg"],
    },
  },
} satisfies Meta<typeof Footer>;

export default meta;
type Story = StoryObj<typeof meta>;

const defaultSections = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "#" },
      { label: "Pricing", href: "#" },
      { label: "Security", href: "#" },
      { label: "Roadmap", href: "#" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "#" },
      { label: "Blog", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Press", href: "#" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Documentation", href: "#" },
      { label: "Help Center", href: "#" },
      { label: "Community", href: "#" },
      { label: "Contact", href: "#" },
    ],
  },
];

const socialLinks = [
  { name: "Twitter", href: "#", icon: <TwitterIcon /> },
  { name: "GitHub", href: "#", icon: <GitHubIcon /> },
  { name: "LinkedIn", href: "#", icon: <LinkedInIcon /> },
];

const bottomLinks = [
  { label: "Privacy Policy", href: "#" },
  { label: "Terms of Service", href: "#" },
  { label: "Cookie Policy", href: "#" },
];

export const Default: Story = {
  args: {
    logo: <Logo primary="Acme Corp" secondary="" separator="" />,
    description:
      "Building the future of web applications with modern tools and best practices.",
    sections: defaultSections,
    socialLinks: socialLinks,
    copyright: "© 2024 Acme Corp. All rights reserved.",
    bottomLinks: bottomLinks,
  },
};

export const Dark: Story = {
  args: {
    variant: "dark",
    logo: <Logo primary="Acme Corp" secondary="" separator="" className="text-white" />,
    description:
      "Building the future of web applications with modern tools and best practices.",
    sections: defaultSections,
    socialLinks: socialLinks,
    copyright: "© 2024 Acme Corp. All rights reserved.",
    bottomLinks: bottomLinks,
  },
};

export const Minimal: Story = {
  args: {
    variant: "minimal",
    logo: <Logo primary="Minimal Co" secondary="" separator="" size="sm" />,
    copyright: "© 2024 Minimal Co. All rights reserved.",
    bottomLinks: bottomLinks,
  },
};

export const WithLinksOnly: Story = {
  args: {
    sections: [
      ...defaultSections,
      {
        title: "Legal",
        links: [
          { label: "Terms", href: "#" },
          { label: "Privacy", href: "#" },
          { label: "Cookies", href: "#" },
          { label: "License", href: "#" },
        ],
      },
    ],
    copyright: "© 2024 Company Name. All rights reserved.",
  },
};

export const WithBrandOnly: Story = {
  args: {
    logo: <Logo primary="Brand" secondary="" separator="" size="lg" />,
    description:
      "We create beautiful digital experiences that people love. Join us on our journey to make the web a better place.",
    socialLinks: socialLinks,
    copyright: "© 2024 Brand. Made with ❤️",
  },
};

export const Small: Story = {
  args: {
    size: "sm",
    logo: <Logo primary="Compact" secondary="" separator="" size="sm" />,
    sections: defaultSections.slice(0, 2),
    copyright: "© 2024 Compact Inc.",
  },
};

export const Large: Story = {
  args: {
    size: "lg",
    variant: "dark",
    logo: <Logo primary="Enterprise" secondary="" separator="" size="lg" className="text-white" />,
    description:
      "Enterprise-grade solutions for modern businesses. Trusted by thousands of companies worldwide.",
    sections: defaultSections,
    socialLinks: socialLinks,
    copyright: "© 2024 Enterprise Corp. All rights reserved.",
    bottomLinks: bottomLinks,
  },
};

export const CenteredSimple: Story = {
  render: () => (
    <Footer variant="minimal" className="text-center">
      <div className="mb-4">
        <Logo primary="Simple" secondary="" separator="" className="mx-auto" />
      </div>
      <nav className="mb-4 flex justify-center gap-6">
        <a
          href="#"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          About
        </a>
        <a
          href="#"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          Blog
        </a>
        <a
          href="#"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          Contact
        </a>
      </nav>
      <p className="text-sm text-muted-foreground">
        © 2024 Simple. All rights reserved.
      </p>
    </Footer>
  ),
};

export const WithNewsletter: Story = {
  render: () => (
    <Footer
      logo={<Logo primary="Newsletter Co" secondary="" separator="" />}
      sections={defaultSections}
      copyright="© 2024 Newsletter Co. All rights reserved."
    >
      <div className="my-8 rounded-lg bg-muted/50 p-6">
        <h3 className="mb-2 text-lg font-semibold">Stay Updated</h3>
        <p className="mb-4 text-sm text-muted-foreground">
          Get the latest news and updates delivered to your inbox.
        </p>
        <form className="flex gap-2">
          <input
            type="email"
            placeholder="Enter your email"
            className="flex-1 rounded-md border bg-background px-3 py-2 text-sm"
          />
          <button
            type="submit"
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Subscribe
          </button>
        </form>
      </div>
    </Footer>
  ),
};
