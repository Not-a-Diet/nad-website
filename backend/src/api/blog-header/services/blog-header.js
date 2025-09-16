'use strict';

/**
 * blog-header service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::blog-header.blog-header');
