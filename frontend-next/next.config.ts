import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    // Keep root pinned to this app to avoid wrong workspace-root inference with multiple lockfiles.
    root: process.cwd(),
  },
};

export default nextConfig;
