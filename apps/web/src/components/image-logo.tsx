import Image from "next/image";
import Link from "next/link";
import { urlFor } from "@/lib/sanity/client";
import type { Settings } from "@/lib/sanity/sanity.types";

interface ImageLogoProps {
  image: NonNullable<Settings["logo"]>;
  alt?: string;
  priority?: boolean;
  className?: string;
}

export function ImageLogo({ image, alt = "Logo", priority = false, className }: ImageLogoProps) {
  if (!image?.asset) {
    return null;
  }
  
  const imageUrl = urlFor(image as any).width(200).height(50).url();
  
  return (
    <Link href="/" className={`inline-block ${className || ""}`}>
      <Image
        src={imageUrl}
        alt={alt}
        width={200}
        height={50}
        priority={priority}
        className="h-8 w-auto"
      />
    </Link>
  );
}