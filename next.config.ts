import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Autorise les très grandes images (ex: 4480×6720)
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    // Désactive l'optimisation si une image pose problème
    dangerouslyAllowSVG: false,
  },
};

export default nextConfig;
