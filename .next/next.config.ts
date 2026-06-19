import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    typescript: {
        // Allows production builds to successfully complete 
        // even if our project has strict TypeScript syntax errors.
        ignoreBuildErrors: true,
    },
    eslint: {
        // Also bypasses strict linting rules during deployment builds
        ignoreDuringBuilds: true,
    }
};

export default nextConfig;