"use client";

import { NavbarV2, type NavColumn, type NavLink, type NavButton } from "@workspace/ui/components/navigation-v2";
import { Logo } from "./logo";
import { ModeToggle } from "./mode-toggle";
import { SanityIcon } from "./sanity-icon";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import type {
  QueryGlobalSeoSettingsResult,
  QueryNavbarDataResult,
} from "@/lib/sanity/sanity.types";

export function NavbarClientV2({
  navbarData,
  settingsData,
}: {
  navbarData: QueryNavbarDataResult;
  settingsData: QueryGlobalSeoSettingsResult;
}) {
  const { siteTitle, logo } = settingsData ?? {};
  const { columns, buttons } = navbarData ?? {};
  const pathname = usePathname();

  // Transform Sanity data to NavigationV2 format
  const navColumns: (NavColumn | NavLink)[] = columns?.map((column) => {
    if (column.type === "column" && column.links) {
      return {
        title: column.title ?? "",
        links: column.links.map((link) => ({
          name: link.name ?? "",
          href: link.href ?? "",
          description: link.description ?? undefined,
          icon: link.icon ? <SanityIcon icon={link.icon} className="h-5 w-5" /> : undefined,
        })),
      };
    } else if (column.type === "link") {
      return {
        name: column.name ?? "",
        href: column.href ?? "",
      };
    }
    return { name: "", href: "" };
  }).filter(Boolean) ?? [];

  // Transform buttons
  const navButtons: NavButton[] = buttons?.map((button) => ({
    text: button.text ?? "",
    href: button.href ?? undefined,
    variant: button.variant === "default" ? "primary" : button.variant as any,
    external: button.openInNewTab ?? undefined,
  })) ?? [];

  return (
    <NavbarV2
      logo={logo && <Logo alt={siteTitle} priority image={logo} />}
      columns={navColumns}
      buttons={navButtons}
      rightContent={<ModeToggle />}
      variant="bordered"
      sticky
      background="blur"
      onLogoClick={() => window.location.href = "/"}
    />
  );
}