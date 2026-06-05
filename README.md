# Not a Diet

Monorepo for the **Not a Diet** health & wellness site — [www.notadiet.life](https://www.notadiet.life).

A Next.js frontend backed by a Strapi 5 headless CMS, served in three locales (`en`, `it`, `pt`).

> **Proprietary & confidential.** Not open source. See [LICENSE](./LICENSE).

## Stack

| Layer    | Tech                                                        | Hosting                                              |
| -------- | ---------------------------------------------------------- | ---------------------------------------------------- |
| Frontend | Next.js 16, React 19, TypeScript, Tailwind CSS             | Vercel → `www.notadiet.life` (apex 301 → www)        |
| Backend  | Strapi 5.46, PostgreSQL                                     | Railway → `cms.notadiet.life`                        |
| Media    | Cloudflare R2 (S3 upload provider)                         | `media.notadiet.life` (prod uploads are absolute CDN URLs) |
| Tooling  | Yarn 4 (Berry) workspaces, Jest 30 + React Testing Library | —                                                    |

## Layout

```
.
├── frontend/   # Next.js app (App Router, /[lang]/ routes, component resolver)
├── backend/    # Strapi 5 CMS (content types, dynamic zones, seed scripts)
├── docs/       # Project docs (SEO content guidance, …)
├── CLAUDE.md   # Architecture notes & conventions (read this before contributing)
└── nad-database.tar.gz   # Strapi data export for seeding
```

## Prerequisites

- Node.js `>=18 <=22`
- Yarn `4.14.1` (Berry — bundled via `packageManager`, no global install needed)
- PostgreSQL (backend; local dev can fall back to SQLite)

## Setup

```bash
yarn install                              # install all workspaces
cp frontend/.env.example frontend/.env    # then fill in values
cp backend/.env.example  backend/.env     # then fill in values
yarn seed                                 # import nad-database.tar.gz into Strapi (hard reset)
```

## Develop

```bash
yarn dev        # clear cache + run frontend (:3000) and backend (:1337) together
yarn frontend   # frontend only
yarn backend    # backend (Strapi admin) only
```

## Common commands

```bash
yarn build         # build frontend
yarn test          # run frontend tests
yarn lint          # lint frontend
yarn clear         # delete frontend .next cache
yarn export        # export Strapi data → nad-database.tar.gz
yarn seed:dev <m>  # run one local seed manifest (backend/scripts/seeds/<m>.js)
yarn seed:dev:all  # run every seed manifest
```

Always scope workspace commands with `yarn workspace <name> <cmd>` — never `yarn --prefix`.

## Content model

Strapi drives all content. Key endpoints → frontend usage:

| Endpoint          | Used by                                             |
| ----------------- | --------------------------------------------------- |
| `/api/pages`      | Home `/[lang]/` + dynamic pages `/[lang]/[...slug]` |
| `/api/articles`   | Blog listing, posts, featured posts                 |
| `/api/global`     | Navbar, footer, SEO, banner                         |
| `/api/categories` | Blog sidebar filter                                 |
| `/api/legals`     | Privacy, terms, cookie policy                       |

Pages use a Strapi **dynamic zone** (`contentSections`); each `__component` is mapped to a
React component by `frontend/src/app/[lang]/utils/component-resolver.tsx`. Adding a new
section type requires updating the populate middleware and the resolver — see **CLAUDE.md**
for the full step-by-step.

## Contributing

This is a private project. Architecture conventions, Strapi v5 populate gotchas, the seeding
system, and styling rules are documented in [CLAUDE.md](./CLAUDE.md) and [AGENTS.md](./AGENTS.md).
Read them before making changes.
