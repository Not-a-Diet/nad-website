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
        populate: {
          title: true,
          description: true,
          locations: {
            populate: true,
          },
        },
      },
      contactLinks: {
        populate: true,
      },
      bookingCalendar: {
        populate: {
          bookingTitle: true,
          persons: {
            populate: {
              locations: {
                populate: true,
              },
            },
          },
          personLabel: true,
          locationLabel: true,
          selectPersonPlaceholder: true,
          selectLocationPlaceholder: true,
          noSelectionMessage: true,
          viewCalendarButtonText: true,
          backButtonText: true,
        },
      },
      filosofy: {
        populate: {
          fields: ["title", "body", "type", "sign", "isList"],
          items: {
            populate: true,
          },
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
