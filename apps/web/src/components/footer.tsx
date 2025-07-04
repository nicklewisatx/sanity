import { Footer as UIFooter } from "@workspace/ui/components/footer";

import { sanityFetch } from "@/lib/sanity/fetch-with-tracing";
import { queryFooterData, queryGlobalSeoSettings } from "@/lib/sanity/query";
import type {
  QueryFooterDataResult,
  QueryGlobalSeoSettingsResult,
} from "@/lib/sanity/sanity.types";

import { ImageLogo } from "./image-logo";
import {
  FacebookIcon,
  InstagramIcon,
  LinkedinIcon,
  XIcon,
  YoutubeIcon,
} from "./social-icons";

interface FooterProps {
  data: NonNullable<QueryFooterDataResult>;
  settingsData: NonNullable<QueryGlobalSeoSettingsResult>;
}

export async function FooterServer() {
  const [response, settingsResponse] = await Promise.all([
    sanityFetch({
      query: queryFooterData,
    }),
    sanityFetch({
      query: queryGlobalSeoSettings,
    }),
  ]);

  if (!response?.data || !settingsResponse?.data) return <FooterSkeleton />;
  return <Footer data={response.data} settingsData={settingsResponse.data} />;
}

export function FooterSkeleton() {
  return (
    <footer className="mt-16 pb-8">
      <section className="container mx-auto px-4 md:px-6">
        <div className="h-[500px] lg:h-auto">
          <div className="flex flex-col items-center justify-between gap-10 text-center lg:flex-row lg:text-left">
            <div className="flex w-full max-w-96 shrink flex-col items-center justify-between gap-6 lg:items-start">
              <div>
                <span className="flex items-center justify-center gap-4 lg:justify-start">
                  <div className="h-[40px] w-[80px] bg-muted rounded animate-pulse" />
                </span>
                <div className="mt-6 h-16 w-full bg-muted rounded animate-pulse" />
              </div>
              <div className="flex items-center space-x-6">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="h-6 w-6 bg-muted rounded animate-pulse"
                  />
                ))}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-6 lg:gap-20">
              {[1, 2, 3].map((col) => (
                <div key={col}>
                  <div className="mb-6 h-6 w-24 bg-muted rounded animate-pulse" />
                  <div className="space-y-4">
                    {[1, 2, 3, 4].map((item) => (
                      <div
                        key={item}
                        className="h-4 w-full bg-muted rounded animate-pulse"
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-20 flex flex-col justify-between gap-4 border-t pt-8 text-center lg:flex-row lg:items-center lg:text-left">
            <div className="h-4 w-48 bg-muted rounded animate-pulse" />
            <div className="flex justify-center gap-4 lg:justify-start">
              <div className="h-4 w-32 bg-muted rounded animate-pulse" />
              <div className="h-4 w-24 bg-muted rounded animate-pulse" />
            </div>
          </div>
        </div>
      </section>
    </footer>
  );
}

function Footer({ data, settingsData }: FooterProps) {
  const { subtitle, columns } = data;
  const { siteTitle, logo, socialLinks } = settingsData;
  const year = new Date().getFullYear();

  // Transform Sanity data to UI Footer format
  const footerSections =
    columns?.map((column) => ({
      title: column?.title || "",
      links:
        column?.links?.map((link) => ({
          label: link.name || "",
          href: link.href || "#",
        })) || [],
    })) || [];

  // Transform social links to UI Footer format
  const uiSocialLinks = socialLinks
    ? ([
        socialLinks.instagram && {
          name: "Instagram",
          href: socialLinks.instagram,
          icon: <InstagramIcon className="h-5 w-5" />,
        },
        socialLinks.facebook && {
          name: "Facebook",
          href: socialLinks.facebook,
          icon: <FacebookIcon className="h-5 w-5" />,
        },
        socialLinks.twitter && {
          name: "Twitter",
          href: socialLinks.twitter,
          icon: <XIcon className="h-5 w-5" />,
        },
        socialLinks.linkedin && {
          name: "LinkedIn",
          href: socialLinks.linkedin,
          icon: <LinkedinIcon className="h-5 w-5" />,
        },
        socialLinks.youtube && {
          name: "YouTube",
          href: socialLinks.youtube,
          icon: <YoutubeIcon className="h-5 w-5" />,
        },
      ].filter(Boolean) as any)
    : [];

  const bottomLinks = [
    { label: "Terms and Conditions", href: "/terms" },
    { label: "Privacy Policy", href: "/privacy" },
  ];

  return (
    <UIFooter
      className="mt-20"
      logo={logo ? <ImageLogo image={logo} alt={siteTitle} priority /> : undefined}
      description={subtitle || undefined}
      sections={footerSections}
      socialLinks={uiSocialLinks}
      copyright={`© ${year} ${siteTitle}. All rights reserved.`}
      bottomLinks={bottomLinks}
    />
  );
}
