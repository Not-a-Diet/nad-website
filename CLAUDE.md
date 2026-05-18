# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Monorepo for the "Not a Diet" (notadiet.life) health/wellness website. **Yarn 4.14.1 Berry** workspaces: `frontend/` (Next.js 16.2.4, React 19, TypeScript, Tailwind) + `backend/` (Strapi 5.45.0 CMS, SQLite). Deployed: frontend on Vercel, backend on Strapi Cloud (`nad-website-b96ec93f1f`). Locales: `en`, `it`, `pt`.

## Commands

```bash
# Root (runs both frontend + backend concurrently)
yarn dev            # Clear cache + start both
yarn build          # Build frontend
yarn test           # Run all frontend tests
yarn lint           # Lint frontend
yarn clear          # Delete frontend .next cache
yarn seed           # Import nad-database.tar.gz into Strapi
yarn export         # Export Strapi data

# Workspace-scoped
yarn workspace frontend test          # Run tests once
yarn workspace frontend test:watch    # Watch mode
yarn workspace backend develop        # Strapi dev server only
```

Use `yarn workspace <name> <command>`, never `yarn --prefix`.

## Architecture

### Data Flow
1. Next.js Server Components call `fetchAPI()` (`frontend/src/app/[lang]/utils/fetch-api.tsx`) → Strapi REST API
2. Strapi v5 flat response format: `{ data: { documentId, id, ...fields } }` — **no `.data.attributes`** nesting
3. Dynamic page sections use a component resolver (`utils/component-resolver.tsx`) that maps Strapi `__component` strings to React components via `React.lazy()`
4. `proxy.ts` (not `middleware.ts`) handles locale detection/redirect via `NEXT_LOCALE` cookie → `Accept-Language` fallback

### Key Files
- `frontend/src/app/[lang]/utils/fetch-api.tsx` — all API calls; `normalizePopulate()` converts dot-notation arrays to v5 nested objects
- `frontend/src/app/[lang]/utils/component-resolver.tsx` — maps `sections.hero` → `Hero`, `sections.feature-columns-group` → `FeatureColumnsGroup`
- `frontend/src/proxy.ts` — locale middleware (Next.js 16 convention)
- `backend/src/api/page/middlewares/page-populate-middleware.js` — deep-populates the `contentSections` dynamic zone using v5 `on` filter

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
`populate: "*"` only goes **one level deep**. For nested components (media, relations inside dynamic zone sections), you must use the `on` filter with explicit per-section populate. This is handled by `page-populate-middleware.js` — **when adding a new section type, add an entry in the `on` filter or it gets zero population**.

```typescript
// WRONG (v4 dot-notation)
populate: ["metadata.shareImage", "navbar.links"]
// CORRECT (v5 nested objects — or use normalizePopulate auto-conversion)
populate: { metadata: { populate: "*" }, navbar: { populate: { links: true } } }
```

### Component Resolver
- Converts `sections.feature-columns-group` → PascalCase `FeatureColumnsGroup` → `import('../components/FeatureColumnsGroup')`
- Variable must be named `Module` (not `module`) — Next.js ESLint rule
- Dynamic import path **must have `../components/` as a static prefix** (Turbopack/Webpack requirement)
- Component file name must exactly match the PascalCase resolved name

### API Calls
Always use `fetchAPI()`, never raw `fetch()`. Token: `process.env.NEXT_PUBLIC_STRAPI_API_TOKEN`. Path requires leading slash (`/global`, `/articles`).

### Next.js 16 Specifics
- All page/layout `params` are **async** — must `await params` before accessing properties
- Locale detection lives in `proxy.ts` (not `middleware.ts`)
- ESLint uses flat config (`eslint.config.mjs`)

### Styling
- Tailwind with custom palette: `primary`, `secondary`, `tertiary`, `quaternary`, `crema`, `anti-flash_white`
- Fonts: Inter (body), Bricolage Grotesque (headings, w700)
- CSS `@import` statements **must precede** `@tailwind` directives (Turbopack requirement)
- Avoid `@apply`; use utility classes directly in JSX

## Testing

- Jest 30 + React Testing Library 16 + jsdom; config at `frontend/jest.config.js`
- Tests in `frontend/src/__tests__/`; use `@/` path alias
- Mock `global.fetch` per test returning Strapi v5 flat format: `{ data: { documentId: "...", id: 1, ...fields }, meta: {} }`
- Server component async params: `await MyComponent({ params: Promise.resolve({ lang: 'en' }) })`
- 2 pre-existing ESLint errors (empty `{}` types in Category/Article interfaces) — do not fix unless explicitly asked

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
