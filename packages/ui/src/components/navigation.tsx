import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "@workspace/ui/lib/utils";
import { ButtonV2 as Button } from "./button-v2";
import { Menu, X } from "lucide-react";

// Navigation item types
export interface NavLink {
  name: string;
  href: string;
  external?: boolean;
}

export interface NavButton {
  text: string;
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "ghost";
  external?: boolean;
}

export interface NavigationProps {
  logo?: React.ReactNode;
  links?: NavLink[];
  buttons?: NavButton[];
  className?: string;
  onLogoClick?: () => void;
  rightContent?: React.ReactNode;
}

// Main Navigation component
export const Navigation = React.forwardRef<HTMLDivElement, NavigationProps>(
  ({ 
    logo, 
    links = [], 
    buttons = [], 
    className,
    onLogoClick,
    rightContent,
    ...props 
  }, ref) => {
    const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

    return (
      <nav 
        ref={ref} 
        className={cn("flex items-center justify-between", className)} 
        {...props}
      >
        {/* Logo */}
        <div className="flex items-center gap-8">
          {logo && (
            <div 
              onClick={onLogoClick} 
              className={cn(
                "shrink-0",
                onLogoClick && "cursor-pointer"
              )}
            >
              {logo}
            </div>
          )}
          
          {/* Desktop Navigation Links */}
          <ul className="hidden md:flex items-center gap-6">
            {links.map((link, index) => (
              <li key={index}>
                <a
                  href={link.href}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                  {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                >
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Desktop Right Content */}
        <div className="hidden md:flex items-center gap-3">
          {rightContent}
          {buttons.map((button, index) => {
            if (!button.text) return null;
            
            if (button.href) {
              return (
                <Button
                  key={index}
                  variant={button.variant || "secondary"}
                  size="sm"
                  asChild
                >
                  <a 
                    href={button.href} 
                    {...(button.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  >
                    {button.text}
                  </a>
                </Button>
              );
            }
            return (
              <Button
                key={index}
                variant={button.variant || "secondary"}
                size="sm"
                onClick={button.onClick}
              >
                {button.text}
              </Button>
            );
          })}
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="sm"
          className="md:hidden p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
          <span className="sr-only">Toggle menu</span>
        </Button>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-background border-b md:hidden">
            <div className="container mx-auto px-4 py-4">
              <ul className="space-y-3">
                {links.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      className="block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                      {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
              
              {(rightContent || buttons.length > 0) && (
                <div className="mt-4 pt-4 border-t space-y-3">
                  {rightContent}
                  {buttons.map((button, index) => {
                    if (!button.text) return null;
                    
                    if (button.href) {
                      return (
                        <Button
                          key={index}
                          variant={button.variant || "secondary"}
                          size="sm"
                          className="w-full"
                          asChild
                        >
                          <a 
                            href={button.href}
                            onClick={() => setMobileMenuOpen(false)}
                            {...(button.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                          >
                            {button.text}
                          </a>
                        </Button>
                      );
                    }
                    return (
                      <Button
                        key={index}
                        variant={button.variant || "secondary"}
                        size="sm"
                        className="w-full"
                        onClick={() => {
                          button.onClick?.();
                          setMobileMenuOpen(false);
                        }}
                      >
                        {button.text}
                      </Button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
    );
  }
);
Navigation.displayName = "Navigation";

// Navbar wrapper component for full-width navigation bars
export interface NavbarProps extends NavigationProps {
  sticky?: boolean;
  variant?: "default" | "bordered" | "elevated";
  background?: "transparent" | "solid" | "blur";
}

const navbarVariants = cva(
  "w-full",
  {
    variants: {
      variant: {
        default: "",
        bordered: "border-b",
        elevated: "shadow-sm",
      },
      background: {
        transparent: "bg-transparent",
        solid: "bg-background",
        blur: "bg-background/80 backdrop-blur-md",
      },
      sticky: {
        true: "sticky top-0 z-50",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      background: "solid",
      sticky: false,
    },
  }
);

export const Navbar = React.forwardRef<HTMLElement, NavbarProps>(
  ({ 
    sticky,
    variant,
    background,
    className,
    ...navigationProps
  }, ref) => {
    return (
      <header 
        ref={ref}
        className={cn(navbarVariants({ variant, background, sticky }), className)}
      >
        <div className="container mx-auto px-4 md:px-6">
          <Navigation className="py-4" {...navigationProps} />
        </div>
      </header>
    );
  }
);
Navbar.displayName = "Navbar";