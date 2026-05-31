/** @type {import('next').NextConfig} */

const isDev = process.env.NODE_ENV !== 'production';

// Hosts the app needs to load from / connect to.
// Railway uses the local upload provider on a volume, so media + API share one host.
const STRAPI_MEDIA_HOST = 'cms.notadiet.life';
const STRAPI_API_HOST = 'cms.notadiet.life';

const csp = [
  "default-src 'self'",
  // 'unsafe-eval' is needed by the Next.js dev runtime; in prod the Next runtime + GA inline snippets still require 'unsafe-inline'.
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ''} https://www.googletagmanager.com`,
  // vanilla-cookieconsent + Tailwind utilities emit inline style attributes.
  "style-src 'self' 'unsafe-inline'",
  `img-src 'self' data: blob: https://${STRAPI_MEDIA_HOST} https://images.pexels.com https://www.googletagmanager.com https://www.google-analytics.com${isDev ? ' http://localhost:1337' : ''}`,
  "font-src 'self' data:",
  `connect-src 'self' https://${STRAPI_MEDIA_HOST} https://${STRAPI_API_HOST} https://www.google-analytics.com https://*.analytics.google.com https://www.googletagmanager.com${isDev ? ' ws: http://localhost:1337 http://localhost:3000' : ''}`,
  // YouTube embeds + Google Calendar appointment iframes.
  "frame-src 'self' https://www.youtube.com https://www.youtube-nocookie.com https://calendar.google.com",
  "frame-ancestors 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
].join('; ');

const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  { key: 'Content-Security-Policy', value: csp },
];

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '1337',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
      },
      {
        protocol: 'https',
        hostname: STRAPI_MEDIA_HOST,
        pathname: '/**',
      },
    ],
    minimumCacheTTL: 60,
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    qualities: [50, 75, 100],
    dangerouslyAllowLocalIP: process.env.NODE_ENV !== 'production',
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
}

module.exports = nextConfig
