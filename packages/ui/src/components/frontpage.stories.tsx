import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Logo } from "./logo.js";
import { Hero } from "./hero.js";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "./card.js";
import { CTA } from "./cta.js";
import { Footer } from "./footer.js";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from "./navigation-menu.js";
import { Button } from "./button.js";
import { Star, ChevronRight, Code, Layers, PenTool } from "lucide-react";

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
  title: "Pages/Frontpage",
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const FrontpageComponent = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-8">
              <Logo size="default" text="Nick Lewis" />
              <NavigationMenu className="hidden md:flex">
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuLink className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50">
                      Home
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <NavigationMenuLink className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50">
                      Blog
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <NavigationMenuLink className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50">
                      About
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <NavigationMenuLink className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50">
                      Contact
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm">
                Subscribe
              </Button>
              <Button size="sm">Let&apos;s Talk</Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <Hero
        variant="gradient"
        size="lg"
        alignment="center"
        title="Hi, I'm Nick Lewis"
        subtitle="Full-Stack Developer & Tech Enthusiast"
        description="I write about web development, software architecture, and the latest technologies. Join me as I explore the ever-evolving world of tech."
        actions={[
          { text: "Read My Blog", variant: "default" },
          { text: "Get In Touch", variant: "outline" },
        ]}
      />

      {/* Features/Cards Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
              What I Write About
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Exploring the latest in web development, sharing insights, and
              building in public.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card variant="elevated">
              <CardHeader>
                <div className="rounded-lg bg-primary/10 p-3 w-fit mb-4">
                  <Code className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Web Development</CardTitle>
                <CardDescription>
                  Modern frameworks, best practices, and coding techniques
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Deep dives into React, Next.js, TypeScript, and the modern web
                  development ecosystem.
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" size="sm">
                  Read articles <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>

            <Card variant="elevated">
              <CardHeader>
                <div className="rounded-lg bg-primary/10 p-3 w-fit mb-4">
                  <Layers className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Architecture & Design</CardTitle>
                <CardDescription>
                  Building scalable applications with clean architecture
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Patterns, principles, and strategies for building maintainable
                  software systems.
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" size="sm">
                  Explore topics <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>

            <Card variant="elevated">
              <CardHeader>
                <div className="rounded-lg bg-primary/10 p-3 w-fit mb-4">
                  <PenTool className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Tutorials & Guides</CardTitle>
                <CardDescription>
                  Step-by-step guides for developers at all levels
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Practical tutorials to help you level up your skills and build
                  better applications.
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" size="sm">
                  Start learning <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-4 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">150+</div>
              <div className="text-muted-foreground">Articles Written</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">50k+</div>
              <div className="text-muted-foreground">Monthly Readers</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">10+</div>
              <div className="text-muted-foreground">Years Experience</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">5⭐</div>
              <div className="text-muted-foreground">Reader Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
              What Readers Say
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Feedback from developers who&apos;ve found value in my content.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader>
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-primary text-primary"
                    />
                  ))}
                </div>
                <CardDescription>
                  &quot;Nick&apos;s tutorials on Next.js and TypeScript have
                  been invaluable. Clear explanations and practical examples
                  that actually work.&quot;
                </CardDescription>
              </CardHeader>
              <CardFooter>
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-muted h-10 w-10" />
                  <div>
                    <div className="font-semibold text-sm">Sarah Chen</div>
                    <div className="text-xs text-muted-foreground">
                      Frontend Developer
                    </div>
                  </div>
                </div>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-primary text-primary"
                    />
                  ))}
                </div>
                <CardDescription>
                  &quot;The architecture posts are gold. Finally someone who
                  explains complex patterns in a way that makes sense.&quot;
                </CardDescription>
              </CardHeader>
              <CardFooter>
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-muted h-10 w-10" />
                  <div>
                    <div className="font-semibold text-sm">Alex Rivera</div>
                    <div className="text-xs text-muted-foreground">
                      Software Architect
                    </div>
                  </div>
                </div>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-primary text-primary"
                    />
                  ))}
                </div>
                <CardDescription>
                  &quot;Been following Nick&apos;s blog for years. Always
                  up-to-date with the latest tech and best practices.&quot;
                </CardDescription>
              </CardHeader>
              <CardFooter>
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-muted h-10 w-10" />
                  <div>
                    <div className="font-semibold text-sm">Jordan Smith</div>
                    <div className="text-xs text-muted-foreground">
                      Full-Stack Engineer
                    </div>
                  </div>
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <CTA
        variant="gradient"
        size="lg"
        alignment="center"
        heading="Stay Updated"
        description="Get the latest articles and tutorials delivered straight to your inbox. No spam, unsubscribe anytime."
        actions={[
          { text: "Subscribe to Newsletter", variant: "default" },
          { text: "Follow on Twitter", variant: "outline" },
        ]}
        backgroundPattern
      />

      {/* Footer */}
      <Footer
        variant="dark"
        logo={<Logo size="default" text="Nick Lewis" className="text-white" />}
        description="Sharing knowledge and building cool things on the web."
        sections={[
          {
            title: "Content",
            links: [
              { label: "Latest Posts", href: "#" },
              { label: "Tutorials", href: "#" },
              { label: "Code Snippets", href: "#" },
              { label: "Projects", href: "#" },
            ],
          },
          {
            title: "Topics",
            links: [
              { label: "React & Next", href: "#" },
              { label: "TypeScript", href: "#" },
              { label: "Architecture", href: "#" },
              { label: "Performance", href: "#" },
            ],
          },
          {
            title: "Connect",
            links: [
              { label: "Newsletter", href: "#" },
              { label: "RSS Feed", href: "#" },
              { label: "Contact", href: "#" },
              { label: "About Me", href: "#" },
            ],
          },
        ]}
        socialLinks={[
          { name: "Twitter", href: "#", icon: <TwitterIcon /> },
          { name: "GitHub", href: "#", icon: <GitHubIcon /> },
          { name: "LinkedIn", href: "#", icon: <LinkedInIcon /> },
        ]}
        bottomLinks={[
          { label: "Privacy", href: "#" },
          { label: "Terms", href: "#" },
        ]}
      />
    </div>
  );
};

export const Default: Story = {
  render: () => <FrontpageComponent />,
};

export const CompactVersion: Story = {
  render: () => (
    <div className="min-h-screen bg-white">
      {/* Simple Navigation */}
      <header className="border-b">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <Logo size="default" text="Nick Lewis" />
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm">
                Blog
              </Button>
              <Button size="sm">Subscribe</Button>
            </div>
          </div>
        </div>
      </header>

      {/* Compact Hero */}
      <Hero
        variant="default"
        size="sm"
        alignment="center"
        title="Hi, I'm Nick"
        subtitle="I write about web development"
        actions={[{ text: "Read Blog", variant: "default" }]}
      />

      {/* Simple Cards */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Development</CardTitle>
                <CardDescription>Modern web technologies</CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Architecture</CardTitle>
                <CardDescription>Scalable system design</CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Tutorials</CardTitle>
                <CardDescription>Learn by building</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Simple CTA */}
      <CTA
        variant="bordered"
        size="sm"
        alignment="center"
        heading="Get updates"
        actions={[{ text: "Subscribe", variant: "default" }]}
      />

      {/* Minimal Footer */}
      <Footer
        variant="minimal"
        logo={<Logo size="sm">Nick Lewis</Logo>}
        bottomLinks={[
          { label: "Privacy", href: "#" },
          { label: "RSS", href: "#" },
        ]}
      />
    </div>
  ),
};

export const DarkTheme: Story = {
  render: () => (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Dark Navigation */}
      <header className="border-b border-slate-800">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <Logo size="default" text="Nick Lewis" className="text-white" />
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:text-white hover:bg-slate-800"
              >
                Blog
              </Button>
              <Button size="sm" variant="secondary">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Dark Hero */}
      <Hero
        variant="dark"
        size="lg"
        alignment="center"
        title="Code After Dark"
        subtitle="Thoughts on development from a night owl"
        description="Join me as I explore web development, share insights, and build cool things - preferably after midnight."
        actions={[
          { text: "Read Latest", variant: "default" },
          { text: "Subscribe", variant: "outline" },
        ]}
      />

      {/* Dark Cards */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Late Night Coding</CardTitle>
                <CardDescription className="text-slate-400">
                  Best practices for productive night sessions
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">
                  Dark Mode Everything
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Tools and tips for the dark theme enthusiast
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Midnight Musings</CardTitle>
                <CardDescription className="text-slate-400">
                  Thoughts on architecture and design
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Dark CTA */}
      <CTA
        variant="dark"
        size="lg"
        alignment="center"
        heading="Join the night shift"
        description="Get updates when I publish new content"
        actions={[{ text: "Subscribe", variant: "default" }]}
        className="bg-slate-800"
      />

      {/* Already dark footer */}
      <Footer
        variant="dark"
        logo={<Logo size="default" text="Nick Lewis" className="text-white" />}
        description="Building and writing in the quiet hours."
        sections={[
          {
            title: "Content",
            links: [
              { label: "Articles", href: "#" },
              { label: "Tutorials", href: "#" },
            ],
          },
          {
            title: "Connect",
            links: [
              { label: "Twitter", href: "#" },
              { label: "GitHub", href: "#" },
            ],
          },
        ]}
      />
    </div>
  ),
};
