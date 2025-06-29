import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  transpilePackages: ["@workspace/ui"],
  experimental: {
    reactCompiler: true,
    // ppr: true,
    inlineCss: true,
  },
  logging: {
    fetches: {},
  },
  images: {
    minimumCacheTTL: 31536000,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        pathname: `/images/${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}/**`,
      },
    ],
  },
  // Make environment variables available to Edge Runtime
  env: {
    LOG_LEVEL: process.env.LOG_LEVEL || 'debug',
    EDGE_LOG_HTTP: process.env.EDGE_LOG_HTTP || '',
    EDGE_LOG_ENDPOINT: process.env.EDGE_LOG_ENDPOINT || '/api/logs',
  },
};

export default nextConfig;
