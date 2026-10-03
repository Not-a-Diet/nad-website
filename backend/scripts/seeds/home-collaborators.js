'use strict';

// Replace these named placeholders with approved names and uploads in Strapi.
module.exports = {
  contentType: 'api::page.page',
  endpoint: 'pages',
  uniqueBy: { slug: 'home' },
  mode: 'append-section',
  entries: [
    { locale: 'en', title: 'Our collaborators', placeholder: 'Partner logo' },
    { locale: 'it', title: 'Collaborano con noi', placeholder: 'Logo partner' },
    { locale: 'pt', title: 'Os nossos parceiros', placeholder: 'Logo do parceiro' },
  ].map(({ locale, title, placeholder }) => ({
    locale,
    section: {
      __component: 'sections.collaborators',
      title,
      logos: Array.from({ length: 4 }, (_, i) => ({ title: `${placeholder} ${i + 1}` })),
    },
  })),
};
