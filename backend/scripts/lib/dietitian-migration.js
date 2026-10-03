'use strict';

const profileSchema = require('../../src/api/team-member/content-types/team-member/schema.json');
const keyFor = name => String(name || '').normalize('NFKC').trim().replace(/\s+/g, ' ').toLocaleLowerCase();
const slugFor = name => keyFor(name).normalize('NFKD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const cleanComponents = items => (items || []).map(({ id, ...fields }) => fields);

/** Deterministic, reviewable plan. Never merges distinct people by fuzzy matching. */
function buildPlan({ profiles, pages, authors, locales }) {
  const people = new Map();
  const get = (name, locale) => {
    const key = `${locale}:${keyFor(name)}`;
    if (!keyFor(name)) throw new Error('Cannot migrate an unnamed person');
    if (!people.has(key)) people.set(key, { key, locale, data: { name, slug: slugFor(name), listed: false, bookingEnabled: false } });
    return people.get(key);
  };
  for (const profile of profiles) {
    const person = get(profile.name, profile.locale);
    if (person.sourceProfile) throw new Error(`Ambiguous Team Members: ${person.key}`);
    person.sourceProfile = profile.documentId;
    for (const field of Object.keys(profileSchema.attributes)) {
      if (profile[field] != null) person.data[field] = profile[field];
    }
    person.data.profilePhoto = profile.profilePhoto?.id ?? null;
    person.data.contactLinks = cleanComponents(profile.contactLinks);
    person.data.projects = cleanComponents(profile.projects);
    person.data.listed = true;
  }
  for (const page of pages) {
    for (const section of page.contentSections || []) {
      if (section.__component === 'sections.team') {
        for (const member of section.member || []) {
          const { data } = get(member.name, page.locale);
          data.role ||= member.occupation;
          data.shortBio ||= member.description;
          data.profilePhoto ||= member.profilePhoto?.id;
          data.specializations ||= member.skills?.split(/[\n;•]+/).map(s => s.trim()).filter(Boolean);
          data.listed = true;
        }
      }
      if (section.__component === 'sections.contact') {
        for (const person of section.bookingCalendar?.persons || []) {
          const { data } = get(person.name, page.locale);
          data.bookingLocations ||= [];
          for (const location of cleanComponents(person.locations)) {
            const existing = data.bookingLocations.find(item => item.name === location.name);
            if (existing && existing.embedUrl !== location.embedUrl) {
              throw new Error(`Conflicting calendars for ${page.locale}:${person.name}:${location.name}`);
            }
            if (!existing) data.bookingLocations.push(location);
          }
          data.bookingEnabled = data.bookingLocations.length > 0;
          data.listed = true;
        }
      }
    }
  }
  for (const author of authors) {
    for (const locale of locales) {
      const { data } = get(author.name, locale);
      data.shortBio ||= author.bio;
      data.profilePhoto ||= author.avatar?.id;
      for (const field of ['email', 'url', 'sameAs']) if (author[field]) data[field] ??= author[field];
    }
  }
  const slugs = new Set();
  for (const person of people.values()) {
    // Do not invent credentials when a legacy author has no professional profile.
    person.data.role ||= { it: 'Team Not a Diet', pt: 'Equipa Not a Diet' }[person.locale] || 'Not a Diet team';
    const slugKey = `${person.locale}:${person.data.slug}`;
    if (slugs.has(slugKey)) throw new Error(`Ambiguous profile slug: ${slugKey}`);
    slugs.add(slugKey);
  }
  return [...people.values()];
}

async function migrate(strapi, { apply = false } = {}) {
  const locales = (await strapi.db.query('plugin::i18n.locale').findMany()).map(item => item.code);
  const profiles = await strapi.db.query('api::team-member.team-member').findMany({ populate: ['profilePhoto', 'contactLinks', 'projects'] });
  const authors = await strapi.db.query('api::author.author').findMany({ populate: ['avatar'] });
  const pages = await strapi.db.query('api::page.page').findMany({
    where: { publishedAt: { $notNull: true } },
    populate: { contentSections: { on: {
      'sections.team': { populate: { member: { populate: ['profilePhoto'] } } },
      'sections.contact': { populate: { bookingCalendar: { populate: { persons: { populate: ['locations'] } } } } },
    } } },
  });
  const plan = buildPlan({ profiles, pages, authors, locales });
  const existing = await strapi.db.query('api::dietitian.dietitian').findMany();
  const byKey = new Map(existing.map(person => [`${person.locale}:${keyFor(person.name)}`, person]));
  const documents = new Map(existing.map(person => [keyFor(person.name), person.documentId]));
  for (const person of plan) {
    const collision = existing.find(item => item.locale === person.locale && item.slug === person.data.slug && keyFor(item.name) !== keyFor(person.data.name));
    if (collision) throw new Error(`Dietitian slug already belongs to another person: ${person.data.slug}`);
  }
  const articles = await strapi.db.query('api::article.article').findMany({ populate: ['authorsBio', 'dietitian'] });
  const report = {
    profiles: plan.map(person => ({ name: person.data.name, locale: person.locale, action: byKey.has(person.key) ? 'keep' : 'create', bookable: person.data.bookingEnabled })),
    articleRowsToLink: articles.filter(article => article.authorsBio && !article.dietitian).length,
  };
  if (!apply) return report;
  await strapi.db.transaction(async () => {
    for (const person of plan) {
      if (byKey.has(person.key)) continue;
      const documentId = documents.get(keyFor(person.data.name));
      const saved = documentId
        ? await strapi.documents('api::dietitian.dietitian').update({ documentId, locale: person.locale, data: person.data })
        : await strapi.documents('api::dietitian.dietitian').create({ locale: person.locale, data: person.data });
      documents.set(keyFor(person.data.name), saved.documentId);
      byKey.set(person.key, saved);
    }
    // Update only the new relation on each physical draft/published row. A Document
    // Service publish here could overwrite unpublished article edits with a snapshot.
    for (const article of articles) {
      if (!article.authorsBio || article.dietitian) continue;
      const person = byKey.get(`${article.locale}:${keyFor(article.authorsBio.name)}`);
      if (!person) throw new Error(`No dietitian for article ${article.documentId}:${article.locale}`);
      await strapi.db.query('api::article.article').update({
        where: { id: article.id }, data: { dietitian: person.id },
      });
    }
    // Copy existing read grants only; do not grant new write privileges or public
    // access where the old profile collection was not already readable.
    for (const uid of ['plugin::users-permissions.permission', 'admin::api-token-permission']) {
      const relation = uid.startsWith('admin::') ? 'token' : 'role';
      const grants = await strapi.db.query(uid).findMany({
        where: { action: { $in: ['api::team-member.team-member.find', 'api::team-member.team-member.findOne'] } }, populate: [relation],
      });
      for (const grant of grants) {
        const action = grant.action.replace('api::team-member.team-member.', 'api::dietitian.dietitian.');
        const owner = grant[relation]?.id;
        if (!owner) continue;
        const exists = await strapi.db.query(uid).findOne({ where: { action, [relation]: owner } });
        if (!exists) await strapi.db.query(uid).create({ data: { action, [relation]: owner } });
      }
    }
  });
  return report;
}

module.exports = { buildPlan, migrate };
