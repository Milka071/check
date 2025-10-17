import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Указываем, что директория app находится в src
  experimental: {
    // appDir: true, // Удалено, так как это устаревшая опция в Next.js 13+
  },
};

export default nextConfig;