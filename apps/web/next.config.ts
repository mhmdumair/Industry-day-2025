import type { NextConfig } from "next";
import * as process from "node:process";

const nextConfig: NextConfig = {
  images: {
    domains: ["via.placeholder.com", "placehold.co"],
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${process.env.NEXT_PUBLIC_BASE_URL}/:path*`,
      },
    ];
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
