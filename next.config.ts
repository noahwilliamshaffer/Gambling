import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['localhost'],
    unoptimized: true,
  },
  experimental: {
    serverActions: true,
  },
  // Increase payload limits
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
    responseLimit: '1mb',
  },
  // Configure middleware timeout
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
};

export default nextConfig;
