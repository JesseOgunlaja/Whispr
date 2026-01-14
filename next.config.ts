import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    reactStrictMode: false,
    reactCompiler: true,
    watchOptions: {
        pollIntervalMs: 1000,
    },
    output: "standalone",
};

export default nextConfig;
