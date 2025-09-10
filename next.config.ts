import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ['fastly.picsum.photos'], // 👈 Add this line
  },
};

export default nextConfig;
