'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { buildPlan } = require('./lib/dietitian-migration');
const fixtures = () => ({
  locales: ['en', 'it'],
  profiles: [{ documentId: 'profile', locale: 'en', name: 'Jane Doe', slug: 'jane', role: 'Dietitian', bio: 'Full bio', degree: ['Degree'], profilePhoto: { id: 4 }, contactLinks: [{ id: 8, text: 'Website', url: 'https://example.com' }] }],
  pages: [{ locale: 'en', contentSections: [
    { __component: 'sections.team', member: [{ name: 'Jane Doe', occupation: 'Legacy role', description: 'Summary', profilePhoto: { id: 9 } }] },
    { __component: 'sections.contact', bookingCalendar: { persons: [{ name: 'Jane Doe', locations: [{ id: 2, name: 'Online', embedUrl: 'https://example.com/calendar' }] }] } },
  ] }],
  authors: [{ name: 'Jane Doe', avatar: { id: 3 }, sameAs: ['https://example.com/profile'] }],
});

test('merges existing content without replacing profile fields; strips component IDs, preserves media IDs', () => {
  const source = fixtures(); const original = structuredClone(source);
  const plan = buildPlan(source); const person = plan.find(p => p.locale === 'en').data;
  assert.equal(person.slug, 'jane'); assert.equal(person.role, 'Dietitian');
  assert.equal(person.bio, 'Full bio'); assert.deepEqual(person.degree, ['Degree']);
  assert.equal(person.shortBio, 'Summary'); assert.equal(person.profilePhoto, 4);
  assert.equal(person.contactLinks[0].id, undefined); assert.equal(person.bookingLocations[0].id, undefined);
  assert.equal(person.bookingEnabled, true); assert.deepEqual(source, original);
});

test('does not invent qualifications or list author-only records on the team', () => {
  const plan = buildPlan(fixtures()); const italian = plan.find(p => p.locale === 'it').data;
  assert.equal(italian.listed, false); assert.equal(italian.bookingEnabled, false);
  assert.equal(italian.role, 'Team Not a Diet');
});

test('rejects conflicting calendars instead of silently booking the wrong location', () => {
  const source = fixtures(); const second = structuredClone(source.pages[0]);
  second.contentSections[1].bookingCalendar.persons[0].locations[0].embedUrl = 'https://example.com/different';
  source.pages.push(second); assert.throws(() => buildPlan(source), /Conflicting calendars/);
});

test('repeated page references do not duplicate calendar locations', () => {
  const source = fixtures(); source.pages.push(structuredClone(source.pages[0]));
  assert.equal(buildPlan(source)[0].data.bookingLocations.length, 1);
});

test('duplicate names and slug collisions stop the migration for manual resolution', () => {
  const source = fixtures(); source.profiles.push({ ...source.profiles[0], documentId: 'different' });
  assert.throws(() => buildPlan(source), /Ambiguous Team Members/);
  const other = fixtures(); other.profiles.push({ ...other.profiles[0], name: 'Someone Else' });
  assert.throws(() => buildPlan(other), /Ambiguous profile slug/);
});
