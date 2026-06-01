// Prod origin (FRONTEND_URL) plus any comma-separated extras (e.g. Vercel
// preview branch aliases) via CORS_ADDITIONAL_ORIGINS. Localhost kept for dev.
const corsOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:3000',
  ...(process.env.CORS_ADDITIONAL_ORIGINS
    ? process.env.CORS_ADDITIONAL_ORIGINS.split(',').map((o) => o.trim()).filter(Boolean)
    : []),
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