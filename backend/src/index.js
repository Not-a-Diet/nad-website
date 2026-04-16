'use strict';

module.exports = {
  register(/*{ strapi }*/) {},

  bootstrap({ strapi }) {
    if (process.env.NODE_ENV === 'production' && !process.env.FRONTEND_URL) {
      strapi.log.warn(
        'FRONTEND_URL is not set in production. CORS will fall back to http://localhost:3000, which will break in production.'
      );
    }
  },
};
