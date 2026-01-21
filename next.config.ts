import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disable Turbopack for now due to path resolution issues
  experimental: {
    // turbo: {},
  },
};

export default nextConfig;
