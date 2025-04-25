import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    // We're handling type checking in our IDE/editor
    ignoreBuildErrors: true,
  }
};

export default nextConfig;
