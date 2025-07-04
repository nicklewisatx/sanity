import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "@workspace/ui/lib/utils";
import { 
  NavigationMenu, 
  NavigationMenuContent, 
  NavigationMenuItem, 
  NavigationMenuLink, 
  NavigationMenuList, 
  NavigationMenuTrigger,
  navigationMenuTriggerStyle
} from "./navigation-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "./sheet";
import { Button } from "./button";
import { ButtonV2 } from "./button-v2";
import { Menu } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./accordion";

// Navigation item types
export interface NavLink {
  name: string;
  href: string;
  description?: string;
  icon?: React.ReactNode;
  external?: boolean;
}

export interface NavColumn {
  title: string;
  links: NavLink[];
}

export interface NavButton {
  text: string;
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  external?: boolean;
}

export interface NavigationProps {
  logo?: React.ReactNode;
  columns?: (NavColumn | NavLink)[];
  buttons?: NavButton[];
  className?: string;
  onLogoClick?: () => void;
  mobileBreakpoint?: "sm" | "md" | "lg";
  rightContent?: React.ReactNode;
}

// Helper to determine if item is a column
function isNavColumn(item: NavColumn | NavLink): item is NavColumn {
  return 'links' in item;
}

// Navigation link item component
const NavLinkItem = React.forwardRef<
  HTMLAnchorElement,
  { link: NavLink; className?: string; onClick?: () => void }
>(({ link, className, onClick }, ref) => {
  const linkProps = link.external 
    ? { target: "_blank", rel: "noopener noreferrer" } 
    : {};

  return (
    <a
      ref={ref}
      href={link.href}
      className={cn(
        "flex select-none gap-3 rounded-md p-3 leading-none outline-none transition-colors duration-150",
        "hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
        className
      )}
      onClick={onClick}
      {...linkProps}
    >
      {link.icon && (
        <div className="shrink-0 text-muted-foreground">{link.icon}</div>
      )}
      <div className="space-y-1">
        <div className="text-sm font-medium leading-none">{link.name}</div>
        {link.description && (
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {link.description}
          </p>
        )}
      </div>
    </a>
  );
});
NavLinkItem.displayName = "NavLinkItem";

// Desktop navigation menu
function DesktopNavigation({ 
  columns = [], 
  buttons = [], 
  rightContent 
}: Pick<NavigationProps, 'columns' | 'buttons' | 'rightContent'>) {
  return (
    <div className="flex items-center justify-between gap-6">
      <NavigationMenu>
        <NavigationMenuList>
          {columns.map((item, index) => {
            if (isNavColumn(item)) {
              // Dropdown column
              return (
                <NavigationMenuItem key={index}>
                  <NavigationMenuTrigger className="text-muted-foreground">
                    {item.title}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className={cn(
                      "p-3",
                      item.links.length <= 4 && "w-80",
                      item.links.length > 4 && item.links.length <= 8 && "grid grid-cols-2 gap-2 w-[500px]",
                      item.links.length > 8 && "grid grid-cols-3 gap-2 w-[700px]"
                    )}>
                      {item.links.map((link, linkIndex) => (
                        <li key={linkIndex}>
                          <NavigationMenuLink asChild>
                            <NavLinkItem link={link} />
                          </NavigationMenuLink>
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              );
            } else {
              // Simple link
              return (
                <NavigationMenuItem key={index}>
                  <NavigationMenuLink 
                    href={item.href}
                    className={cn(navigationMenuTriggerStyle(), "text-muted-foreground")}
                  >
                    {item.name}
                  </NavigationMenuLink>
                </NavigationMenuItem>
              );
            }
          })}
        </NavigationMenuList>
      </NavigationMenu>

      <div className="flex items-center gap-3">
        {rightContent}
        {buttons.map((button, index) => {
          // Skip buttons without text
          if (!button.text) return null;
          
          if (button.href) {
            return (
              <ButtonV2
                key={index}
                variant={button.variant || "outline"}
                asChild
              >
                <a 
                  href={button.href} 
                  {...(button.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                >
                  {button.text}
                </a>
              </ButtonV2>
            );
          }
          return (
            <ButtonV2
              key={index}
              variant={button.variant || "outline"}
              onClick={button.onClick}
            >
              {button.text}
            </ButtonV2>
          );
        })}
      </div>
    </div>
  );
}

// Mobile navigation menu
function MobileNavigation({ 
  logo, 
  columns = [], 
  buttons = [], 
  onLogoClick,
  rightContent 
}: Pick<NavigationProps, 'logo' | 'columns' | 'buttons' | 'onLogoClick' | 'rightContent'>) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="shrink-0">
          <Menu className="h-4 w-4" />
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[300px] sm:w-[400px]">
        <SheetHeader>
          <SheetTitle onClick={onLogoClick} className="cursor-pointer">
            {logo || "Navigation"}
          </SheetTitle>
        </SheetHeader>
        
        <div className="mt-8 flex flex-col gap-4">
          <Accordion type="single" collapsible className="w-full">
            {columns.map((item, index) => {
              if (isNavColumn(item)) {
                // Accordion for columns
                return (
                  <AccordionItem key={index} value={`item-${index}`} className="border-b-0">
                    <AccordionTrigger className="hover:no-underline">
                      <span className="text-left">{item.title}</span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="flex flex-col gap-1">
                        {item.links.map((link, linkIndex) => (
                          <NavLinkItem 
                            key={linkIndex} 
                            link={link}
                            onClick={() => setIsOpen(false)}
                            className="ml-4"
                          />
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                );
              } else {
                // Simple link
                return (
                  <NavLinkItem
                    key={index}
                    link={item}
                    onClick={() => setIsOpen(false)}
                  />
                );
              }
            })}
          </Accordion>
          
          {rightContent && (
            <div className="border-t pt-4">
              {rightContent}
            </div>
          )}
          
          {buttons.length > 0 && (
            <div className="border-t pt-4 flex flex-col gap-3">
              {buttons.map((button, index) => {
                // Skip buttons without text
                if (!button.text) return null;
                
                if (button.href) {
                  return (
                    <ButtonV2
                      key={index}
                      variant={button.variant || "outline"}
                      className="w-full"
                      asChild
                    >
                      <a 
                        href={button.href}
                        onClick={() => setIsOpen(false)}
                        {...(button.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      >
                        {button.text}
                      </a>
                    </ButtonV2>
                  );
                }
                return (
                  <ButtonV2
                    key={index}
                    variant={button.variant || "outline"}
                    onClick={() => {
                      button.onClick?.();
                      setIsOpen(false);
                    }}
                    className="w-full"
                  >
                    {button.text}
                  </ButtonV2>
                );
              })}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

// Main Navigation component
export const NavigationV2 = React.forwardRef<HTMLDivElement, NavigationProps>(
  ({ 
    logo, 
    columns = [], 
    buttons = [], 
    className,
    onLogoClick,
    mobileBreakpoint = "md",
    rightContent,
    ...props 
  }, ref) => {
    const [isMounted, setIsMounted] = React.useState(false);

    React.useEffect(() => {
      setIsMounted(true);
    }, []);

    // Prevent hydration mismatch
    if (!isMounted) {
      return (
        <nav 
          ref={ref} 
          className={cn("flex items-center justify-between", className)} 
          {...props}
        >
          <div className="h-10 w-32 bg-muted animate-pulse rounded" />
          <div className="flex gap-4">
            <div className="h-10 w-24 bg-muted animate-pulse rounded" />
            <div className="h-10 w-24 bg-muted animate-pulse rounded" />
          </div>
        </nav>
      );
    }

    const mobileClass = {
      sm: "sm:hidden",
      md: "md:hidden",
      lg: "lg:hidden",
    }[mobileBreakpoint];

    const desktopClass = {
      sm: "hidden sm:flex",
      md: "hidden md:flex",
      lg: "hidden lg:flex",
    }[mobileBreakpoint];

    return (
      <nav 
        ref={ref} 
        className={cn("flex items-center justify-between", className)} 
        {...props}
      >
        {/* Logo */}
        <div className="flex items-center gap-6">
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
          
          {/* Desktop Navigation */}
          <div className={desktopClass}>
            <DesktopNavigation 
              columns={columns} 
              buttons={buttons}
              rightContent={rightContent}
            />
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className={mobileClass}>
          <MobileNavigation 
            logo={logo}
            columns={columns} 
            buttons={buttons}
            onLogoClick={onLogoClick}
            rightContent={rightContent}
          />
        </div>
      </nav>
    );
  }
);
NavigationV2.displayName = "NavigationV2";

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

export const NavbarV2 = React.forwardRef<HTMLElement, NavbarProps>(
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
          <NavigationV2 className="py-4" {...navigationProps} />
        </div>
      </header>
    );
  }
);
NavbarV2.displayName = "NavbarV2";