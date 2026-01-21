import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable standalone output for Docker deployment
  output: "standalone",

  // Disable Turbopack for now due to path resolution issues
  experimental: {
    // turbo: {},
  },
};

export default nextConfig;
