# Agent Guidelines for NAD Website Repository

## Overview
This repository contains a Next.js frontend and Strapi backend for the "Not a Diet" (notadiet.life) health and wellness brand website.

### Architecture
- **Monorepo** with Yarn 4.14.1 Berry workspaces: `frontend/` (Next.js 16) + `backend/` (Strapi 5.45.0 CMS)
- **Frontend**: Next.js 16.2.4, React 19.2.5, TypeScript 5.5.0, Tailwind CSS 3.4.1
- **Backend**: Strapi 5.45.0, SQLite (better-sqlite3), 3 plugins (Cloud, SEO, Users-Permissions)
- **i18n**: 3 locales (en, it, pt) with proxy-based locale detection + cookie persistence
- **Deployment**: Frontend on Vercel, Backend on Strapi Cloud (project: `nad-website-b96ec93f1f`)

### Key Data Flow
1. Next.js Server Components fetch data from Strapi via `fetchAPI()` utility
2. Strapi v5 responses use flat format: `{data: {documentId, id, ...fields}}` (no `.data.attributes` nesting)
3. Dynamic zone populate on `/api/pages` uses `on` filter with explicit deep populate (v5 `populate: "*"` only goes one level deep)
4. Dynamic component resolver maps Strapi `__component` field names to React components
5. ISR with 60-second revalidation is the default caching strategy

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

# Seed data from tarball
yarn seed

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
Strapi v5 uses a flat response format (no `.data.attributes` nesting):
- **v4**: `{ data: { id: 1, attributes: { title: "Hello" } } }`
- **v5**: `{ data: { documentId: "abc", id: 1, title: "Hello" } }`
- Relations are inline: `{ data: { id: 1, category: { id: 2, name: "Food" } } }`
- The `fetchAPI()` utility in `fetch-api.tsx` includes a `normalizePopulate()` helper that converts dot-notation arrays to nested objects for v5 compatibility
- **CRITICAL for dynamic zones**: Strapi v5 requires `on` filter with explicit deep populate for dynamic zones. `populate: "*"` only populates one level deep — nested components, media, and relations need explicit populate entries per section type.

### Component Resolver Pattern
The `component-resolver.tsx` dynamically maps Strapi component names to React components:
- Strapi sends `__component: "sections.hero"` → resolves to `../components/Hero`
- Converts kebab-case to PascalCase: `feature-columns-group` → `FeatureColumnsGroup`
- Uses React `lazy()` + `Suspense` for code splitting
- **Important**: Component file names MUST match the PascalCase resolved name
- Variable must be named `Module` (not `let module`) to avoid Next.js ESLint rule

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
- `src/proxy.ts` handles locale detection and redirection (Next.js 16 renamed middleware.ts → proxy.ts)
- Exported as `export default function proxy` (not named export)
- Checks `NEXT_LOCALE` cookie first, falls back to `Accept-Language` header
- Redirects `/about` → `/en/about` (or detected locale)
- Matcher config: `/((?!_next).*)` — runs on all non-`_next` routes
- Next.js 16 deprecates `middleware.ts`; use `proxy.ts` instead

### Strapi Page Populate Middleware
Located at `backend/src/api/page/middlewares/page-populate-middleware.js`:
- Intercepts `find` and `findOne` for `/api/pages`
- Uses Strapi v5 `on` filter for `contentSections` dynamic zone with explicit deep populate for each section type
- `populate: "*"` only goes one level deep in Strapi v5 — nested components, media, and relations need explicit populate
- Passes through `locale` for i18n
- **CRITICAL**: When adding new section types to the dynamic zone, you MUST add an entry in the `on` filter object, otherwise the section will get NO population

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
| `legal` | `/api/legals` | Legal documents (privacy, terms, cookie policy) |

### Dynamic Zone Components (contentSections)
These are the `__component` values Strapi sends and the React components they resolve to:
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
- Environment variables configured in Vercel dashboard
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
- ~~Strapi v4.25.6 → v5.45.0~~ — Migrated with codemod and manual API format changes
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
- Utilities: camelCase (`api-helpers.ts`, `fetch-api.tsx`) — note: some existing files use kebab-case, new files should use camelCase
- Views (page-level display): kebab-case (`blog-list.tsx`, `post.tsx`)
- Proxy file: `proxy.ts` (not `middleware.ts` — Next.js 16 convention)

### API Call Patterns
- Always use `fetchAPI()` from `utils/fetch-api.tsx`, never raw `fetch()`
- Token retrieval pattern: `const token = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN`
- Options object: `{ headers: { Authorization: 'Bearer ${token}' } }`
- Path prefix: use leading slash (`/global`, `/articles`, `/pages`)
- **v5 populate format**: Use nested objects, NOT dot-notation strings. The `normalizePopulate()` helper in `fetchAPI` auto-converts simple arrays.

### Component Props
- CMS-driven components receive a `data` prop matching the Strapi section shape
- Layout components (Navbar, Footer, Banner) receive destructured props from global data
- Always define TypeScript interfaces for props
- In v5, props access fields directly (no `.attributes` nesting): `data.title` not `data.attributes.title`

### Styling
- Tailwind CSS with custom color palette (primary, secondary, tertiary, quaternary, crema, anti-flash_white)
- Custom fonts: Inter (body), Bricolage Grotesque (headings, w700)
- Rich text content has dedicated styles in `globals.css`
- Avoid `@apply`; prefer utility classes directly in JSX
- CSS `@import` statements MUST precede `@tailwind` directives (Turbopack requirement)

### Important Gotchas
1. **Component resolver variable naming** — Use `Module` not `module` (Next.js ESLint rule)
2. **Dynamic import path has static prefix** — Turbopack/Webpack requires `../components/` as static part
3. **Server components cannot use `window`/`document`** — use `"use client"` directive
4. **`generateStaticParams` calls Strapi** — build will fail if backend is not running
5. **ISR revalidation is 60s globally** — no per-page granularity yet
6. **Blog listing is a client component** — uses useState/useEffect for pagination
7. **Strapi v5 `populate: "*"` only goes one level deep** — use `on` filter with explicit deep populate in middleware for nested components/media/relations
8. **All page/layout params are async in Next.js 16** — must `await params` before accessing properties
9. **Yarn Berry workspaces** — use `yarn workspace <name> <command>`, not `yarn --prefix`
10. **Strapi Cloud deployment** — all `@strapi/*` packages MUST be the same version (currently 5.45.0)

## When in Doubt
1. Follow existing patterns in the codebase
2. Prioritize readability over cleverness
3. When adding dependencies, consider bundle size and maintenance overhead
4. Write tests for complex logic
5. Document non-obvious decisions
6. Run `yarn test` before committing changes
7. Check the "Known Issues & Tech Debt" section for existing problems before adding new code