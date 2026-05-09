"use strict";

/**
 * `page-populate-middleware` middleware
 *
 * Strapi v5 requires populate: "*" for dynamic zones (polymorphic structures).
 * Field-specific targeting within dynamic zones is not supported.
 */

const populate = {
  contentSections: {
    populate: "*",
  },
  seo: {
    populate: "*",
  },
};

module.exports = (config, { strapi }) => {
  return async (ctx, next) => {
    const slug = ctx.query?.filters?.slug;
    const locale = ctx.query?.locale;

    ctx.query = {
      populate,
      ...(slug ? { filters: { slug } } : {}),
      ...(locale ? { locale } : {}),
    };

    await next();
  };
};