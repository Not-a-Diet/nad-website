// Prod origin (FRONTEND_URL) plus any comma-separated extras (e.g. Vercel
// preview branch aliases) via CORS_ADDITIONAL_ORIGINS. The localhost default is
// only added in development; production must set FRONTEND_URL or boot fails.
const isDev = process.env.NODE_ENV === 'development';

if (!isDev && !process.env.FRONTEND_URL) {
  throw new Error('FRONTEND_URL must be set in production (CORS origin allowlist).');
}

const additionalOrigins = process.env.CORS_ADDITIONAL_ORIGINS
  ? process.env.CORS_ADDITIONAL_ORIGINS.split(',').map((o) => o.trim()).filter(Boolean)
  : [];

const corsOrigins = [
  ...(process.env.FRONTEND_URL ? [process.env.FRONTEND_URL] : []),
  ...(isDev ? ['http://localhost:3000'] : []),
  ...additionalOrigins,
];

// Host(s) the admin Media Library must load images from. With the S3 bucket
// provider, set AWS_CDN_HOST to the bucket's public hostname so admin previews
// aren't blocked by the default 'self'-only CSP.
const mediaHosts = [
  'market-assets.strapi.io',
  ...(process.env.AWS_CDN_HOST ? [process.env.AWS_CDN_HOST] : []),
];

module.exports = [
  'strapi::errors',
  {
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          'connect-src': ["'self'", 'https:'],
          'img-src': ["'self'", 'data:', 'blob:', ...mediaHosts],
          'media-src': ["'self'", 'data:', 'blob:', ...mediaHosts],
          upgradeInsecureRequests: null,
        },
      },
    },
  },
  {
    name: 'strapi::cors',
    config: {
      origin: corsOrigins,
    },
  },
  'strapi::logger',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
  'global::rate-limit',
];