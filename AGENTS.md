# Agent Guidelines for NAD Website Repository

## Overview
Next.js frontend + Strapi backend for "Not a Diet" (notadiet.life) health/wellness brand.

### Architecture
- **Monorepo** Yarn 4.14.1 Berry workspaces: `frontend/` (Next.js 16) + `backend/` (Strapi 5.45.0 CMS)
- **Frontend**: Next.js 16.2.4, React 19.2.5, TypeScript 5.5.0, Tailwind CSS 3.4.1
- **Backend**: Strapi 5.45.0, SQLite (better-sqlite3), 3 plugins (Cloud, SEO, Users-Permissions)
- **i18n**: 3 locales (en, it, pt) with proxy-based locale detect + cookie persistence
- **Deploy**: Frontend Vercel, Backend Strapi Cloud (project: `nad-website-b96ec93f1f`)

### Key Data Flow
1. Next.js Server Components fetch from Strapi via `fetchAPI()` utility
2. Strapi v5 flat response: `{data: {documentId, id, ...fields}}` (no `.data.attributes` nesting)
3. Dynamic zone populate on `/api/pages` uses `on` filter with explicit deep populate (v5 `populate: "*"` only goes one level deep)
4. Dynamic component resolver maps Strapi `__component` field names to React components
5. ISR with 60-second revalidation is default caching strategy

## Development Commands

### Root Level Commands (Yarn Berry Workspaces)
```bash
# Install all dependencies
yarn install

# Start both frontend and backend concurrently
yarn dev

# Clear frontend cache
yarn clear

# Build frontend
yarn build

# Run frontend tests
yarn test

# Lint frontend code
yarn lint

# Seed data from tarball (hard reset)
yarn seed

# Run one manifest from backend/scripts/seeds/<name>.js
yarn seed:dev <name>

# Run every manifest in backend/scripts/seeds/
yarn seed:dev:all

# Export Strapi data
yarn export

# Sync with upstream repository
yarn repo:upstream
```

### Frontend Specific (Next.js 16)
```bash
yarn workspace frontend dev      # Development server
yarn workspace frontend build    # Production build
yarn workspace frontend start    # Start production server
yarn workspace frontend lint     # Lint code (ESLint flat config)
yarn workspace frontend test     # Run tests
yarn workspace frontend test:watch # Watch mode
```

### Backend Specific (Strapi 5)
```bash
yarn workspace backend develop   # Development server
yarn workspace backend start     # Production start
yarn workspace backend build     # Production build
yarn workspace backend strapi    # Strapi CLI
```

### Package Manager
- **Yarn 4.14.1 Berry** with `nodeLinker: node-modules` (workspaces mode)
- Root `package.json` defines workspaces `["frontend", "backend"]`
- Root-level `resolutions` field handles security version overrides
- `packageManager: "yarn@4.14.1"` in root `package.json`
- Workspace names: `frontend` and `backend` (use `yarn workspace <name> <command>`)

## Testing

### Setup
- **Framework**: Jest 30 + React Testing Library 16 + jsdom
- **Config**: `frontend/jest.config.js` (uses `next/jest` for SWC transform)
- **Setup file**: `frontend/jest.setup.js` (mocks next/image, next/link, next/navigation)
- **Test location**: `frontend/src/__tests__/`

### Running Tests
```bash
yarn test              # Run all tests once
yarn test:watch        # Watch mode for development
```

### Mocking Strategy
- `next/image` → renders as plain `<img>` tag
- `next/link` → renders as plain `<a>` tag
- `next/navigation` → mocked usePathname, useRouter, useParams
- `global.fetch` → mock per-test with `jest.fn()` returning Strapi v5 flat-format responses
- `ResizeObserver` → mocked no-op for component compatibility

### Writing New Tests
1. Place test files in `frontend/src/__tests__/`
2. Use `@/` path alias for imports (e.g., `@/app/[lang]/components/Navbar`)
3. Mock `global.fetch` to return realistic Strapi v5 response shapes:
   ```typescript
   { data: { documentId: "...", id: 1, ...fields }, meta: {} }
   ```
4. For server components with async params, use `Promise.resolve()`:
   ```typescript
   const result = await MyServerComponent({ params: Promise.resolve({ lang: 'en' }) })
   ```
5. For client components, use `render()` from `@testing-library/react`

## Project-Specific Patterns

### Strapi v5 API Response Format
Strapi v5 uses flat response (no `.data.attributes` nesting):
- **v4**: `{ data: { id: 1, attributes: { title: "Hello" } } }`
- **v5**: `{ data: { documentId: "abc", id: 1, title: "Hello" } }`
- Relations inline: `{ data: { id: 1, category: { id: 2, name: "Food" } } }`
- `fetchAPI()` in `fetch-api.tsx` includes `normalizePopulate()` helper converting dot-notation arrays to nested objects for v5 compatibility
- **CRITICAL for dynamic zones**: Strapi v5 requires `on` filter with explicit deep populate for dynamic zones. `populate: "*"` only populates one level deep — nested components, media, and relations need explicit populate entries per section type.

### Component Resolver Pattern
`component-resolver.tsx` dynamically maps Strapi component names to React components:
- Strapi sends `__component: "sections.hero"` → resolves to `../components/Hero`
- Converts kebab-case to PascalCase: `feature-columns-group` → `FeatureColumnsGroup`
- Uses React `lazy()` + `Suspense` for code splitting
- **Important**: Component file names MUST match PascalCase resolved name
- Variable must be `Module` (not `let module`) to avoid Next.js ESLint rule

### Centralized API Fetcher
All Strapi API calls go through `fetchAPI()` in `fetch-api.tsx`:
- Uses `qs` library for query string serialization
- `normalizePopulate()` auto-converts dot-notation populate arrays to v5 nested object format
- Default ISR revalidation: 60 seconds
- Requires `NEXT_PUBLIC_STRAPI_API_TOKEN` for authenticated requests
- **v5 populate format must use nested objects**:
  ```typescript
  // WRONG (v4 dot-notation, no longer works):
  populate: ["metadata.shareImage", "navbar.links"]
  // CORRECT (v5 nested objects):
  populate: { metadata: { populate: "*" }, navbar: { populate: { links: true } } }
  // Also correct (auto-converted by normalizePopulate):
  populate: ["metadata", "navbar.links"]  // converted to nested format
  ```

### i18n Proxy (formerly Middleware)
- `src/proxy.ts` handles locale detect and redirect (Next.js 16 renamed middleware.ts → proxy.ts)
- Exported as `export default function proxy` (not named export)
- Checks `NEXT_LOCALE` cookie first, falls back to `Accept-Language` header
- Redirects `/about` → `/en/about` (or detected locale)
- Matcher config: `/((?!_next).*)` — runs on all non-`_next` routes
- Next.js 16 deprecates `middleware.ts`; use `proxy.ts` instead

### Strapi Page Populate Middleware
At `backend/src/api/page/middlewares/page-populate-middleware.js`:
- Intercepts `find` and `findOne` for `/api/pages`
- Uses Strapi v5 `on` filter for `contentSections` dynamic zone with explicit deep populate per section type
- `populate: "*"` only goes one level deep in Strapi v5 — nested components, media, relations need explicit populate
- Passes through `locale` for i18n
- **CRITICAL**: When adding new section types to dynamic zone, MUST add entry in `on` filter object, else section gets NO population

### Seeding via `yarn seed:dev`

Local-only tooling under `backend/scripts/`. Refuses non-localhost `STRAPI_URL` and refuses `NODE_ENV=production`. Designed for repeatable test-data setup so you don't have to click through the admin every time you add a component.

**Setup** — create a Custom API Token in admin → Settings → API Tokens with `find` + `create` on each target content type (plus `update` if any manifest uses `mode: 'append-section'`). Save it as `SEED_DEV_TOKEN=...` in `backend/.env`. The backend dev server must be running.

**Manifest shapes** in `backend/scripts/seeds/<name>.js`:

1. **Create-if-missing (default)** — POST a brand-new entry if `uniqueBy` doesn't match anything.
   ```js
   // Single entry (no i18n)
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

2. **`mode: 'append-section'`** — patch an existing localized entry by appending one component to its dynamic zone. Idempotent: skips if a component with the same `__component` is already present in that locale.
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
   Per entry: GET the page with `filters[uniqueBy]` + `locale`, check `contentSections` for an existing `__component` match, otherwise PUT the full sanitized `contentSections` back with the new section appended. Set `SEED_DEBUG=1` to dump the PUT payload to `/tmp/seed-payload-<locale>.json`.

#### Strapi v5 dynamic-zone PUT gotchas (why `append-section` exists)

When updating a DZ over REST PUT, the only payload shape Strapi v5 accepts for each component is `{__component, ...fields}` with **no `id`**:

- **`__component` must be the FIRST key** in each component object. JSON key order matters — if `__component` comes after the other fields, Strapi rejects with `"Invalid key __component at contentSections"` (its validator can't match a component schema yet when it encounters other keys first).
- **No `id` on existing components**. `{id, __component, ...}` is rejected with the same "Invalid key" error; `{id}` alone is rejected with `"__component is a required field"`. There is no in-place update for DZ components via the public REST API — every PUT recreates them.
- **DZ PUT replaces the whole array**. The seed reads existing sections (via the populate middleware), sanitizes them (strips `documentId/createdAt/updatedAt/publishedAt/locale/localizations`, flattens media and relation objects to ids, drops top-level `id`, emits `__component` first), appends the new section, and PUTs the entire array back. The page entity and `documentId` are unchanged; old component rows in `components_sections_*` tables are orphaned by Strapi.
- These rules apply to the **public REST API** only — the admin Content Manager uses a different endpoint and the Strapi document service in a custom script has its own semantics. If REST gets too brittle for a use case, write a one-off script that loads the Strapi instance and calls `strapi.documents('api::page.page').update(...)` instead.

#### Adding a new section to the home page across locales

1. Create the component schema → `backend/src/components/sections/<name>.json`.
2. Add the UID to `Page.contentSections.components` → `backend/src/api/page/content-types/page/schema.json`.
3. Add a populate entry to the `on` filter → `backend/src/api/page/middlewares/page-populate-middleware.js` (otherwise the section reaches the frontend with no nested data).
4. Build the React component → `frontend/src/app/[lang]/components/<PascalName>.tsx` matching the resolver convention.
5. Add a `mode: 'append-section'` manifest at `backend/scripts/seeds/<slug>.js` with one `entries[]` item per locale.
6. `yarn dev` (backend up) → `yarn seed:dev <slug>` — idempotent across all locales, safe to re-run.

## Content Model Map

### Strapi Content Types → Frontend Usage
| Content Type | Collection | Used By |
|---|---|---|
| `page` | `/api/pages` | Home page (`/[lang]/`), dynamic pages (`/[lang]/[...slug]`) |
| `article` | `/api/articles` | Blog listing, individual posts, featured posts |
| `category` | `/api/categories` | Blog sidebar category filter |
| `global` | `/api/global` | Site-wide settings (navbar, footer, SEO, banner) |
| `blog-header` | `/api/blog-headers` | Blog listing page heading |
| `author` | `/api/authors` | Article author bio and avatar |
| `product-feature` | `/api/product-features` | Pricing plan features |
| `legal` | `/api/legals` | Legal docs (privacy, terms, cookie policy) |

### Dynamic Zone Components (contentSections)
`__component` values Strapi sends + React components they resolve to:
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

### Shared Components (nested in dynamic zones)
| Strapi Component | Resolves To |
|---|---|
| `shared.media` | `Media` |
| `shared.slider` | `Slideshow` (ImageSlider) |
| `shared.video-embed` | `VideoEmbed` |
| `shared.quote` | `Quote` |
| `shared.rich-text` | `RichText` |

## Deployment Info

### Frontend (Vercel)
- Env vars configured in Vercel dashboard
- `NEXT_PUBLIC_STRAPI_API_URL` → Strapi Cloud URL
- `NEXT_PUBLIC_STRAPI_API_TOKEN` → Read-only API token
- `NEXT_PUBLIC_PAGE_LIMIT` → Blog pagination limit (default: 6)

### Backend (Strapi Cloud)
- Project: `nad-website-b96ec93f1f`
- Admin panel customized with dark theme and Italian locale
- SQLite database (development only — Strapi Cloud uses managed DB)
- Data exports stored as `export_*.tar.gz` in backend root
- `@strapi/plugin-seo@2.0.9` (compatible with v5.x)
- `@strapi/plugin-cloud@5.45.0` and `@strapi/plugin-users-permissions@5.45.0` must match `@strapi/strapi` version

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
- ~~Strapi v4.25.6 → v5.45.0~~ — Migrated with codemod + manual API format changes
- ~~Next.js 14.1.3 → Next.js 16.2.4~~ — Migrated with async params, proxy.ts, ESLint flat config
- ~~React 18.2 → React 19.2.5~~ — Migrated with `@headlessui/react` v2.2.0
- ~~Yarn 1.22.22 (Classic) → Yarn 4.14.1 (Berry)~~ — Workspaces with `nodeLinker: node-modules`
- ~~`middleware.ts` → `proxy.ts`~~ — Renamed per Next.js 16 conventions, `export default function proxy`
- ~~`@import` after `@tailwind` in globals.css~~ — Moved CSS imports before Tailwind directives
- ~~`debug_mode: true` in GA4 config~~ — Changed to `false`
- ~~`middleware.ts` deleted~~ — Replaced by `proxy.ts`
- ~~`@next/third-parties` unused dependency~~ — Removed
- ~~Dot-notation populate strings~~ — Converted all to v5 nested object format
- ~~Field-specific populate in dynamic zones~~ — Changed to `populate: "*"` (v5 requirement)
- ~~`page-populate-middleware.js`~~ — Updated to use `on` filter with explicit deep populate (v5 `populate: "*"` only goes one level deep)
- ~~Empty string in Next.js `Image` src~~ — Guard with conditional render in Features.tsx

### Remaining Issues
1. **Duplicate `getGlobal()` API calls** — `layout.tsx` calls it in both `generateMetadata` and `RootLayout`
2. **Pervasive `any` types** — Reduced but still present in some components
3. **Duplicate interface definitions** — `Article`, `Attribute`, `Data` defined in 3+ files
4. **Fixed small image dimensions** — 70px/240px/400px used for all screen sizes
5. **Native `<img>` in Hero/Navbar** — should use Next.js `<Image>`
6. **SQLite in production** — should migrate to PostgreSQL
7. **No rate limiting** on public form endpoints
8. **2 pre-existing ESLint errors** — empty object `{}` types in Category and Article interfaces
9. **ESLint `ts-empty-object` rule** — Two instances of `{}` type in test files (pre-existing)

## Project-Specific Conventions

### File Naming
- Components: PascalCase (`Navbar.tsx`, `Footer.tsx`)
- Utilities: camelCase (`api-helpers.ts`, `fetch-api.tsx`) — some existing files use kebab-case, new files should use camelCase
- Views (page-level display): kebab-case (`blog-list.tsx`, `post.tsx`)
- Proxy file: `proxy.ts` (not `middleware.ts` — Next.js 16 convention)

### API Call Patterns
- Use `fetchAPI()` from `utils/fetch-api.tsx`, never raw `fetch()`
- Token: `const token = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN`
- Options object: `{ headers: { Authorization: 'Bearer ${token}' } }`
- Path prefix: leading slash (`/global`, `/articles`, `/pages`)
- **v5 populate format**: Use nested objects, NOT dot-notation strings. `normalizePopulate()` helper in `fetchAPI` auto-converts simple arrays.

### Component Props
- CMS-driven components receive `data` prop matching Strapi section shape
- Layout components (Navbar, Footer, Banner) receive destructured props from global data
- Always define TypeScript interfaces for props
- In v5, props access fields directly (no `.attributes` nesting): `data.title` not `data.attributes.title`

### Styling
- Tailwind CSS custom color palette (primary, secondary, tertiary, quaternary, crema, anti-flash_white)
- Custom fonts: Inter (body), Bricolage Grotesque (headings, w700)
- Rich text content has dedicated styles in `globals.css`
- Avoid `@apply`; prefer utility classes in JSX
- CSS `@import` MUST precede `@tailwind` directives (Turbopack requirement)

### Important Gotchas
1. **Component resolver variable naming** — Use `Module` not `module` (Next.js ESLint rule)
2. **Dynamic import path has static prefix** — Turbopack/Webpack requires `../components/` as static part
3. **Server components cannot use `window`/`document`** — use `"use client"` directive
4. **`generateStaticParams` calls Strapi** — build fails if backend not running
5. **ISR revalidation is 60s globally** — no per-page granularity yet
6. **Blog listing is client component** — uses useState/useEffect for pagination
7. **Strapi v5 `populate: "*"` only goes one level deep** — use `on` filter with explicit deep populate in middleware for nested components/media/relations
8. **All page/layout params async in Next.js 16** — `await params` before accessing properties
9. **Yarn Berry workspaces** — use `yarn workspace <name> <command>`, not `yarn --prefix`
10. **Strapi Cloud deployment** — all `@strapi/*` packages MUST match version (currently 5.45.0)

## When in Doubt
1. Follow existing patterns in codebase
2. Prioritize readability over cleverness
3. When adding dependencies, consider bundle size + maintenance overhead
4. Write tests for complex logic
5. Document non-obvious decisions
6. Run `yarn test` before committing changes
7. Check "Known Issues & Tech Debt" section for existing problems before adding new code
