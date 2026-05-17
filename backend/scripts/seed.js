#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const SEEDS_DIR = path.join(__dirname, 'seeds');
const NAME_REGEX = /^[a-z0-9-]+$/;
const LOCAL_HOSTS = new Set(['localhost', '127.0.0.1', '::1']);

function fail(msg) {
  console.error(`[seed:dev] ${msg}`);
  process.exit(1);
}

function loadEnvFile() {
  const envPath = path.join(__dirname, '..', '.env');
  if (!fs.existsSync(envPath)) return;
  const text = fs.readFileSync(envPath, 'utf8');
  for (const line of text.split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (!m) continue;
    const [, key, raw] = m;
    if (process.env[key] !== undefined) continue;
    let value = raw;
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    process.env[key] = value;
  }
}

function listAvailableSeeds() {
  if (!fs.existsSync(SEEDS_DIR)) return [];
  return fs
    .readdirSync(SEEDS_DIR)
    .filter((f) => f.endsWith('.js'))
    .map((f) => f.replace(/\.js$/, ''));
}

function printUsage() {
  const seeds = listAvailableSeeds();
  console.log('Usage: yarn seed:dev <name>     run a single seed manifest');
  console.log('       yarn seed:dev:all        run every seed manifest');
  console.log('');
  if (seeds.length === 0) {
    console.log('No seed manifests found in backend/scripts/seeds/.');
  } else {
    console.log('Available seeds:');
    for (const s of seeds) console.log(`  - ${s}`);
  }
  console.log('');
  console.log('Requires backend dev server running. See backend/scripts/README.md.');
}

function assertSafeEnv() {
  if (process.env.NODE_ENV === 'production') {
    fail('refusing to run with NODE_ENV=production.');
  }
  if (!process.env.SEED_DEV_TOKEN) {
    fail('SEED_DEV_TOKEN is not set. Create one in admin → Settings → API Tokens and add it to backend/.env. See backend/scripts/README.md.');
  }
  const urlString = process.env.STRAPI_URL || 'http://localhost:1337';
  let url;
  try {
    url = new URL(urlString);
  } catch {
    fail(`invalid STRAPI_URL: ${urlString}`);
  }
  if (!LOCAL_HOSTS.has(url.hostname)) {
    fail(`refusing non-local STRAPI_URL host: ${url.hostname}. This tool is local-only.`);
  }
}

function resolveManifest(name) {
  if (!NAME_REGEX.test(name)) {
    fail(`invalid seed name: ${name}. Allowed: lowercase letters, digits, dashes.`);
  }
  const resolved = path.resolve(SEEDS_DIR, `${name}.js`);
  if (!resolved.startsWith(SEEDS_DIR + path.sep)) {
    fail(`seed name resolves outside seeds dir: ${name}`);
  }
  if (!fs.existsSync(resolved)) {
    const available = listAvailableSeeds().join(', ') || '(none)';
    fail(`unknown seed: ${name}. Available: ${available}`);
  }
  const manifest = require(resolved);
  if (!manifest.contentType || !manifest.uniqueBy || !manifest.data) {
    fail(`malformed manifest at ${resolved}: must export { contentType, uniqueBy, data }.`);
  }
  return manifest;
}

function endpointFor(manifest) {
  if (manifest.endpoint) return manifest.endpoint;
  const match = manifest.contentType.match(/^api::([^.]+)\.[^.]+$/);
  if (!match) fail(`cannot derive endpoint from contentType: ${manifest.contentType}. Add explicit \`endpoint\` to the manifest.`);
  return `${match[1]}s`;
}

async function api(method, pathSegment, options = {}) {
  const baseUrl = process.env.STRAPI_URL || 'http://localhost:1337';
  const url = `${baseUrl}/api/${pathSegment}`;
  let res;
  try {
    res = await fetch(url, {
      method,
      headers: {
        Authorization: `Bearer ${process.env.SEED_DEV_TOKEN}`,
        ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      },
      body: options.body ? JSON.stringify(options.body) : undefined,
    });
  } catch (err) {
    const code = err?.code || err?.cause?.code;
    if (code === 'ECONNREFUSED') {
      fail(`Strapi not reachable at ${baseUrl}. Run \`yarn dev\` first.`);
    }
    throw err;
  }
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`${method} /api/${pathSegment} → ${res.status} ${res.statusText}: ${text.slice(0, 500)}`);
  }
  return res.json();
}

function buildExistenceQuery(uniqueBy) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(uniqueBy)) {
    params.set(`filters[${key}][$eq]`, value);
  }
  return params.toString();
}

async function runSeed(name) {
  const manifest = resolveManifest(name);
  const endpoint = endpointFor(manifest);
  const query = buildExistenceQuery(manifest.uniqueBy);

  console.log(`[seed:dev] ${name}: checking ${manifest.contentType} where ${JSON.stringify(manifest.uniqueBy)}`);
  const existing = await api('GET', `${endpoint}?${query}`);
  if (Array.isArray(existing.data) && existing.data.length > 0) {
    console.log(`[seed:dev] ${name}: exists (id=${existing.data[0].id}), skipping.`);
    return;
  }

  const created = await api('POST', `${endpoint}?status=published`, { body: { data: manifest.data } });
  const id = created?.data?.id ?? '?';
  console.log(`[seed:dev] ${name}: created (id=${id}).`);
}

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    printUsage();
    return 0;
  }

  loadEnvFile();
  assertSafeEnv();

  if (args[0] === '--all') {
    const seeds = listAvailableSeeds();
    if (seeds.length === 0) {
      console.log('[seed:dev] no manifests found, nothing to do.');
      return 0;
    }
    const failures = [];
    for (const name of seeds) {
      try {
        await runSeed(name);
      } catch (err) {
        console.error(`[seed:dev] ${name}: FAILED — ${err.message}`);
        failures.push(name);
      }
    }
    if (failures.length > 0) {
      console.error(`[seed:dev] ${failures.length} failure(s): ${failures.join(', ')}`);
      return 1;
    }
    return 0;
  }

  if (args.length > 1) {
    fail(`unexpected extra arguments: ${args.slice(1).join(' ')}`);
  }

  try {
    await runSeed(args[0]);
  } catch (err) {
    console.error(`[seed:dev] ${args[0]}: FAILED — ${err.message}`);
    return 1;
  }
  return 0;
}

main()
  .then((code) => process.exit(code))
  .catch((err) => {
    console.error('[seed:dev] unexpected error:', err);
    process.exit(1);
  });
