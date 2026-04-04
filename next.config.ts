import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  typescript: { ignoreBuildErrors: true },
  reactStrictMode: true,
  images: {
    unoptimized: true,
    formats: ['image/webp', 'image/avif'],
    remotePatterns: [{ protocol: 'https', hostname: 'images.unsplash.com' }],
  },
  async headers() {
    return [
      { source: '/(.*)', headers: [
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'X-Frame-Options', value: 'DENY' },
        { key: 'X-XSS-Protection', value: '1; mode=block' },
      ]},
      { source: '/(.*)\\.(js|css|woff2|jpg|jpeg|png|webp|avif|svg|ico)', headers: [
        { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
      ]},
    ];
  },
};
export default nextConfig;
