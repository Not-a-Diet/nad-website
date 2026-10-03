'use strict';

const { configureDietitianEditor } = require('./utils/dietitian-editor');

module.exports = {
  register(/*{ strapi }*/) {},

  async bootstrap({ strapi }) {
    await configureDietitianEditor(strapi);
    if (process.env.NODE_ENV === 'production' && !process.env.FRONTEND_URL) {
      strapi.log.warn(
        'FRONTEND_URL is not set in production. CORS will fall back to http://localhost:3000, which will break in production.'
      );
    }
  },
};
