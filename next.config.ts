import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable standalone output for Docker deployment
  output: 'standalone',

  // Enable environment variables to be accessible in the browser
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  },

  // Disable strict mode for better compatibility with Better Auth
  reactStrictMode: true,

  // Configure allowed domains for images if needed
  images: {
    domains: [],
  },
};

export default nextConfig;
// Force rebuild
