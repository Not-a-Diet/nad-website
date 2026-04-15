# Agent Guidelines for NAD Website Repository

## Overview
This repository contains a Next.js frontend and Strapi backend for the "Not a Diet" (notadiet.life) health and wellness brand website.

### Architecture
- **Monorepo** with two independent apps: `frontend/` (Next.js 14 App Router) + `backend/` (Strapi 4.25.6 CMS)
- **Frontend**: Next.js 14.1.3, React 18.2, TypeScript 5.4.2, Tailwind CSS 3.4.1
- **Backend**: Strapi 4.25.6, SQLite (better-sqlite3), 5 plugins (Cloud, i18n, SEO, Users-Permissions)
- **i18n**: 3 locales (en, it, pt) with middleware-based locale detection + cookie persistence
- **Deployment**: Frontend on Vercel, Backend on Strapi Cloud (project: `nad-website-b96ec93f1f`)

### Key Data Flow
1. Next.js Server Components fetch data from Strapi via `fetchAPI()` utility
2. Strapi responses are deeply populated via `page-populate-middleware.js` on the backend
3. Dynamic component resolver maps Strapi `__component` field names to React components
4. ISR with 60-second revalidation is the default caching strategy

## Development Commands

### Root Level Commands
```bash
# Install all dependencies (root, frontend, backend)
yarn setup

# Start both frontend and backend concurrently
yarn dev

# Clear frontend cache and next build
yarn clear

# Seed data from tarball
yarn seed

# Export Strapi data
yarn export

# Sync with upstream repository
yarn repo:upstream
```

### Frontend Specific (Next.js)
```bash
# Development server
yarn dev --prefix frontend/

# Production build
yarn build --prefix frontend/

# Start production server
yarn start --prefix frontend/

# Lint code (uses Next.js ESLint integration)
yarn lint --prefix frontend/

# Run tests
yarn test --prefix frontend/

# Run tests in watch mode
yarn test:watch --prefix frontend/
```

### Backend Specific (Strapi)
```bash
# Development server
yarn develop --prefix backend/

# Production start
yarn start --prefix backend/

# Production build
yarn build --prefix backend/

# Strapi CLI
yarn strapi --prefix backend/
```

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
- `global.fetch` → mock per-test with `jest.fn()` returning Strapi-shaped responses
- `ResizeObserver` → mocked no-op for component compatibility

### Writing New Tests
1. Place test files in `frontend/src/__tests__/`
2. Use `@/` path alias for imports (e.g., `@/app/[lang]/components/Navbar`)
3. Mock `global.fetch` to return realistic Strapi response shapes:
   ```typescript
   { data: [...], meta: { pagination: { start, limit, total } } }
   ```
4. For server components, call the component function directly (no render):
   ```typescript
   const result = await MyServerComponent({ params: { lang: 'en' } })
   expect(result).toBeTruthy()
   ```
5. For client components, use `render()` from `@testing-library/react`

## Project-Specific Patterns

### Component Resolver Pattern
The `component-resolver.tsx` dynamically maps Strapi component names to React components:
- Strapi sends `__component: "sections.hero"` → resolves to `../components/Hero`
- Converts kebab-case to PascalCase: `feature-columns-group` → `FeatureColumnsGroup`
- Uses React `lazy()` + `Suspense` for code splitting
- **Important**: Component file names MUST match the PascalCase resolved name

### Centralized API Fetcher
All Strapi API calls go through `fetchAPI()` in `fetch-api.tsx`:
- Uses `qs` library for query string serialization
- Default ISR revalidation: 60 seconds
- Development mode includes API call benchmarking with timing logs
- Requires `NEXT_PUBLIC_STRAPI_API_TOKEN` for authenticated requests

### i18n Middleware
- `src/middleware.ts` handles locale detection and redirection
- Checks `NEXT_LOCALE` cookie first, falls back to `Accept-Language` header
- Redirects `/about` → `/en/about` (or detected locale)
- Matcher: `/((?!_next).*)` — runs on all non-`_next` routes

### Strapi Page Populate Middleware
Located at `backend/src/api/page/middlewares/page-populate-middleware.js`:
- Intercepts `find` and `findOne` for `/api/pages`
- Deep-populates all 14 possible `contentSections` component types
- Passes through `locale` for i18n
- Has a `console.log` on line 95 (development artifact, safe to ignore)
- **CRITICAL**: When adding or modifying nested components (repeatable or single components inside another component), you MUST update the populate config. `populate: true` only fetches top-level scalar fields — it does NOT recursively populate nested component arrays. Always use explicit nested object syntax for components with children:
  ```js
  hours: {
    populate: {
      title: true,
      description: true,
      locations: { populate: true },
    },
  },
  ```
  Failing to update this middleware results in the frontend receiving `null` or missing data for nested components.

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

### Fixed (Week 1 Audit)
- ~~Broken form handlers in Contact/FoodCalculator/FormSubmit~~ → Removed (FoodCalculator, LeadForm, FormSubmit deleted; booking calendar replaces forms)
- ~~9 CSS typo classes~~ → All fixed
- ~~Dead code (200+ lines)~~ → Removed
- ~~XSS vulnerability in RichText~~ → Added rehype-sanitize
- ~~Missing test infrastructure~~ → Jest + RTL set up with 16 passing tests

### Remaining Issues
1. **Duplicate `getGlobal()` API calls** — `layout.tsx` calls it in both `generateMetadata` and `RootLayout`
2. **Pervasive `any` types** — 20+ instances defeating TypeScript safety
3. **Duplicate interface definitions** — `Article`, `Attribute`, `Data` defined in 3+ files
4. **Fixed small image dimensions** — 70px/240px/400px used for all screen sizes
5. **Native `<img>` in Hero/Navbar** — should use Next.js `<Image>`
6. **Strapi v4.25.6 → v5.x** — major version behind
7. **SQLite in production** — should migrate to PostgreSQL
8. **No rate limiting** on public form endpoints
9. **`window.alert` in server component** — `page.tsx:23` throws ReferenceError
10. **Missing `rel="noopener noreferrer"`** — Banner.tsx (fixed), Features.tsx (fixed)
11. **`debug_mode: true`** in GA4 config — should be false in production
12. **Middleware runs on every request** — should exclude static/API routes

## Project-Specific Conventions

### File Naming
- Components: PascalCase (`Navbar.tsx`, `Footer.tsx`)
- Utilities: camelCase (`api-helpers.ts`, `fetch-api.tsx`) — note: some existing files use kebab-case, new files should use camelCase
- Views (page-level display): kebab-case (`blog-list.tsx`, `post.tsx`)

### API Call Patterns
- Always use `fetchAPI()` from `utils/fetch-api.tsx`, never raw `fetch()`
- Token retrieval pattern: `const token = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN`
- Options object: `{ headers: { Authorization: 'Bearer ${token}' } }`
- Path prefix: use leading slash (`/global`, `/articles`, `/pages`)

### Component Props
- CMS-driven components receive a `data` prop matching the Strapi section shape
- Layout components (Navbar, Footer, Banner) receive destructured props from global data
- Always define TypeScript interfaces for props

### Styling
- Tailwind CSS with custom color palette (primary, secondary, tertiary, quaternary, crema, anti-flash_white)
- Custom fonts: Inter (body), Bricolage Grotesque (headings, w700)
- Rich text content has dedicated styles in `globals.css`
- Avoid `@apply`; prefer utility classes directly in JSX

### Important Gotchas
1. **Component resolver requires exact file name match** — `sections.feature-columns-group` needs `FeatureColumnsGroup.tsx`
2. **Dynamic import path has static prefix** — Webpack requires `../components/` as static part
3. **Server components cannot use `window`/`document`** — use `"use client"` directive
4. **`generateStaticParams` calls Strapi** — build will fail if backend is not running
5. **ISR revalidation is 60s globally** — no per-page granularity yet
6. **Blog listing is a client component** — uses useState/useEffect for pagination
7. **Form submission tokens are exposed in client JS** — anyone can extract and abuse them

## When in Doubt
1. Follow existing patterns in the codebase
2. Prioritize readability over cleverness
3. When adding dependencies, consider bundle size and maintenance overhead
4. Write tests for complex logic
5. Document non-obvious decisions
6. Run `yarn test` before committing changes
7. Check the "Known Issues & Tech Debt" section for existing problems before adding new code
