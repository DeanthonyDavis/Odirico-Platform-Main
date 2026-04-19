import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  webpack: (config) => {
    config.resolve ??= {};
    config.resolve.symlinks = false;
    config.cache = false;
    config.snapshot = {
      managedPaths: [],
      immutablePaths: [],
      buildDependencies: {
        hash: false,
        timestamp: false,
      },
      module: {
        hash: false,
        timestamp: false,
      },
      resolve: {
        hash: false,
        timestamp: false,
      },
      resolveBuildDependencies: {
        hash: false,
        timestamp: false,
      },
    };
    return config;
  },
};
export default nextConfig;
