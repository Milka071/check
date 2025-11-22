import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Игнорировать ошибки ESLint при сборке
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Игнорировать ошибки TypeScript при сборке (только для деплоя)
    ignoreBuildErrors: false,
  },
};

export default nextConfig;