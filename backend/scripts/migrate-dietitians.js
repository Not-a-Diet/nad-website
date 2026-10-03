#!/usr/bin/env node
'use strict';

const path = require('node:path');
const { migrate } = require('./lib/dietitian-migration');

async function main() {
  process.chdir(path.resolve(__dirname, '..'));
  require('dotenv').config({ quiet: true });
  const args = process.argv.slice(2);
  if (args.some(arg => !['--apply', '--allow-production'].includes(arg))) throw new Error('Usage: node scripts/migrate-dietitians.js [--apply] [--allow-production]');
  if (process.env.NODE_ENV === 'production' && !args.includes('--allow-production')) {
    throw new Error('Production requires an explicit --allow-production flag and a database backup.');
  }
  const { createStrapi, compileStrapi } = require('@strapi/strapi');
  const app = createStrapi(await compileStrapi());
  try {
    await app.load();
    const plan = await migrate(app);
    if (args.includes('--apply')) {
      // Strapi 5.46 fires document events after commit without awaiting them.
      // Wait for this migration's events before destroying the SQLite pool.
      const pending = new Set(plan.profiles.filter(p => p.action === 'create').map(p => `${p.locale}:${p.name}`));
      let finish;
      const drained = new Promise(resolve => { finish = resolve; });
      const onCreate = ({ uid, entry }) => {
        if (uid !== 'api::dietitian.dietitian') return;
        pending.delete(`${entry.locale}:${entry.name}`);
        if (!pending.size) finish();
      };
      app.eventHub.on('entry.create', onCreate);
      let timer;
      try {
        await migrate(app, { apply: true });
        if (!pending.size) finish();
        await Promise.race([drained, new Promise((_, reject) => {
          timer = setTimeout(() => reject(new Error('Timed out waiting for dietitian document events')), 15000);
        })]);
      } finally {
        clearTimeout(timer);
        app.eventHub.off('entry.create', onCreate);
      }
    }
    console.log(JSON.stringify(plan, null, 2));
  } finally {
    await app.destroy();
  }
}

if (require.main === module) main().catch(error => { console.error(error); process.exitCode = 1; });
