# CLAUDE.md

Guidance for Claude Code working in this repo.

## Overview

Monorepo "Not a Diet" (notadiet.life) health/wellness site. **Yarn 4.14.1 Berry** workspaces: `frontend/` (Next.js 16.2.4, React 19, TypeScript, Tailwind) + `backend/` (Strapi 5.45.0 CMS, SQLite). Deploy: frontend Vercel, backend Strapi Cloud (`nad-website-b96ec93f1f`). Locales: `en`, `it`, `pt`.

## Commands

```bash
# Root (runs both frontend + backend concurrently)
yarn dev            # Clear cache + start both
yarn build          # Build frontend
yarn test           # Run all frontend tests
yarn lint           # Lint frontend
yarn clear          # Delete frontend .next cache
yarn seed           # Import nad-database.tar.gz into Strapi (hard reset)
yarn seed:dev <m>   # Run one manifest from backend/scripts/seeds/<m>.js
yarn seed:dev:all   # Run every manifest
yarn export         # Export Strapi data

# Workspace-scoped
yarn workspace frontend test          # Run tests once
yarn workspace frontend test:watch    # Watch mode
yarn workspace backend develop        # Strapi dev server only
```

Use `yarn workspace <name> <command>`, never `yarn --prefix`.

## Seeding (`yarn seed:dev`)

Lives in `backend/scripts/`. Local-only — refuses non-localhost `STRAPI_URL` and refuses `NODE_ENV=production`. Needs `SEED_DEV_TOKEN` in `backend/.env` (Custom API token with `find` + `create` on each target content type; add `update` if any manifest uses `mode: 'append-section'`). Backend dev server must be running.

Two manifest modes (`backend/scripts/seeds/<name>.js`):

1. **Create-if-missing (default)** — `{contentType, uniqueBy, data}` or `{contentType, uniqueBy, entries: [{locale, data}]}`. Checks `uniqueBy` filter (and `locale` for entries); skips if found, else POSTs with `?status=published`. Used by `legal-*`, `pricing`.

2. **`mode: 'append-section'`** — patches an existing entry's dynamic zone for each locale. Shape: `{contentType, uniqueBy, mode: 'append-section', entries: [{locale, section: {__component, ...}}]}`. Per entry: GET with `filters[uniqueBy]` + `locale`, skip if a component with the same `__component` already present, else PUT full `contentSections` back with the new section appended. Used by `home-pricing-teaser`. Set `SEED_DEBUG=1` to dump the PUT payload to `/tmp/seed-payload-<locale>.json`.

### Strapi v5 dynamic-zone PUT gotchas (the reason `append-section` exists)

When updating a DZ via REST PUT, the only payload shape Strapi v5 accepts for each component is `{__component, ...fields}` with **no `id`**:

- `__component` **must be the first key** in the object — otherwise Strapi rejects with `"Invalid key __component at contentSections"` (it can't match the component schema yet when it encounters other keys first).
- `{id, __component, ...}` is rejected with the same "Invalid key" error — you can't update an existing component in place.
- `{id}` alone is rejected with `"__component is a required field"`.
- Result: every PUT **replaces** the whole DZ array; existing components are recreated (old component rows orphaned), but the page entity and `documentId` are unchanged.

The `appendSectionEntry` helper in `seed.js` handles this: it sanitizes the GETted sections (strips Strapi metadata `documentId/createdAt/updatedAt/publishedAt/locale/localizations`, flattens media objects and relation objects to ids, drops top-level `id` on each component, emits `__component` first), appends the new section, and PUTs. The page is read with the populate middleware applied (find route), so all nested components and media come back fully populated.

### Adding a new section to the home page across locales

1. Create the component schema in `backend/src/components/sections/<name>.json`.
2. Add the `__component` UID to `Page.contentSections.components` in `backend/src/api/page/content-types/page/schema.json`.
3. Add a populate entry to the `on` filter in `backend/src/api/page/middlewares/page-populate-middleware.js` — without this the section will be sent unpopulated to the frontend.
4. Build the React component at `frontend/src/app/[lang]/components/<PascalName>.tsx` matching the resolver convention.
5. Drop a manifest at `backend/scripts/seeds/<slug>.js` using `mode: 'append-section'` with `entries: [{locale: 'en', section}, {locale: 'it', section}, {locale: 'pt', section}]`.
6. `yarn seed:dev <slug>` — idempotent across all locales.

## Architecture

### Data Flow
1. Next.js Server Components call `fetchAPI()` (`frontend/src/app/[lang]/utils/fetch-api.tsx`) → Strapi REST API
2. Strapi v5 flat response: `{ data: { documentId, id, ...fields } }` — **no `.data.attributes`** nesting
3. Dynamic page sections use component resolver (`utils/component-resolver.tsx`) mapping Strapi `__component` strings to React components via `React.lazy()`
4. `proxy.ts` (not `middleware.ts`) handles locale detect/redirect via `NEXT_LOCALE` cookie → `Accept-Language` fallback

### Key Files
- `frontend/src/app/[lang]/utils/fetch-api.tsx` — all API calls; `normalizePopulate()` converts dot-notation arrays to v5 nested objects
- `frontend/src/app/[lang]/utils/component-resolver.tsx` — maps `sections.hero` → `Hero`, `sections.feature-columns-group` → `FeatureColumnsGroup`
- `frontend/src/proxy.ts` — locale middleware (Next.js 16 convention)
- `backend/src/api/page/middlewares/page-populate-middleware.js` — deep-populates `contentSections` dynamic zone via v5 `on` filter

### Route Structure
```
/[lang]/                    → page.tsx (home, contentSections dynamic zone)
/[lang]/[...slug]/          → catch-all dynamic pages
/[lang]/blog/               → blog listing (client component, pagination)
/[lang]/blog/[category]/    → filtered by category
/[lang]/blog/[category]/[slug]/  → individual article
```

## Critical Patterns

### Strapi v5 Populate
`populate: "*"` only goes **one level deep**. For nested components (media, relations inside dynamic zone sections), use `on` filter with explicit per-section populate. Handled by `page-populate-middleware.js` — **when adding new section type, add entry in `on` filter or it gets zero population**.

```typescript
// WRONG (v4 dot-notation)
populate: ["metadata.shareImage", "navbar.links"]
// CORRECT (v5 nested objects — or use normalizePopulate auto-conversion)
populate: { metadata: { populate: "*" }, navbar: { populate: { links: true } } }
```

### Component Resolver
- Converts `sections.feature-columns-group` → PascalCase `FeatureColumnsGroup` → `import('../components/FeatureColumnsGroup')`
- Variable must be `Module` (not `module`) — Next.js ESLint rule
- Dynamic import path **must have `../components/` as static prefix** (Turbopack/Webpack requirement)
- Component file name must match PascalCase resolved name exactly

### API Calls
Use `fetchAPI()`, never raw `fetch()`. Token: `process.env.NEXT_PUBLIC_STRAPI_API_TOKEN`. Path needs leading slash (`/global`, `/articles`).

### Next.js 16 Specifics
- All page/layout `params` are **async** — `await params` before accessing properties
- Locale detect in `proxy.ts` (not `middleware.ts`)
- ESLint uses flat config (`eslint.config.mjs`)

### Styling
- Tailwind custom palette: `primary`, `secondary`, `tertiary`, `quaternary`, `crema`, `anti-flash_white`
- Fonts: Inter (body), Bricolage Grotesque (headings, w700)
- CSS `@import` **must precede** `@tailwind` directives (Turbopack requirement)
- Avoid `@apply`; use utility classes in JSX

## Testing

- Jest 30 + React Testing Library 16 + jsdom; config at `frontend/jest.config.js`
- Tests in `frontend/src/__tests__/`; use `@/` path alias
- Mock `global.fetch` per test returning Strapi v5 flat format: `{ data: { documentId: "...", id: 1, ...fields }, meta: {} }`
- Server component async params: `await MyComponent({ params: Promise.resolve({ lang: 'en' }) })`
- 2 pre-existing ESLint errors (empty `{}` types in Category/Article interfaces) — do not fix unless asked

## Content Model → Frontend Mapping

| Strapi Endpoint | Used By |
|---|---|
| `/api/pages` | Home (`/[lang]/`) + dynamic pages (`/[lang]/[...slug]`) |
| `/api/articles` | Blog listing, posts, featured posts |
| `/api/global` | Navbar, footer, SEO, banner (fetched in `layout.tsx`) |
| `/api/categories` | Blog sidebar filter |
| `/api/legals` | Privacy, terms, cookie policy |

## Known Tech Debt

1. `getGlobal()` called twice in `layout.tsx` (in both `generateMetadata` and `RootLayout`)
2. Pervasive `any` types in some components
3. `Article`, `Attribute`, `Data` interfaces duplicated across 3+ files
4. Native `<img>` in Hero/Navbar — should use Next.js `<Image>`
5. No rate limiting on public form endpoints

## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

Rules:
- For codebase questions, first run `graphify query "<question>"` when graphify-out/graph.json exists. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).
