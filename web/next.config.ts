import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  // Desactivar static generation/prerendering completamente
  // Todas las páginas se renderizan bajo demanda
  experimental: {
    isrMemoryCacheSize: 0,
  },
  onDemandEntries: {
    maxInactiveAge: 15 * 60 * 1000,
    pagesBufferLength: 5,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

export default withNextIntl(nextConfig);
