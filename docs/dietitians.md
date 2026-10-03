# Shared dietitian profiles

Dietitians supplies the optional classic home team cards, `/[lang]/team`, `/[lang]/team/[slug]`, booking previews/calendars, and article bylines. Team Member's existing profile fields are preserved, including uploaded photos, full biography, philosophy, education, degree, registration, associations, languages, locations, specializations, contact links and projects.

## Editing and onboarding

1. In Strapi, create one **Dietitian** and its EN/IT/PT localizations. Fill name, slug, role, shortBio, profilePhoto and the detailed profile fields. Keep the slug stable to preserve incoming links.
2. Enable `listed` for discovery in the classic team cards, booking selector and team directory. Unlisted profiles can still be opened directly (for example from an article byline); this flag is not a privacy control.
3. For appointments, enable `bookingEnabled` and add `bookingLocations` with the existing location name and calendar embed URL. Booking also requires `listed`. These entries automatically populate the existing Contact section; its translated labels stay on the section. No duplicate person entries are needed there.
4. In an Article, select the same record in `dietitian`. Name, photo, profile link and structured author data come from it. Articles do not get assigned automatically when someone joins.
5. The Team section defaults to a compact, photo-free `layout: preview`, with a localized CTA to the directory. Portraits and quick profile details appear in the booking selector. `ctaLabel` overrides the translated label. Set `layout: classic` to restore the original card design, using the shared profiles. The default preview stays photo-free even when shared profile data is unavailable.

`email` is private in the content API. Contact links are the intended public contact fields. Profiles retain the previous collection's immediate-save behavior (`draftAndPublish: false`).

## Field guidance in Strapi

The Dietitian editor includes Italian help text for every field, text placeholders, and copyable JSON examples. For JSON lists, `null` means not filled in; replace it with your list, or use `[]` for an empty list. Examples are guidance only and are never saved as profile defaults. Nested calendar and link fields have their own guidance too (shared wherever those components are used).

`backend/src/utils/dietitian-editor.js` adds missing descriptions/placeholders at startup using Strapi’s Content Manager configuration. Existing editor descriptions, labels, and layouts are preserved. Editors can customize the help through [Configure the view](https://docs.strapi.io/cms/features/content-manager#configuring-the-edit-view). JSON editors use persistent help text because they do not support placeholder configuration.

## Migrating existing content

Back up the database first and stop the backend before running this offline CLI. Run from the repository root:

```sh
yarn workspace backend migrate:dietitians
yarn workspace backend migrate:dietitians --apply
```

The first command previews data changes; Strapi still loads and synchronizes the new schema. The second applies a transaction. It merges exact normalized names from Team Members, published Team/Contact sections, and Authors; copies uploaded media references and calendar locations; links translations under one document; and links both draft and published article rows to the correct localized profile. It leaves page content, original profile records, old authors and old booking entries intact. Article content and publication state remain intact; linked articles receive a new modification timestamp. Conflicting calendars, duplicate names and slug collisions stop the migration for manual resolution. It does not guess qualifications for author-only records.

Re-running preserves existing Dietitian edits and skips already linked articles. It is a one-time migration, not synchronization from legacy records. If a canonical record already exists, review its fields and calendars before rollout; the migration deliberately does not overwrite it.

Team Members, Authors, inline team members, inline booking persons and `authorsBio` are hidden from the normal CMS editing flow but retained as production migration sources. The development seed is `yarn seed:dev dietitian`.

Existing read permissions for Team Members are copied to Dietitians for the same roles/API tokens. No write privileges are added. Verify the frontend token has `dietitian.find`/`findOne`; editors using custom roles also need Dietitian permissions configured in Strapi. Full-access tokens already cover the new collection.

See [production release instructions](production-release.md) for the prepared Railway configuration and backend-first sequence. For production, run the same migration in the backend environment with `--allow-production --apply` after a database backup, then deploy the frontend. Preparation does not deploy anything; the prepared Railway pre-deploy step runs this migration on the next backend deployment. Keep the old collections through rollout; removal is a separate cleanup after production verification.

The migration uses [Strapi's Document Service](https://docs.strapi.io/cms/api/document-service) for profiles and localizations. It links article relations by physical row to avoid publishing a draft as a side effect. The CLI waits for Strapi's asynchronous post-commit events before shutting down its database connection.

## Cleanup boundary

The frontend now reads only Dietitians for team cards, booking choices and article attribution. Legacy Author queries, inline-person fallbacks and duplicate person types have been removed. The photo-free team teaser does not fetch profiles. A profile API failure leaves the contact information and teaser usable, with no retired booking entries shown.

Deploy this frontend only after the production migration and permission checks succeed. Unlinked articles have no author byline until their `dietitian` relation is populated.

Keep these schema definitions for this release: Author, Team Member, Article.authorsBio, Team.member, BookingCalendar.persons and their component schemas. The migration reads them, and page append seeds still require their full population to preserve the existing dynamic zone. No production records or schema fields are deleted by this cleanup.

After production verification and a tested database backup, a separate release can remove those legacy schemas and the one-time migration together. Treat that removal as a database migration: schema synchronization can drop the corresponding tables or columns. Reverting application code alone is not a database rollback.

## Verification

- Frontend regression tests cover localized discovery, the selectable classic layout, selected-person preview, calendar switching, disabled bookings, and shared article attribution.
- `node --test backend/scripts/dietitian-migration.test.js backend/scripts/seed.test.js` checks content merging, conflicts and existing seed safeguards.
- Local database migration and repeat execution, API reads in EN/IT/PT, and a production frontend build validate the integration. Browser visual inspection requires an available browser session.
