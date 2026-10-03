'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { addMissingGuidance, dietitianFields } = require('../src/utils/dietitian-editor');
const schema = require('../src/api/dietitian/content-types/dietitian/schema.json');

test('every dietitian field has guidance and all JSON examples parse as lists', () => {
  for (const [name, field] of Object.entries(schema.attributes)) {
    assert.ok(dietitianFields[name]?.description, name);
    if (field.type !== 'json') continue;
    const example = dietitianFields[name].description.split('Esempio (da adattare): ')[1].split('. Usa le virgolette doppie.')[0];
    assert.ok(Array.isArray(JSON.parse(example)), name);
    assert.match(dietitianFields[name].description, /null significa non compilato/);
  }
});

test('fills missing hints without changing editor layouts, custom help, or schema defaults', () => {
  const original = {
    layouts: { edit: [[{ name: 'shortBio', size: 12 }]] },
    metadatas: { shortBio: { edit: { label: 'Intro', description: 'Custom help', placeholder: '' }, list: { label: 'Intro' } } },
  };
  const snapshot = structuredClone(original);
  const result = addMissingGuidance(original, dietitianFields);
  assert.equal(result.metadatas.shortBio.edit.description, 'Custom help');
  assert.equal(result.metadatas.shortBio.edit.placeholder, dietitianFields.shortBio.placeholder);
  assert.deepEqual(result.layouts, original.layouts);
  assert.deepEqual(original, snapshot);
  assert.equal(addMissingGuidance(result, dietitianFields), null);
  assert.equal(schema.attributes.shortBio.default, undefined);
  assert.equal(schema.attributes.education.default, undefined);
});
