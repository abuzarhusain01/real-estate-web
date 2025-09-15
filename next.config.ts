import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // ✅ Ignore ESLint errors
  },
  typescript: {
    ignoreBuildErrors: true, // ✅ Ignore TypeScript errors
  },
  images: {
    domains: ["fastly.picsum.photos"], // ✅ Allow external images
  },
};

export default nextConfig;
