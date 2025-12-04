"use strict";

/**
 * `page-populate-middleware` middleware
 */

const populate = {
  contentSections: {
    populate: {
      picture: {
        fields: ["url", "alternativeText", "caption", "width", "height"],
      },
      buttons: {
        populate: true,
      },
      feature: {
        populate: {
          fields: ["title", "description", "showLink", "newTab", "url", "text"],
          media: {
            fields: ["url", "alternativeText", "caption", "width", "height"],
          },
        },
      },
      member: {
        populate: {
          fields: ["name", "description", "occupation", "skills"],
          profilePhoto: {
            fields: ["url", "alternativeText", "caption", "width", "height"],
          },
        },
      },
      contactForm: {
        populate: {
          submitButton: {
            fields: ["text", "type"],
          }
        },
      },
      hours: {
        populate: true,
      },
      contactLinks: {
        populate: true,
      },
      filosofy: {
        populate: {
          fields: ["title", "body", "type", "sign", "isList"],
        }
      },
      testimonials: {
        populate: {
          picture: {
            fields: ["url", "alternativeText", "caption", "width", "height"],
          },
        },
      },
      posts: {
        populate: {
          category: {
            fields: ["slug", "name"]
          },
          authorsBio: {
            fields: ["name"],
            populate: {
              avatar: {
                fields: ["url"]
              }
            }
          },
          cover: {
            fields: ["url", "alternativeText", "caption", "width", "height"],
          },
        },
      },
      plans: {
        populate: ["product_features"],
      },
    },
  },
  seo: {
    fields: ["metaTitle", "metaDescription"],
    populate: { shareImage: true },
  }
};

module.exports = (config, { strapi }) => {
  // Add your own logic here.
  return async (ctx, next) => {
    ctx.query = {
      populate,
      filters: { slug: ctx.query.filters.slug },
      locale: ctx.query.locale,
    };

    console.log("page-populate-middleware.js: ctx.query = ", ctx.query);

    await next();
  };
};
