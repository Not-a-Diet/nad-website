# `backend/scripts/`

On-demand dev tools. **Local only. Never used in production.**

## `seed:dev` — populate a Strapi entry from a manifest

When you build a new Strapi component, drop a manifest in `seeds/<name>.js` and run `yarn seed:dev <name>` to create the matching DB entry via the Strapi REST API. Saves having to click through the admin and type test data by hand every time.

### One-time token setup

1. Start the backend: `yarn dev`
2. Open admin: `http://localhost:1337/admin` → **Settings → API Tokens → Create new API Token**
   - **Name**: `Local Dev Seed`
   - **Token duration**: `Unlimited`
   - **Token type**: `Custom` — grant `find` + `create` on every content type a seed will target (start with `Page`).
3. Copy the generated token. Open `backend/.env` and set:
   ```
   SEED_DEV_TOKEN=<paste-here>
   ```
4. (Optional) override the Strapi URL if you've changed defaults:
   ```
   STRAPI_URL=http://localhost:1337
   ```
   Localhost only — non-local hosts are refused.

**`backend/.env` is gitignored. Never commit the token. Never set this var in production.**

### Usage

```bash
yarn seed:dev              # list available seeds + usage
yarn seed:dev <name>       # run one manifest (e.g. yarn seed:dev pricing)
yarn seed:dev:all          # run every manifest in seeds/
```

Backend dev server must be running. The script POSTs to `/api/<plural>` over HTTP.

### Behavior

- **Idempotent** — checks `uniqueBy` filter first; skips if a matching entry already exists.
- **Refuses to run** if `NODE_ENV=production`, `SEED_DEV_TOKEN` is missing, or `STRAPI_URL` host isn't local.
- **Errors clearly** if the backend isn't reachable (`Run yarn dev first`).
- Created entries are published immediately (`?status=published`).

## Manifest shape

Each `seeds/<name>.js` exports a plain object:

```js
module.exports = {
  contentType: 'api::page.page',   // Strapi UID
  uniqueBy: { slug: 'pricing' },   // filter for the existence check
  // endpoint: 'pages',            // optional override; default = <singular>s
  data: {                          // full payload (same shape as REST POST body's `data`)
    slug: 'pricing',
    heading: '...',
    contentSections: [
      { __component: 'sections.foo', /* ... */ },
    ],
  },
};
```

Dynamic-zone entries use `__component` keys, same shape as Strapi v5 REST expects.

## Adding a new seed

1. Create the Strapi component schema (`backend/src/components/...`).
2. Add it to `Page.contentSections.components` in the page schema + the populate middleware.
3. Create the frontend component file.
4. Drop a `seeds/<slug>.js` manifest with the test data.
5. `yarn seed:dev <slug>` → entry exists in admin.
