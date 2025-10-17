import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Указываем, что директория app находится в src
  experimental: {
    appDir: true,
  },
};

export default nextConfig;