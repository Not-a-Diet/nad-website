'use strict';

const { test } = require('node:test');
const assert = require('node:assert/strict');
const { buildAppendSectionData } = require('./seed');

test('appending preserves published page fields even when the draft is stale', () => {
  const entry = {
    id: 85,
    documentId: 'home-document',
    locale: 'it',
    publishedAt: '2026-01-01T00:00:00Z',
    slug: 'home',
    shortName: 'Home',
    heading: 'Published heading',
    description: 'Published description',
    seo: { id: 9, metaTitle: 'Published SEO' },
    contentSections: [{
      id: 12,
      __component: 'sections.hero',
      title: 'Existing hero',
      picture: [{ id: 7, url: '/uploads/hero.png', mime: 'image/png' }],
    }],
  };
  const addition = { __component: 'sections.collaborators', title: 'Collaborano con noi', logos: [] };
  const data = buildAppendSectionData(entry, addition);
  assert.equal(data.slug, 'home');
  assert.equal(data.heading, entry.heading);
  assert.equal(data.description, entry.description);
  assert.deepEqual(data.seo, { metaTitle: 'Published SEO' });
  assert.equal(data.id, undefined);
  assert.equal(data.documentId, undefined);
  assert.equal(data.locale, undefined);
  assert.equal(data.publishedAt, undefined);
  assert.deepEqual(data.contentSections, [
    { __component: 'sections.hero', title: 'Existing hero', picture: [7] },
    addition,
  ]);
  assert.equal(Object.keys(data.contentSections[0])[0], '__component');
  assert.equal(entry.contentSections.length, 1);
  assert.equal(entry.contentSections[0].id, 12);
});
