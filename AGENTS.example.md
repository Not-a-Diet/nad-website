# Agent Guidelines for NAD Website

## Overview
Next.js frontend + Strapi backend for "Not a Diet" (notadiet.life).

### Architecture
- **Monorepo** Yarn 4.14.1 Berry workspaces: `frontend/` (Next.js 16) + `backend/` (Strapi 5.45.0 CMS)
- **Frontend**: Next.js 16.2.4, React 19.2.5, TS 5.5.0, Tailwind 3.4.1
- **Backend**: Strapi 5.45.0, SQLite (better-sqlite3), 3 plugins (Cloud, SEO, Users-Permissions)
- **i18n**: 3 locales (en, it, pt) with proxy-based locale detect + cookie persistence
- **Deploy**: Frontend Vercel, Backend Strapi Cloud (project: `nad-website-b96ec93f1f`)

### Data Flow
1. Next.js Server Components fetch from Strapi via `fetchAPI()`
2. Strapi v5 flat response: `{data: {documentId, id, ...fields}}` (no `.data.attributes`)
3. Dynamic zone populate on `/api/pages` uses `on` filter with explicit deep populate (v5 `populate: "*"` only one level deep)
4. Dynamic component resolver maps `__component` field names to React components
5. ISR with 60s revalidation default

## Development Commands

### Root (Yarn Berry Workspaces)
```bash
yarn install
yarn dev
yarn clear
yarn build
yarn test
yarn lint
yarn seed
yarn seed:dev <name>
yarn seed:dev:all
yarn export
yarn repo:upstream
```

### Frontend (Next.js 16)
```bash
yarn workspace frontend dev
yarn workspace frontend build
yarn workspace frontend start
yarn workspace frontend lint
yarn workspace frontend test
yarn workspace frontend test:watch
```

### Backend (Strapi 5)
```bash
yarn workspace backend develop
yarn workspace backend start
yarn workspace backend build
yarn workspace backend strapi
```

### Package Manager
- Yarn 4.14.1 Berry with `nodeLinker: node-modules`
- Root `package.json` workspaces `["frontend", "backend"]`
- Root `resolutions` for security overrides
- `packageManager: "yarn@4.14.1"`
- Commands: `yarn workspace <name> <command>`

## Testing

### Setup
- **Framework**: Jest 30 + RTL 16 + jsdom
- **Config**: `frontend/jest.config.js` (uses `next/jest` SWC transform)
- **Setup**: `frontend/jest.setup.js` mocks next/image, next/link, next/navigation
- **Location**: `frontend/src/__tests__/`

### Commands
```bash
yarn test
yarn test:watch
```

### Mocks
- `next/image` → plain `<img>`
- `next/link` → plain `<a>`
- `next/navigation` → mocked usePathname, useRouter, useParams
- `global.fetch` → `jest.fn()` returning Strapi v5 flat format
- `ResizeObserver` → mocked no-op

### Writing Tests
1. Place in `frontend/src/__tests__/`
2. Use `@/` path alias (e.g. `@/app/[lang]/components/Navbar`)
3. Mock `global.fetch` with Strapi v5 shape:
   ```typescript
   { data: { documentId: "...", id: 1, ...fields }, meta: {} }
   ```
4. Server components with async params: `Promise.resolve()`
   ```typescript
   const result = await MyServerComponent({ params: Promise.resolve({ lang: 'en' }) })
   ```
5. Client components: `render()` from `@testing-library/react`

## Project Patterns

### Strapi v5 API Response
Flat response, no `.data.attributes`:
- **v4**: `{ data: { id: 1, attributes: { title: "Hello" } } }`
- **v5**: `{ data: { documentId: "abc", id: 1, title: "Hello" } }`
- Relations inline: `{ data: { id: 1, category: { id: 2, name: "Food" } } }`
- `fetchAPI()` includes `normalizePopulate()` converting dot-notation to nested objects
- **CRITICAL**: Dynamic zones need `on` filter with explicit deep populate. `populate: "*"` only one level deep.

### Component Resolver
`component-resolver.tsx` maps Strapi components to React:
- `__component: "sections.hero"` → `../components/Hero`
- kebab-case → PascalCase: `feature-columns-group` → `FeatureColumnsGroup`
- Uses React `lazy()` + `Suspense`
- Component filenames MUST match PascalCase resolved name
- Use `Module` not `module` (ESLint rule)

### Centralized API Fetcher
All calls via `fetchAPI()`:
- Uses `qs` library
- `normalizePopulate()` auto-converts arrays to v5 nested format
- Default ISR: 60s
- Requires `NEXT_PUBLIC_STRAPI_API_TOKEN`
- **v5 populate uses nested objects**:
  ```typescript
  // WRONG:
  populate: ["metadata.shareImage", "navbar.links"]
  // CORRECT:
  populate: { metadata: { populate: "*" }, navbar: { populate: { links: true } } }
  // Also correct (auto-converted):
  populate: ["metadata", "navbar.links"]
  ```

### i18n Proxy
- `src/proxy.ts` (Next.js 16 renamed middleware.ts → proxy.ts)
- `export default function proxy`
- Checks `NEXT_LOCALE` cookie first, then `Accept-Language`
- Redirects `/about` → `/en/about`
- Matcher: `/((?!_next).*)`
- Next.js 16 deprecates `middleware.ts`

### Strapi Page Populate Middleware
At `backend/src/api/page/middlewares/page-populate-middleware.js`:
- Intercepts `find`/`findOne` for `/api/pages`
- Uses v5 `on` filter for `contentSections` DZ with deep populate per section
- Passes `locale` for i18n
- **CRITICAL**: New DZ section types MUST add entry in `on` filter, else NO population

### Seeding via `yarn seed:dev`

Local-only tooling under `backend/scripts/`. Refuses non-localhost `STRAPI_URL` and `NODE_ENV=production`.

**Setup** — Custom API Token in admin → Settings → API Tokens with `find` + `create` (+ `update` if `mode: 'append-section'`). Save `SEED_DEV_TOKEN=...` in `backend/.env`. Backend dev server must run.

**Manifest shapes** in `backend/scripts/seeds/<name>.js`:

1. **Create-if-missing (default)** — POST if `uniqueBy` no match.
   ```js
   module.exports = {
     contentType: 'api::page.page',
     uniqueBy: { slug: 'pricing' },
     data: { slug: 'pricing', heading: '...', contentSections: [...] },
   };
   // Per-locale entries
   module.exports = {
     contentType: 'api::page.page',
     uniqueBy: { slug: 'terms' },
     entries: [
       { locale: 'en', data: { slug: 'terms', locale: 'en', ... } },
       { locale: 'it', data: { slug: 'terms', locale: 'it', ... } },
       { locale: 'pt', data: { slug: 'terms', locale: 'pt', ... } },
     ],
   };
   ```

2. **`mode: 'append-section'`** — patch existing localized entry by appending DZ component. Idempotent: skip if same `__component` already in locale.
   ```js
   module.exports = {
     contentType: 'api::page.page',
     uniqueBy: { slug: 'home' },
     mode: 'append-section',
     entries: [
       { locale: 'en', section: { __component: 'sections.pricing-teaser', /* ...fields */ } },
       { locale: 'it', section: { __component: 'sections.pricing-teaser', /* ...fields */ } },
       { locale: 'pt', section: { __component: 'sections.pricing-teaser', /* ...fields */ } },
     ],
   };
   ```
   Per entry: GET page `filters[uniqueBy]` + `locale`, check `contentSections` for existing `__component`, else PUT sanitized `contentSections` with new section appended. `SEED_DEBUG=1` dumps PUT payload to `/tmp/seed-payload-<locale>.json`.

#### Strapi v5 DZ PUT gotchas

Only payload shape accepted per component: `{__component, ...fields}` with **no `id`**:

- **`__component` must be FIRST key**. JSON key order matters — Strapi rejects if `__component` after other fields: `"Invalid key __component at contentSections"`.
- **No `id` on existing components**. `{id, __component, ...}` rejected same error; `{id}` alone rejected `"__component is a required field"`. No in-place DZ update via public REST — every PUT recreates them.
- **DZ PUT replaces whole array**. Seed reads existing sections (via populate middleware), sanitizes (strips `documentId/createdAt/updatedAt/publishedAt/locale/localizations`, flattens media/relations to ids, drops top-level `id`, emits `__component` first), appends new section, PUTs entire array. Page entity/`documentId` unchanged; old rows orphaned.
- Rules apply to **public REST API only**. Admin Content Manager and Strapi document service differ. If REST too brittle, write script loading Strapi instance calling `strapi.documents('api::page.page').update(...)`.

#### Adding new section to home page (all locales)
1. Create component schema → `backend/src/components/sections/<name>.json`
2. Add UID to `Page.contentSections.components` → `backend/src/api/page/content-types/page/schema.json`
3. Add populate entry to `on` filter → `backend/src/api/page/middlewares/page-populate-middleware.js`
4. Build React component → `frontend/src/app/[lang]/components/<PascalName>.tsx`
5. Add `mode: 'append-section'` manifest at `backend/scripts/seeds/<slug>.js`
6. `yarn dev` → `yarn seed:dev <slug>` — idempotent, safe to re-run

## Content Model

### Strapi Content Types → Frontend
| Content Type | Collection | Used By |
|---|---|---|
| `page` | `/api/pages` | Home `/[lang]/`, dynamic `/[lang]/[...slug]` |
| `article` | `/api/articles` | Blog listing, posts, featured posts |
| `category` | `/api/categories` | Blog category filter |
| `global` | `/api/global` | Navbar, footer, SEO, banner |
| `blog-header` | `/api/blog-headers` | Blog listing heading |
| `author` | `/api/authors` | Article author bio/avatar |
| `product-feature` | `/api/product-features` | Pricing plan features |
| `legal` | `/api/legals` | Privacy, terms, cookie policy |

### Dynamic Zone Components (contentSections)
| Strapi Component | Resolves To | File |
|---|---|---|
| `sections.hero` | `Hero` | `components/Hero.tsx` |
| `sections.features` | `Features` | `components/Features.tsx` |
| `sections.contact` | `Contact` | `components/Contact.tsx` |
| `sections.team` | `Team` | `components/Team.tsx` |
| `sections.pricing` | `Pricing` | `components/Pricing.tsx` |
| `sections.featured-posts` | `FeaturedPosts` | `components/FeaturedPosts.tsx` |
| `sections.testimonials-group` | `TestimonialsGroup` | `components/TestimonialsGroup.tsx` |
| `sections.rich-text` | `RichText` | `components/RichText.tsx` |
| `sections.heading` | `Heading` | (not yet implemented) |
| `sections.bottom-actions` | `BottomActions` | (not yet implemented) |
| `sections.large-video` | `LargeVideo` | (not yet implemented) |
| `sections.feature-columns-group` | `FeatureColumnsGroup` | (not yet implemented) |
| `sections.feature-rows-group` | `FeatureRowsGroup` | (not yet implemented) |

### Shared Components (nested in DZ)
| Strapi Component | Resolves To |
|---|---|
| `shared.media` | `Media` |
| `shared.slider` | `Slideshow` (ImageSlider) |
| `shared.video-embed` | `VideoEmbed` |
| `shared.quote` | `Quote` |
| `shared.rich-text` | `RichText` |

## Deployment

### Frontend (Vercel)
- Env vars in Vercel dashboard
- `NEXT_PUBLIC_STRAPI_API_URL` → Strapi Cloud URL
- `NEXT_PUBLIC_STRAPI_API_TOKEN` → Read-only token
- `NEXT_PUBLIC_PAGE_LIMIT` → Blog pagination (default: 6)

### Backend (Strapi Cloud)
- Project: `nad-website-b96ec93f1f`
- Admin: dark theme + Italian locale
- SQLite dev only — Strapi Cloud uses managed DB
- Data exports: `export_*.tar.gz` in backend root
- `@strapi/plugin-seo@2.0.9` (compatible v5.x)
- `@strapi/plugin-cloud@5.45.0` + `@strapi/plugin-users-permissions@5.45.0` must match `@strapi/strapi` version

### Environment Variables
| Variable | Frontend | Backend | Purpose |
|---|---|---|---|
| `NEXT_PUBLIC_STRAPI_API_URL` | ✅ | | Strapi base URL |
| `NEXT_PUBLIC_STRAPI_API_TOKEN` | ✅ | | Read-only API token |
| `NEXT_PUBLIC_PAGE_LIMIT` | ✅ | | Blog posts per page |
| `HOST` | | ✅ | Server bind address |
| `PORT` | | ✅ | Server port (1337) |
| `APP_KEYS` | | ✅ | App encryption keys |
| `API_TOKEN_SALT` | | ✅ | API token hashing salt |
| `ADMIN_JWT_SECRET` | | ✅ | Admin JWT secret |
| `JWT_SECRET` | | ✅ | Frontend user JWT secret |
| `TRANSFER_TOKEN_SALT` | | ✅ | Content transfer salt |

## Known Issues & Tech Debt

### Fixed (Migration to v5 + Next.js 16)
- ~~Strapi v4.25.6 → v5.45.0~~ — Codemod + manual API format changes
- ~~Next.js 14.1.3 → Next.js 16.2.4~~ — Async params, proxy.ts, ESLint flat config
- ~~React 18.2 → React 19.2.5~~ — `@headlessui/react` v2.2.0
- ~~Yarn 1.22.22 Classic → Yarn 4.14.1 Berry~~ — `nodeLinker: node-modules`
- ~~`middleware.ts` → `proxy.ts`~~ — Next.js 16 convention
- ~~`@import` after `@tailwind` in globals.css~~ — CSS imports before Tailwind
- ~~`debug_mode: true` in GA4 config~~ → `false`
- ~~`@next/third-parties` unused dependency~~ — Removed
- ~~Dot-notation populate strings~~ → v5 nested objects
- ~~Field-specific populate in DZ~~ → `populate: "*"`
- ~~`page-populate-middleware.js`~~ — `on` filter with explicit deep populate
- ~~Empty string in Next.js `Image` src~~ — Guard in Features.tsx

### Remaining
1. **Duplicate `getGlobal()` calls** — `layout.tsx` in both `generateMetadata` + `RootLayout`
2. **Pervasive `any` types** — Reduced but present
3. **Duplicate interfaces** — `Article`, `Attribute`, `Data` in 3+ files
4. **Fixed small image dims** — 70px/240px/400px all sizes
5. **Native `<img>` in Hero/Navbar** — should use Next.js `<Image>`
6. **SQLite in prod** — migrate to PostgreSQL
7. **No rate limiting** on public form endpoints
8. **2 pre-existing ESLint errors** — empty `{}` in Category/Article interfaces
9. **ESLint `ts-empty-object` rule** — Two `{}` in test files (pre-existing)

## Conventions

### File Naming
- Components: PascalCase (`Navbar.tsx`)
- Utilities: camelCase (`api-helpers.ts`) — some kebab-case legacy, prefer camelCase
- Views (page display): kebab-case (`blog-list.tsx`)
- Proxy: `proxy.ts` (not `middleware.ts`)

### API Calls
- Use `fetchAPI()` from `utils/fetch-api.tsx`, never raw `fetch()`
- Token: `const token = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN`
- Options: `{ headers: { Authorization: 'Bearer ${token}' } }`
- Path prefix: leading slash (`/global`, `/articles`, `/pages`)
- v5 populate: nested objects, NOT dot-notation. `normalizePopulate()` auto-converts arrays.

### Component Props
- CMS components receive `data` prop matching Strapi section shape
- Layout components (Navbar, Footer, Banner) get destructured props from global data
- Always define TypeScript interfaces
- v5: direct field access `data.title` not `data.attributes.title`

### Styling
- Tailwind custom palette (primary, secondary, tertiary, quaternary, crema, anti-flash_white)
- Custom fonts: Inter (body), Bricolage Grotesque (headings, w700)
- Rich text styles in `globals.css`
- Avoid `@apply`; prefer utility classes
- CSS `@import` before `@tailwind` (Turbopack requirement)

### Gotchas
1. **Resolver variable naming** — Use `Module` not `module`
2. **Dynamic import path** — Static prefix `../components/` required
3. **Server components** — No `window`/`document`; use `"use client"`
4. **`generateStaticParams`** calls Strapi; build fails if backend down
5. **ISR 60s globally** — No per-page granularity
6. **Blog listing is client component** — useState/useEffect for pagination
7. **Strapi v5 `populate: "*"`** only one level deep — use `on` filter with explicit populate
8. **Async params in Next.js 16** — `await params` before accessing
9. **Yarn Berry workspaces** — `yarn workspace <name> <command>`
10. **Strapi Cloud** — All `@strapi/*` packages MUST match version (5.45.0)

## When in Doubt
1. Follow existing patterns
2. Readability over cleverness
3. Consider bundle size + maintenance
4. Write tests for complex logic
5. Document non-obvious decisions
6. Run `yarn test` before commit
7. Check "Known Issues & Tech Debt" before adding code

## graphify

This project has knowledge graph at graphify-out/ with god nodes, community structure, cross-file relationships.

When user types `/graphify`, invoke `skill` tool with `skill: "graphify"` before doing anything else.

Rules:
- For codebase questions, run `graphify query "<question>"` when graphify-out/graph.json exists. Use `graphify path "<A>" "<B>"` for relationships, `graphify explain "<concept>"` for focused concepts. Returns scoped subgraph, smaller than GRAPH_REPORT.md or grep.
- Dirty graphify-out/ files expected after hooks/incremental updates; not reason to skip. Only skip if task about stale/incorrect graph or user says not to use it.
- If graphify-out/wiki/index.md exists, use for navigation instead of raw source browsing.
- Read GRAPH_REPORT.md only for broad architecture review or when query/path/explain insufficient.
- After code changes, run `graphify update .` to keep graph current (AST-only, no API cost).
