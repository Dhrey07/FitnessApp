import type { MetadataRoute } from 'next';
import { BRAND, BRAND_COLORS } from '@/lib/brand';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: BRAND.legalName,
    short_name: BRAND.shortName,
    description: BRAND.positioning,
    start_url: '/client/dashboard',
    scope: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: BRAND_COLORS.offwhite,
    theme_color: BRAND_COLORS.green900,
    categories: ['health', 'fitness', 'lifestyle'],
    icons: [
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
      { src: '/icons/maskable-192.png', sizes: '192x192', type: 'image/png', purpose: 'maskable' },
      { src: '/icons/maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  };
}
