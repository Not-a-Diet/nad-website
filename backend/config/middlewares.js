// Prod origin (FRONTEND_URL) plus any comma-separated extras (e.g. Vercel
// preview branch aliases) via CORS_ADDITIONAL_ORIGINS. Localhost kept for dev.
const corsOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:3000',
  ...(process.env.CORS_ADDITIONAL_ORIGINS
    ? process.env.CORS_ADDITIONAL_ORIGINS.split(',').map((o) => o.trim()).filter(Boolean)
    : []),
];

module.exports = [
  'strapi::errors',
  'strapi::security',
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