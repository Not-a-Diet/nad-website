"use strict";

/**
 * `page-populate-middleware` middleware
 *
 * Strapi v5 populate: "*" only goes one level deep.
 * Use `on` filter for dynamic zones with explicit deep populate
 * to include nested components, media, and relations.
 */

const populate = {
  contentSections: {
    on: {
      "sections.hero": {
        populate: { picture: true, buttons: true },
      },
      "sections.features": {
        populate: { feature: { populate: { media: true } } },
      },
      "sections.team": {
        populate: {
          member: { populate: { profilePhoto: true } },
          filosofy: { populate: { items: true } },
        },
      },
      "sections.testimonials-group": {
        populate: { testimonials: { populate: { picture: true } } },
      },
      "sections.pricing": {
        populate: { plans: { populate: { product_features: true } } },
      },
      "sections.contact": {
        populate: {
          contactLinks: true,
          hours: { populate: { locations: true } },
          bookingCalendar: { populate: { persons: { populate: { locations: true } } } },
        },
      },
      "sections.featured-posts": {
        populate: { posts: { populate: "*" } },
      },
      "sections.rich-text": { populate: "*" },
      "sections.heading": { populate: "*" },
      "sections.bottom-actions": { populate: "*" },
      "sections.large-video": { populate: "*" },
      "sections.feature-columns-group": { populate: "*" },
      "sections.feature-rows-group": { populate: "*" },
    },
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