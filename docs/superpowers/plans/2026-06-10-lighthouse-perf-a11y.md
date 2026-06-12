# Lighthouse Performance + Accessibility Fixes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix the issues from the 2026-06-10 Lighthouse mobile audit of `https://www.notadiet.life/it` — Performance 0.81 → ≥0.90 and Accessibility 0.79 → ≥0.95 — with fixes that apply to both mobile and desktop.

**Architecture:** Three groups of changes. (1) Color/contrast: adjust the Tailwind palette (darken `crema-500`, darken `primary`, add a dark `secondary-700`) and swap lime/yellow text-on-light and white-on-lime usages to passing combinations. (2) Semantics: fix ARIA misuse in the Reviews carousel, footer heading order, logo link name, and touch-target sizes. (3) Performance: replace the 1.1 MB logo SVG (half the page weight) with a 24 KB svgo-optimized version, defer Google Analytics, add responsive `sizes` to oversized images, and set long cache TTLs on the media CDN.

**Tech Stack:** Next.js 16 (App Router), React 19, Tailwind, Jest 30 + RTL 16 (jsdom), Strapi 5 CMS on Railway, media on Cloudflare R2, frontend on Vercel (manual deploy).

**Lighthouse findings → task mapping:**

| Finding | Task |
|---|---|
| `color-contrast` (17 nodes): lime `#b8ce12`/`#bcda01` text on white, white on `#e8471e`/`#b8ce12`/`#facc15` buttons, gray `#a8a29e` body text | 1, 2, 3 |
| `aria-allowed-attr` / `aria-required-children` / `target-size`: carousel dots | 4 |
| `aria-prohibited-attr`: star-rating `div[aria-label]` | 4 |
| `heading-order`: footer `<h6>Menu</h6>` | 5 |
| `label-content-name-mismatch`: logo link `aria-label="Back to homepage"` vs visible "Not a Diet" | 5 |
| `errors-in-console`: React #418 hydration text mismatch | 6 |
| LCP 4.6 s; 620 KB logo SVG; gtag 164 KB preloaded; 828 px images shown at ~128 px; 4 h media cache TTL; 14 KB legacy polyfills | 7, 8, 9, 10, 11 |

**Contrast math (verified, white background unless stated):**
- `crema-500` new value `#78716c` → 4.80:1 (old `#a8a29e` was 2.52:1)
- new `secondary-700` `#5f6e0c` → 5.64:1 on white, 5.13:1 on `secondary-100` `#dcfce7`
- `primary` new value `#d63b12` with white text → 4.67:1 (old `#e8471e` was 3.92:1)
- `crema` `#1c1917` text on `secondary` `#B8CE12` → ~9.8:1, on `tertiary-500` `#facc15` → ~10:1, on hover-green `#16a34a` → 5.3:1
- `quaternary-rose` `#bf3d5c` with white text → 5.2:1 (already passes, no change)

**Out of scope:** `identical-links-same-purpose` (WCAG AAA, informative only), chrome-extension JS flagged in TBT (not ours), CSP `unsafe-inline` (needed by Next runtime per existing comment in next.config).

---

### Task 1: Tailwind palette — accessible color values

**Files:**
- Modify: `frontend/tailwind.config.js`

- [ ] **Step 1: Update the palette**

In `frontend/tailwind.config.js`, change three entries inside `theme.extend.colors`:

```js
        'primary':
        {
          DEFAULT: '#d63b12',   // was #e8471e — 4.67:1 with white text (was 3.92:1)
          500: '#ff8566',
          100: '#ffedd5',
        },
        'secondary':
        {
          DEFAULT: '#B8CE12',
          500: '#bcda01',
          100: '#dcfce7',
          700: '#5f6e0c',       // NEW — dark olive for lime-brand text on light backgrounds (5.6:1 on white)
        },
```

and in `crema`:

```js
        'crema':
        {
          DEFAULT: '#1c1917',
          200: '#e7e5e4',
          500: '#78716c',       // was #a8a29e — 4.8:1 on white (was 2.52:1)
          800: '#292524'
        }
```

Everything else stays as-is. Note: this intentionally shifts the brand orange slightly darker everywhere `primary` is used (buttons, text highlights) — that is the point; it makes every white-on-primary button pass WCAG AA without touching call sites.

- [ ] **Step 2: Verify build + tests still pass**

Run: `yarn workspace frontend test && yarn lint`
Expected: all tests PASS, lint shows only the 2 pre-existing errors (empty `{}` types in Category/Article interfaces — do not fix).

- [ ] **Step 3: Commit**

```bash
git add frontend/tailwind.config.js
git commit -m "fix(a11y): darken primary/crema-500, add secondary-700 for WCAG AA contrast"
```

---

### Task 2: Replace lime text on light backgrounds with `text-secondary-700`

The lime brand color stays for backgrounds, borders, and text **on dark backgrounds** (footer hovers, PricingTeaser `BandVariant` which sits on `bg-crema`). Only text on light backgrounds changes.

**Files:**
- Modify: `frontend/src/app/[lang]/components/Hero.tsx:46`
- Modify: `frontend/src/app/[lang]/components/Team.tsx:56,61`
- Modify: `frontend/src/app/[lang]/components/Reviews.tsx:372`
- Modify: `frontend/src/app/[lang]/components/PricingTeaser.tsx:50,114,119,196,219`
- Modify: `frontend/src/app/[lang]/components/PricingServiceCard.tsx:66`
- Modify: `frontend/src/app/[lang]/components/PricingSteps.tsx:54,187`
- Modify: `frontend/src/app/[lang]/components/ArticleSelect.tsx:60`
- Modify: `frontend/src/app/[lang]/components/Features.tsx:34-59`
- Modify: `frontend/src/app/[lang]/views/post.tsx:35`

- [ ] **Step 1: Hero heading highlight**

`Hero.tsx` line 46 — change the `secondColor` prop:

```tsx
            secondColor="text-secondary-700"
```

- [ ] **Step 2: Team occupation + checkmarks**

`Team.tsx` line 56:

```tsx
      <p className="text-secondary-700 text-center mb-4">{occupation}</p>
```

`Team.tsx` line 61:

```tsx
            <span className="text-secondary-700 mr-2 mt-1">✓</span>
```

- [ ] **Step 3: Reviews eyebrow**

`Reviews.tsx` line 372 — change `text-secondary-500` to `text-secondary-700`:

```tsx
              <p className="m-0 mb-3 text-sm font-bold uppercase tracking-[0.12em] text-secondary-700">
```

- [ ] **Step 4: PricingTeaser (CardVariant + InlineVariant only — do NOT touch BandVariant lines 151/156/176, those sit on dark `bg-crema`)**

Line 50 (CardVariant eyebrow): `text-secondary-500` → `text-secondary-700`
Lines 114 and 119 (studio/online badges on `bg-secondary-100`): `text-secondary-500` → `text-secondary-700`, i.e.:

```tsx
              <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary-100 px-2.5 py-1 font-bold text-secondary-700">
```

Line 196 (InlineVariant eyebrow): `text-secondary-500` → `text-secondary-700`
Line 219 (InlineVariant follow-up price on white pill): `text-secondary-500` → `text-secondary-700`

- [ ] **Step 5: Pricing page components**

`PricingServiceCard.tsx` line 66 (eyebrow): `text-secondary-500` → `text-secondary-700`

`PricingSteps.tsx` line 54:

```tsx
  const accentText = accent === "primary" ? "text-primary" : "text-secondary-700";
```

`PricingSteps.tsx` line 187: `highlightClass="text-secondary-500"` → `highlightClass="text-secondary-700"`

- [ ] **Step 6: Blog components**

`ArticleSelect.tsx` line 60 — current-article highlight in the sidebar list: change `"text-secondary"` to `"text-secondary-700"` inside the template literal.

`views/post.tsx` line 35:

```tsx
            <p className="text-md text-secondary-700">
```

- [ ] **Step 7: Features card colorMap text accents**

`Features.tsx` — in `colorMap`, the `text` values render ✓ checkmarks on the cards' pastel `*-100` backgrounds; `secondary`/`tertiary`/`primary` all fail there. Change the `text` entries:

```tsx
    primary: {
      bg: "bg-primary-100",
      border: "border-primary",
      text: "text-primary",
      button: "bg-primary",
    },
    secondary: {
      bg: "bg-secondary-100",
      border: "border-secondary",
      text: "text-secondary-700",
      button: "bg-secondary",
    },
    tertiary: {
      bg: "bg-tertiary-100",
      border: "border-tertiary-500",
      text: "text-tertiary",
      button: "bg-tertiary-500",
    },
```

(`quaternary` unchanged. `text-tertiary` = `#a16207`, dark amber, passes on `#fef9c3`; `text-primary` is now `#d63b12`.)

- [ ] **Step 8: Verify no flagged usage remains on light backgrounds**

Run: `grep -rn "text-secondary-500\|text-secondary[\"' ]" frontend/src --include="*.tsx" | grep -v "hover:" | grep -v "secondary-700"`
Expected: remaining hits only in dark-background contexts (`PricingTeaser.tsx` BandVariant lines ~151/156/176, `Footer.tsx`, `Contact.tsx:263` icon tint) and the `__tests__`/`ArticleSelect.tsx:29` container class (inherited by nothing visible).

- [ ] **Step 9: Run tests and commit**

Run: `yarn workspace frontend test`
Expected: PASS (the BracketHighlight tests pass their own literal classes and are unaffected).

```bash
git add frontend/src
git commit -m "fix(a11y): use secondary-700 for lime text on light backgrounds (WCAG AA)"
```

---

### Task 3: Dark text on lime/yellow button backgrounds

White text can never pass on `#B8CE12` or `#facc15`; switch those buttons to dark `text-crema` (9.8:1 / 10:1). Primary (now `#d63b12`) and quaternary-rose keep white text.

**Files:**
- Modify: `frontend/src/app/[lang]/utils/render-button-style.ts`
- Modify: `frontend/src/app/[lang]/components/Features.tsx:34-59,92`
- Modify: `frontend/src/app/[lang]/components/ArticleSelect.tsx:6`
- Modify: `frontend/src/app/[lang]/components/PriceDisplay.tsx:21` (and the two `text-white` chips)
- Modify: `frontend/src/app/[lang]/components/PricingSteps.tsx:53` (and any chip using it with `text-white`)
- Modify: `frontend/src/app/[lang]/components/cookie-consent-banner.tsx:275-284`

- [ ] **Step 1: renderButtonStyle default (bg-secondary) case**

`render-button-style.ts` — change the `default` return's `text-white` to `text-crema`:

```ts
    default:
      return "px-8 py-3 text-lg font-semibold rounded-2xl bg-secondary text-crema";
```

- [ ] **Step 2: Features card CTA links**

`Features.tsx` — add a `buttonText` field per color in `colorMap` and use it instead of the hardcoded `text-white`:

```tsx
  const colorMap: Record<string, { bg: string, border: string, text: string, button: string, buttonText: string }> = {
    primary: {
      bg: "bg-primary-100",
      border: "border-primary",
      text: "text-primary",
      button: "bg-primary",
      buttonText: "text-white",
    },
    secondary: {
      bg: "bg-secondary-100",
      border: "border-secondary",
      text: "text-secondary-700",
      button: "bg-secondary",
      buttonText: "text-crema",
    },
    tertiary: {
      bg: "bg-tertiary-100",
      border: "border-tertiary-500",
      text: "text-tertiary",
      button: "bg-tertiary-500",
      buttonText: "text-crema",
    },
    quaternary: {
      bg: "bg-quaternary-rose-100",
      border: "border-quaternary-rose",
      text: "text-quaternary-rose",
      button: "bg-quaternary-rose",
      buttonText: "text-white",
    }
  }
  const tw_col: { bg: string, border: string, text: string, button: string, buttonText: string } = colorMap[color] || colorMap.primary;
```

and line 92:

```tsx
          showLink && <a href={url} target={newTab ? '_blank' : '_self'} rel="noopener noreferrer" className={`${tw_col.button} ${tw_col.buttonText} rounded-[0.5rem] py-2 px-6 inline-block`}>{text}</a>
```

(Note: `colorMap[color] || "bg-gray-500"` was already broken — a string can't satisfy the object type; falling back to `colorMap.primary` fixes it.)

- [ ] **Step 3: ArticleSelect selected category pill**

`ArticleSelect.tsx` line 6:

```ts
    ? "px-3 py-1 rounded-lg bg-secondary text-crema"
```

- [ ] **Step 4: PriceDisplay / PricingSteps number chips**

`PriceDisplay.tsx` line 21 — keep `accentBg` but add an accent text color and use it on both chips (pill variant ~line 29 and cell variant ~line 48), replacing their `text-white`:

```tsx
  const accentBg = accent === "primary" ? "bg-primary" : "bg-secondary-500";
  const accentFg = accent === "primary" ? "text-white" : "text-crema";
```

Pill chip:

```tsx
          <span
            className={`inline-flex h-[18px] w-[18px] items-center justify-center rounded-full text-[10px] ${accentFg} ${accentBg}`}
          >
```

Cell chip:

```tsx
        <span
          className={`inline-flex h-[26px] w-[26px] items-center justify-center rounded-full text-sm font-bold ${accentFg} ${accentBg}`}
        >
```

`PricingSteps.tsx` — run `grep -n "text-white" frontend/src/app/\[lang\]/components/PricingSteps.tsx`. For every element that combines `accentBg` (or `bg-secondary-500`) with `text-white`, apply the same pattern: add `const accentFg = accent === "primary" ? "text-white" : "text-crema";` next to line 53 and substitute `text-white` with `${accentFg}` on those elements only. Leave `text-white` on dark (`bg-crema`/`bg-primary`) backgrounds alone.

- [ ] **Step 5: Cookie consent buttons**

`cookie-consent-banner.tsx` — in the inline `<style>` block (lines 275-284), the lime button uses the library's default white text. Set dark text for normal and hover states:

```tsx
      <style>
        {`
#cc-main {
--cc-btn-primary-bg: #B8CE12;
--cc-btn-primary-color: #1c1917;
--cc-btn-primary-hover-bg: #16a34a;
--cc-btn-primary-hover-color: #1c1917;
--cc-btn-primary-hover-border-color: #444444;
--cc-toggle-on-bg: var(--cc-btn-primary-bg);
}
`}
      </style>
```

- [ ] **Step 6: Run tests and commit**

Run: `yarn workspace frontend test && yarn lint`
Expected: PASS / only the 2 pre-existing lint errors.

```bash
git add frontend/src
git commit -m "fix(a11y): dark text on lime/yellow button backgrounds"
```

---

### Task 4: Reviews carousel ARIA + touch targets (TDD)

Fixes `aria-prohibited-attr` (star `div[aria-label]`), `aria-allowed-attr` + `aria-required-children` (fake tablist with `aria-selected` buttons), and `target-size` (8×8 px dots).

**Files:**
- Modify: `frontend/src/app/[lang]/components/Reviews.tsx:132-152,434-447`
- Test: `frontend/src/__tests__/a11y-fixes.test.tsx` (new file)

- [ ] **Step 1: Write the failing test**

Create `frontend/src/__tests__/a11y-fixes.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

jest.mock('next/navigation', () => ({
  usePathname: () => '/it',
  useRouter: () => ({ push: jest.fn(), refresh: jest.fn() }),
  useParams: () => ({ lang: 'it' }),
}))

describe('Reviews accessibility', () => {
  const data = {
    id: 1,
    showSummary: true,
    summaryAverage: 5,
    summaryCount: 30,
    summaryLabel: 'reviews',
    reviews: [
      { id: 1, authorName: 'Anna B', rating: 5, comment: 'Great', platform: 'google' as const },
    ],
  }

  it('exposes star ratings as role=img with an accessible name', async () => {
    const Reviews = (await import('@/app/[lang]/components/Reviews')).default
    render(<Reviews data={data} lang="it" />)
    expect(
      screen.getAllByRole('img', { name: '5 out of 5 stars' }).length
    ).toBeGreaterThan(0)
  })
})
```

- [ ] **Step 2: Run it to verify it fails**

Run: `yarn workspace frontend test a11y-fixes`
Expected: FAIL — "Unable to find an accessible element with the role img and name 5 out of 5 stars" (the div has `aria-label` but no role, so it is not exposed).

- [ ] **Step 3: Fix the Stars atom**

`Reviews.tsx` `Stars` function (line 132) — add `role="img"`:

```tsx
function Stars({ value = 5 }: { value?: number }) {
  return (
    <div role="img" className="inline-flex gap-0.5" aria-label={`${value} out of 5 stars`}>
```

(rest of the function unchanged)

- [ ] **Step 4: Fix the pagination dots**

`Reviews.tsx` — replace the dots block (lines 434-447) with:

```tsx
              <div className="flex items-center gap-2" role="group" aria-label="Review pages">
                {Array.from({ length: pageCount }).map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => scrollTo(i)}
                    aria-label={`Go to page ${i + 1}`}
                    aria-current={i === page ? "true" : undefined}
                    className="group/dot flex h-6 min-w-6 cursor-pointer items-center justify-center rounded-full border-0 bg-transparent p-0"
                  >
                    <span
                      aria-hidden="true"
                      className={`h-2 rounded-full transition-[background,width] duration-300 ${
                        i === page ? "w-6 bg-primary" : "w-2 bg-crema-200 group-hover/dot:bg-crema-500"
                      }`}
                    />
                  </button>
                ))}
              </div>
```

What changed and why:
- `role="tablist"` → `role="group"` (the dots don't control tab panels; `group` allows `aria-label` and has no required children).
- `aria-selected` → `aria-current` (valid on buttons; announces the active page).
- Each button is now a 24×24 px hit target (`h-6 min-w-6`) containing the small visual dot as an inner `<span>`; with `gap-2` spacing this satisfies the 24 px target-size rule. Hover tint moves to `group-hover/dot:` on the span.

- [ ] **Step 5: Run tests to verify they pass**

Run: `yarn workspace frontend test`
Expected: PASS, including the new `a11y-fixes` test.

- [ ] **Step 6: Commit**

```bash
git add frontend/src/app/\[lang\]/components/Reviews.tsx frontend/src/__tests__/a11y-fixes.test.tsx
git commit -m "fix(a11y): reviews carousel — img role for stars, valid dot semantics, 24px targets"
```

---

### Task 5: Footer heading order + Logo link name (TDD)

**Files:**
- Modify: `frontend/src/app/[lang]/components/Footer.tsx:105`
- Modify: `frontend/src/app/[lang]/components/Logo.tsx:14`
- Test: `frontend/src/__tests__/a11y-fixes.test.tsx`

- [ ] **Step 1: Write the failing tests**

Append to `frontend/src/__tests__/a11y-fixes.test.tsx`:

```tsx
describe('Footer heading order', () => {
  it('renders the Menu heading as h2 (no skipped levels after page h2/h3s)', async () => {
    const Footer = (await import('@/app/[lang]/components/Footer')).default
    render(
      <Footer
        logoUrl={null}
        logoText="Not a Diet"
        description="desc"
        menuLinks={[]}
        categoryLinks={[]}
        legalLinks={[]}
        socialLinks={[]}
      />
    )
    expect(screen.getByRole('heading', { level: 2, name: 'Menu' })).toBeInTheDocument()
  })
})

describe('Logo link accessible name', () => {
  it('includes the visible brand text in the aria-label (WCAG 2.5.3 label-in-name)', async () => {
    const Logo = (await import('@/app/[lang]/components/Logo')).default
    render(<Logo src={null}><h2>Not a Diet</h2></Logo>)
    expect(screen.getByRole('link').getAttribute('aria-label')).toMatch(/Not a Diet/)
  })
})
```

- [ ] **Step 2: Run to verify both fail**

Run: `yarn workspace frontend test a11y-fixes`
Expected: FAIL — Menu heading found at level 6 not 2; aria-label is "Back to homepage" without "Not a Diet".

- [ ] **Step 3: Implement**

`Footer.tsx` line 105 (Tailwind preflight unstyles headings, so this is visually identical):

```tsx
            <h2 className="text-white mb-4">Menu</h2>
```

`Logo.tsx` line 14 — make the accessible name contain the visible text:

```tsx
      aria-label="Not a Diet - Back to homepage"
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `yarn workspace frontend test`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add frontend/src/app/\[lang\]/components/Footer.tsx frontend/src/app/\[lang\]/components/Logo.tsx frontend/src/__tests__/a11y-fixes.test.tsx
git commit -m "fix(a11y): footer heading order and logo link accessible name"
```

---

### Task 6: React #418 hydration error (investigation — use superpowers:systematic-debugging)

Lighthouse logged `Minified React error #418` (server/client **text** mismatch) on the production home page. The render must be made deterministic; the exact source needs a dev-mode reproduction first.

**Files:**
- Likely modify: `frontend/src/app/[lang]/components/Reviews.tsx:201-207`

- [ ] **Step 1: Reproduce with readable errors**

Run: `yarn dev` (root — starts Strapi + Next; Strapi must be seeded/running per CLAUDE.md), then open `http://localhost:3000/it` in a browser and read the console. Dev React prints the exact mismatched text and component stack instead of #418.

- [ ] **Step 2: Apply the matching fix**

Primary suspect — `Reviews.tsx` `dateLabel` (lines 201-207): `new Date(review.date)` parses a date-only string as UTC midnight, then `Intl.DateTimeFormat` formats it in the *runtime's* timezone — server (UTC) and a visitor west of UTC produce different day numbers. Make it timezone-independent:

```tsx
  const dateLabel = review.date
    ? new Intl.DateTimeFormat(lang || "en", {
        year: "numeric",
        month: "long",
        day: "numeric",
        timeZone: "UTC",
      }).format(new Date(review.date))
    : null;
```

If the dev console points at a different component, fix that component on the same principle (no `Date`/locale/timezone/random-dependent values in render output) and record what it was in the commit message. Do **not** paper over it with `suppressHydrationWarning`.

- [ ] **Step 3: Verify**

Reload `http://localhost:3000/it` with the console open.
Expected: no hydration warnings/errors.

- [ ] **Step 4: Commit**

```bash
git add frontend/src
git commit -m "fix(frontend): make SSR text deterministic to resolve React #418 hydration error"
```

---

### Task 7: Defer Google Analytics off the critical path

gtag.js (164 KB, 67 KB unused) is currently fetched with High priority during hydration and contributes to LCP/TBT. Analytics is consent-gated anyway, so loading it after everything else loses nothing.

**Files:**
- Modify: `frontend/src/app/[lang]/components/cookie-consent-banner.tsx:286-298`

- [ ] **Step 1: Change both Script strategies to lazyOnload**

```tsx
      {/* GA4 library — deferred until the browser is idle; analytics is consent-gated anyway */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="lazyOnload"
      />
```

and the `gtag-init` script:

```tsx
      <Script id="gtag-init" strategy="lazyOnload">
```

The inline snippet already defines `window.gtag` as a `dataLayer` queue shim, and the consent-`update` callback in the effect uses that same global, so ordering remains safe: `consent default` is still queued before `config` within the same inline script.

- [ ] **Step 2: Verify GA still fires**

Run: `yarn dev`, open `http://localhost:3000/it`, accept cookies, and check the Network tab.
Expected: `gtag/js` loads after page load (idle), a `collect?v=2` request fires after accepting.

- [ ] **Step 3: Commit**

```bash
git add frontend/src/app/\[lang\]/components/cookie-consent-banner.tsx
git commit -m "perf: load GA4 lazily after page load"
```

---

### Task 8: Responsive `sizes` for oversized images

Team portraits ship 828 px wide for a 128 px slot (~69 KB wasted); blog author avatar has the same pattern (56 px slot).

**Files:**
- Modify: `frontend/src/app/[lang]/components/Team.tsx:44-53`
- Modify: `frontend/src/app/[lang]/views/post.tsx:27-34`

- [ ] **Step 1: Team portrait**

`Team.tsx` — add `sizes` to the `<Image>` (slot is `w-32` = 128 px at every breakpoint):

```tsx
          <Image
            src={profilePhotoUrl}
            alt={name}
            width={400}
            height={400}
            sizes="128px"
            loading="lazy"
            className="border-2 rounded-full drop-shadow-md dark:bg-gray-500 dark:border-gray-700"
          />
```

- [ ] **Step 2: Post author avatar**

`views/post.tsx` — add `sizes="56px"` to the author `<Image>` (slot is `w-14`):

```tsx
              <Image
                src={authorImgUrl}
                alt={author ? `${author.name}` : "author"}
                width={400}
                height={400}
                sizes="56px"
                className="w-14 h-14 border rounded-full dark:bg-gray-500 dark:border-gray-700"
              />
```

- [ ] **Step 3: Verify and commit**

Run: `yarn workspace frontend test && yarn build`
Expected: PASS / build succeeds.

```bash
git add frontend/src/app/\[lang\]/components/Team.tsx frontend/src/app/\[lang\]/views/post.tsx
git commit -m "perf: add sizes to fixed-slot images so srcset picks small candidates"
```

---

### Task 9: Cut legacy JS polyfills + HSTS header (small wins)

14 KB of ES2022 polyfills (`Array.prototype.at`, `Object.hasOwn`, …) ship because no browserslist is set. Lighthouse also reported HSTS missing `includeSubDomains`/`preload` (informative).

**Files:**
- Modify: `frontend/package.json`
- Modify: `frontend/next.config.mjs` (or `.js` — whichever exists; the `securityHeaders` array)

- [ ] **Step 1: Add browserslist to frontend/package.json**

Add a top-level key (browsers with full ES2022 support — matches the polyfills Lighthouse flagged):

```json
  "browserslist": [
    "chrome >= 100",
    "edge >= 100",
    "firefox >= 100",
    "safari >= 15.4"
  ]
```

- [ ] **Step 2: Strengthen HSTS**

In the next.config `securityHeaders` array, add (all subdomains — `cms.` and `media.` — already serve HTTPS):

```js
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
```

- [ ] **Step 3: Verify build and commit**

Run: `yarn build`
Expected: build succeeds.

```bash
git add frontend/package.json frontend/next.config.*
git commit -m "perf: modern browserslist targets; strengthen HSTS header"
```

---

### Task 10: Replace the 1.1 MB logo SVG (biggest single win — 620 KB transfer, half the page weight)

The CMS asset `nad_logo_850x850_3150bb36cf.svg` is raw Inkscape output; svgo compresses it 1076 KB → 24 KB with identical rendering. The asset lives in Strapi/R2, so the swap is a content operation, not a code change.

**Files:** none in repo (artifact: `/tmp/nad_logo_850x850.min.svg`)

- [ ] **Step 1: Produce the optimized file**

```bash
curl -s https://media.notadiet.life/nad_logo_850x850_3150bb36cf.svg -o /tmp/nad_logo_orig.svg
npx -y svgo@3 /tmp/nad_logo_orig.svg -o /tmp/nad_logo_850x850.min.svg --multipass
ls -la /tmp/nad_logo_850x850.min.svg
```

Expected: ~25 KB output (verified: 24.3 KB, 97.7% reduction).

- [ ] **Step 2: Visually verify**

Open both files in a browser (`xdg-open /tmp/nad_logo_orig.svg` and `xdg-open /tmp/nad_logo_850x850.min.svg`).
Expected: pixel-identical logo.

- [ ] **Step 3: Replace the asset in Strapi (MANUAL — production CMS)**

In the Strapi admin (`https://cms.notadiet.life/admin`) → Media Library → locate `nad_logo_850x850.svg` → open asset details → **Replace media** → upload `/tmp/nad_logo_850x850.min.svg`. Replacing (rather than uploading new) keeps the Global navbar/footer logo relations across all locales pointing at the same asset.

- [ ] **Step 4: Redeploy frontend (MANUAL)**

The site is statically generated, so the logo URL is baked in at build time and the deploy flow is **manual Vercel deploy** (auto-deploy is off for this project). After the asset swap, trigger a Vercel production deploy, then confirm `view-source:https://www.notadiet.life/it` references the new file and that it transfers ~25 KB.

---

### Task 11: Long cache TTL on media.notadiet.life (MANUAL — Cloudflare)

Lighthouse: all R2 media served with 4 h TTL (~421 KB re-downloadable). Strapi filenames are content-hashed, so long TTLs are safe.

- [ ] **Step 1: Create a Cloudflare Cache Rule**

Cloudflare dashboard → zone `notadiet.life` → Caching → Cache Rules → Create rule:
- Name: `media long TTL`
- When: Hostname equals `media.notadiet.life`
- Then: Eligible for cache; Edge TTL: 1 month; Browser TTL: 1 year

- [ ] **Step 2: Verify**

Run: `curl -sI https://media.notadiet.life/kiwi_761eab035e.svg | grep -i cache-control`
Expected: `cache-control: max-age=31536000` (or equivalent), not `max-age=14400`.

---

### Task 12: Final verification

- [ ] **Step 1: Full local gate**

Run: `yarn workspace frontend test && yarn lint && yarn build`
Expected: tests PASS; lint shows only the 2 pre-existing errors; build succeeds.

- [ ] **Step 2: Visual sanity pass**

Run `yarn dev`, view `http://localhost:3000/it`, `/en`, and `/it/pricing`. Check: hero highlight is dark olive (legible), buttons read clearly (dark text on lime/yellow, white on the deeper orange), review dots are slightly larger hit areas, footer/header look unchanged.

- [ ] **Step 3: Deploy (MANUAL) and re-run Lighthouse on prod, both form factors**

After the manual Vercel deploy (and Tasks 10-11 done):

```bash
npx -y lighthouse https://www.notadiet.life/it --output=json --output-path=/tmp/lh-mobile.json --only-categories=performance,accessibility,best-practices,seo --quiet --chrome-flags="--headless=new"
npx -y lighthouse https://www.notadiet.life/it --preset=desktop --output=json --output-path=/tmp/lh-desktop.json --only-categories=performance,accessibility,best-practices,seo --quiet --chrome-flags="--headless=new"
node -e "for (const f of ['/tmp/lh-mobile.json','/tmp/lh-desktop.json']) { const r=require(f); console.log(f, Object.fromEntries(Object.entries(r.categories).map(([k,v])=>[k,v.score]))); }"
```

Expected: mobile Performance ≥ 0.90 (LCP well under 2.5 s once the 620 KB logo and eager gtag are gone), Accessibility ≥ 0.95 on both, zero `color-contrast`/`aria-*`/`target-size`/`heading-order` failures, no console errors.

- [ ] **Step 4: Update the knowledge graph**

Run: `graphify update .` (per project CLAUDE.md, after code modifications).
