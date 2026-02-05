import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  webpack: (config) => {
    config.watchOptions = {
      poll: 300,
      aggregateTimeout: 500,
  };
    return config;
  },
};

export default nextConfig;
