import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  webpack: (config) => {
    config.resolve ??= {};
    config.resolve.alias ??= {};
    config.resolve.alias["@odirico/core"] = path.resolve(
      __dirname,
      "src/vendor/odirico/core",
    );
    config.resolve.alias["@odirico/auth"] = path.resolve(
      __dirname,
      "src/vendor/odirico/auth",
    );
    config.resolve.alias["@odirico/api"] = path.resolve(
      __dirname,
      "src/vendor/odirico/api",
    );
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
