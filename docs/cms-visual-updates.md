# CMS setup for PER-31–PER-35

The frontend changes require the updated Strapi component schemas and page
populate middleware. Existing content stays compatible.

- **Philosophy illustrations (PER-31):** open the home page in each locale →
  Team → `filosofy` → `items` → `illustration`. Upload/select the replacement
  SVG (or another image). Existing emoji illustrations remain as placeholders
  until an image is selected. Set alternative text in the Media Library when
  the illustration conveys information beyond the adjacent heading.
- **Footer (PER-32):** `Notadiet®` is rendered alongside the current year.
- **Number badges (PER-33):** removed from `PricingSteps`. Existing `stepNumber`
  content is retained for compatibility but no longer displayed.
- **Education image (PER-34):** the live Italian `/it/pricing` page contains a
  separate `sections.pricing-steps` section headed “Sessioni di educazione
  alimentare”. In that section's step, set **reverse = true**, keeping
  **accent = secondary**. Save/publish and apply the same setting to the
  corresponding EN/PT content. The existing component then places the photo
  on the right at desktop widths and keeps it above the text on mobile.
  This is an existing CMS option, so no title-dependent frontend override is
  needed. The checked local database does not contain this section; the live
  CMS content has not been modified.
- **Collaborators (PER-35):** add the **Collaborators** section to the home
  page. Enter the localized title and add repeatable `logos` entries, each
  with a `title` and optional `logo` upload. A title without an image renders
  a labeled placeholder; selecting an image replaces it. Keep titles populated
  for accessible names. An empty section is hidden. One logo stays still;
  multiple logos scroll with a pause button and pause on hover. Reduced-motion
  users receive a static wrapping list.

For local development, with Strapi running and `SEED_DEV_TOKEN` configured:

```sh
yarn seed:dev home-collaborators
```

This reuses the idempotent append-section helper to add four named placeholders
in EN/IT/PT and publish the result. It does not overwrite an existing
Collaborators section. The helper preserves the published page fields when
updating, because older local drafts can have an empty slug. It uses the
published content as its base; publish any draft edits you want to keep before
running an append seed. Production
content can be configured using the same fields in the admin UI; the seed
runner is intentionally local-only.
