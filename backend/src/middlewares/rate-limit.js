'use strict';

const ratelimit = require('koa-ratelimit');

// Per-process memory store. Acceptable for a single Strapi Cloud instance.
// If horizontally scaled, swap to Redis driver.
const db = new Map();

// TODO: when adding form POST endpoints, register a second, stricter limiter
// on those routes via Strapi's route-level middlewares config.
module.exports = () =>
  ratelimit({
    driver: 'memory',
    db,
    duration: 60 * 1000,
    errorMessage: 'Too many requests, please slow down.',
    id: (ctx) => ctx.ip,
    max: 200,
    disableHeader: false,
    whitelist: () => false,
    blacklist: () => false,
  });
