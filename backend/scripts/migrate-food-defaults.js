'use strict';

/**
 * One-off migration: backfill required enum fields on food entries
 * that are missing group or cooking_method, then republish them.
 *
 * Run once: node scripts/migrate-food-defaults.js
 * Idempotent — skips entries that already have valid values.
 */

const DEFAULT_GROUP = 'vegetables';
const DEFAULT_COOKING_METHOD = 'boiling';

async function migrate() {
  const { createStrapi } = require('@strapi/strapi');

  const strapi = await createStrapi().load();

  const foods = await strapi.db.query('api::food.food').findMany({
    where: {
      $or: [
        { group: { $null: true } },
        { cooking_method: { $null: true } },
        { group: 'freash_meat' },
      ],
    },
  });

  if (foods.length === 0) {
    console.log('No food entries need migration.');
    await strapi.destroy();
    return;
  }

  console.log(`Found ${foods.length} food entries to migrate.`);

  for (const food of foods) {
    const updates = {};

    if (!food.group || food.group === 'freash_meat') {
      updates.group = DEFAULT_GROUP;
    }
    if (!food.cooking_method) {
      updates.cooking_method = DEFAULT_COOKING_METHOD;
    }

    if (Object.keys(updates).length > 0) {
      await strapi.db.query('api::food.food').update({
        where: { id: food.id },
        data: updates,
      });

      await strapi.entityService.publish('api::food.food', food.id);
      console.log(`Migrated food id=${food.id}: ${JSON.stringify(updates)}`);
    }
  }

  console.log('Migration complete.');
  await strapi.destroy();
}

migrate().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});