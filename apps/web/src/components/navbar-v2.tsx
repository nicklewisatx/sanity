import { sanityFetch } from "@/lib/sanity/fetch-with-tracing";
import { queryGlobalSeoSettings, queryNavbarData } from "@/lib/sanity/query";
import type {
  QueryGlobalSeoSettingsResult,
  QueryNavbarDataResult,
} from "@/lib/sanity/sanity.types";

import { NavbarClientV2 } from "./navbar-client-v2";

export async function NavbarServerV2() {
  const [navbarData, settingsData] = await Promise.all([
    sanityFetch({ query: queryNavbarData }),
    sanityFetch({ query: queryGlobalSeoSettings }),
  ]);
  
  return (
    <NavbarV2 navbarData={navbarData.data} settingsData={settingsData.data} />
  );
}

export function NavbarV2({
  navbarData,
  settingsData,
}: {
  navbarData: QueryNavbarDataResult;
  settingsData: QueryGlobalSeoSettingsResult;
}) {
  return <NavbarClientV2 navbarData={navbarData} settingsData={settingsData} />;
}

export function NavbarSkeletonV2() {
  return (
    <div className="w-full border-b bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between py-4">
          <div className="h-10 w-32 bg-muted animate-pulse rounded" />
          <div className="flex gap-4">
            <div className="hidden md:flex gap-4">
              <div className="h-10 w-24 bg-muted animate-pulse rounded" />
              <div className="h-10 w-24 bg-muted animate-pulse rounded" />
            </div>
            <div className="h-10 w-10 bg-muted animate-pulse rounded md:hidden" />
          </div>
        </div>
      </div>
    </div>
  );
}