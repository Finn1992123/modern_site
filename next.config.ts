import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/app/:path*",
        headers: [
          { key: "Cache-Control", value: "no-cache, max-age=0, must-revalidate" },
        ],
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/app",
        destination: "/app/index.html",
      },
    ];
  },
  images: {
    unoptimized: true,
  },
  experimental: {
    cpus: 1,
    workerThreads: false,
    parallelServerCompiles: false,
    parallelServerBuildTraces: false,
    webpackBuildWorker: false,
    staticGenerationMaxConcurrency: 1,
    staticGenerationMinPagesPerWorker: 1000,
  },
};

export default nextConfig;
