import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@workspace/ui/lib/utils";

const footerVariants = cva(
  "w-full",
  {
    variants: {
      variant: {
        default: "bg-background border-t",
        dark: "bg-gray-900 text-white",
        minimal: "bg-transparent",
      },
      size: {
        default: "py-12",
        sm: "py-8",
        lg: "py-16",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface FooterLink {
  label: string;
  href: string;
}

export interface FooterSection {
  title: string;
  links: FooterLink[];
}

export interface SocialLink {
  name: string;
  href: string;
  icon: React.ReactNode;
}

export interface FooterProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof footerVariants> {
  logo?: React.ReactNode;
  description?: string;
  sections?: FooterSection[];
  socialLinks?: SocialLink[];
  copyright?: string;
  bottomLinks?: FooterLink[];
}

const Footer = React.forwardRef<HTMLElement, FooterProps>(
  (
    {
      className,
      variant,
      size,
      logo,
      description,
      sections,
      socialLinks,
      copyright,
      bottomLinks,
      children,
      ...props
    },
    ref,
  ) => {
    const linkClass = variant === "dark" 
      ? "text-gray-300 hover:text-white" 
      : "text-muted-foreground hover:text-foreground";
    
    const headingClass = variant === "dark"
      ? "text-white"
      : "text-foreground";

    return (
      <footer
        ref={ref}
        className={cn(footerVariants({ variant, size, className }))}
        {...props}
      >
        <div className="container mx-auto px-4">
          {/* Main Footer Content */}
          <div className="grid gap-8 lg:grid-cols-12">
            {/* Brand Section */}
            {(logo || description || socialLinks) && (
              <div className="lg:col-span-4">
                {logo && <div className="mb-4">{logo}</div>}
                {description && (
                  <p className={cn("mb-4 text-sm", linkClass)}>
                    {description}
                  </p>
                )}
                {socialLinks && socialLinks.length > 0 && (
                  <div className="flex gap-4">
                    {socialLinks.map((social) => (
                      <a
                        key={social.name}
                        href={social.href}
                        className={cn(
                          "transition-colors",
                          linkClass,
                        )}
                        aria-label={social.name}
                      >
                        {social.icon}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Links Sections */}
            {sections && sections.length > 0 && (
              <div className={cn(
                "grid gap-8 sm:grid-cols-2 md:grid-cols-3",
                logo || description || socialLinks
                  ? "lg:col-span-8"
                  : "lg:col-span-12 lg:grid-cols-4",
              )}>
                {sections.map((section, index) => (
                  <div key={index}>
                    <h3 className={cn("mb-4 text-sm font-semibold", headingClass)}>
                      {section.title}
                    </h3>
                    <ul className="space-y-2">
                      {section.links.map((link, linkIndex) => (
                        <li key={linkIndex}>
                          <a
                            href={link.href}
                            className={cn(
                              "text-sm transition-colors",
                              linkClass,
                            )}
                          >
                            {link.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Custom content */}
          {children}

          {/* Bottom Bar */}
          {(copyright || bottomLinks) && (
            <div className={cn(
              "mt-8 flex flex-col items-center justify-between gap-4 border-t pt-8 sm:flex-row",
              variant === "dark" ? "border-gray-800" : "border-border",
            )}>
              {copyright && (
                <p className={cn("text-sm", linkClass)}>
                  {copyright}
                </p>
              )}
              {bottomLinks && bottomLinks.length > 0 && (
                <nav className="flex flex-wrap gap-4 sm:gap-6">
                  {bottomLinks.map((link, index) => (
                    <a
                      key={index}
                      href={link.href}
                      className={cn(
                        "text-sm transition-colors",
                        linkClass,
                      )}
                    >
                      {link.label}
                    </a>
                  ))}
                </nav>
              )}
            </div>
          )}
        </div>
      </footer>
    );
  },
);
Footer.displayName = "Footer";

export { Footer, footerVariants };