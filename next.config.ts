import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "encrypted-tbn0.gstatic.com",
        port: "",
        pathname: "/**",
      },
    ],
    domains: [
      "newprojects.99acres.com",
      "fastly.picsum.photos",
      "encrypted-tbn0.gstatic.com",
    ],
  },
};

export default nextConfig;
