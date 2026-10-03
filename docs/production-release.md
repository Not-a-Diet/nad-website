# Dietitian / CMS production release

## Verified preparation (2026-10-03)

- Railway project: `cms-nad` (`5fd78da7-4bb5-4b0e-a803-b84b7ee5e51d`). Environment: `production` (`91ffa2ac-60ae-43c3-af35-fcd4efd01858`). Backend: `2dea7146-2fff-4604-b868-09f674d414fc` at `https://cms.notadiet.life`.
- Currently deployed backend commit: `d1d196b95a63275eaf5f568c874ff6d03e46a5df`, from `main`; PostgreSQL 18. Root directory is the repository root. Existing build/start commands use the backend Yarn workspace.
- Production has `DATABASE_CLIENT=postgres`, the private Postgres `DATABASE_URL`, HTTPS CMS/frontend/CDN URLs, and the required Strapi and R2 secrets. Values of secrets are not included here.
- Fresh backup: `nad-strapi-backup-03_10_2026.tar.gz`, exported at `2026-10-03T21:12:02.348Z` by Strapi 5.46.1. Copies in `~/dev/backups/` and `~/personal/` match SHA-256 `f4f37d03eadaf82c11c7f9eea8b7f307ee8a7b3b2277eefb3587fea02c3aaee2`.
- Archive contains 25 page rows, 21 article rows (including drafts/published variants), 54 media records, links, configuration and assets. It contains no Dietitian or standalone Team Member entries: production profiles must be built from existing Team/Contact sections and Authors.
- A merge preview of the backup's published pages resolves Vanessa and Larissa in EN/IT/PT (six bookable localized profiles) without calendar or name conflicts. Local-only detailed biographies and newly seeded sections are not copied to production by deploying code.

Strapi exports are content backups, not complete PostgreSQL snapshots: [admin users and API tokens are excluded](https://docs.strapi.io/cms/features/data-management/export). Both copies are verified readable. A full restore into an isolated local Strapi instance succeeded (129 entities, 220 asset files, 322 links and 94 configuration entries). Applying the release migration created six profiles and linked ten article rows; a second run kept all six and linked zero rows. Original page, article, author and media fields were preserved, apart from expected article modification timestamps. This rehearsal used SQLite; PostgreSQL execution has not been rehearsed.

## Validation

- 114 frontend tests pass; backend migration, editor guidance and seed tests pass.
- Backend admin production build passes.
- Frontend production build against the isolated restored/migrated CMS passes, generating 47 pages.
- Read-only CMS requests in EN/IT/PT return two profiles each with populated photos and booking locations; private email is excluded.
- Production PostgreSQL execution and browser visual QA remain unverified. The rehearsal server/database are local only.

## Release sequence

1. Finish CMS edits and avoid editing during the migration. Review the release diff and commit the application changes plus `railway.json`. Keep local caches, design references and database archives out of Git.
2. Merge/push the reviewed release to `main`. Railway's existing GitHub source deploys the backend from this branch. The root `railway.json` preserves its build/start commands and adds:

   ```sh
   yarn workspace backend migrate:dietitians --allow-production --apply
   ```

   This is a **pre-deploy command**: Railway runs it against production PostgreSQL after building, before starting the new backend. The CLI loads Strapi (synchronizing schema), migrates existing content, preserves source records, and exits nonzero on failure. A failed pre-deploy blocks the new app deployment; it does not undo schema synchronization or a transaction that already committed. Strapi’s existing `/_health` returns HTTP 204; no Railway health check is added because Railway requires HTTP 200.
3. Inspect Railway build and pre-deploy logs. Expect six new localized profiles on the first execution, unless production changed since the backup. Reruns report `keep` for existing Dietitians and skip linked articles. Do not run `seed`, `seed:dev:all`, or import the development database into production.
4. In production Strapi, inspect Dietitians in EN/IT/PT: listed and bookingEnabled, names, media, bookingLocations and calendar URLs. Check articles have their new dietitian relation. If the frontend uses a Custom API token, grant **Dietitian find and findOne** on that token. Read-only/full-access tokens already cover these operations. Existing Team Member read grants are copied by the migration, but production may never have had that collection. API-token types could not be inspected remotely because the local SSH key was unavailable.
5. Only after those backend checks, create a **new Vercel deployment from the release commit**. `frontend/vercel.json` disables automatic deployment of `main`, intentionally allowing backend-first release. Use Vercel's create-deployment-from-Git-reference flow; redeploying an old deployment would rebuild its old commit. Ensure production `NEXT_PUBLIC_STRAPI_API_URL=https://cms.notadiet.life` and the intended frontend API token are configured. Deploy production directly or create a production-targeted staged deployment and promote after checking it; a normal preview uses preview variables.
6. Check the live home page, team directory and both profiles, then select each dietitian and location in the booking form and confirm the iframe URL. Check blog list/detail author names and photos in all three languages, mobile review controls, and the Strapi media editor. Existing calendar URLs are real booking calendars; viewing them needs no test appointment.
7. After production verification, remove `deploy.preDeployCommand` from `railway.json` in a follow-up commit. The migration is repeatable, but leaving it enabled forever would recreate profiles intentionally deleted while their old source records remain. Retain the old schemas until a separate cleanup release.

Railway must use the root `railway.json` (no alternative Config File Path override). Its watch paths include backend files, workspace package/lock configuration and the deployment file.

## CMS content after deploy

The deployment adds schema support, not local database content. Use the production admin for these changes:

- Team defaults to the photo-free preview; `layout: classic` is still selectable.
- Complete detailed Dietitian biography/credentials as needed. Production contains inline summaries, not the detailed profiles entered locally.
- Add a Collaborators section on the home page for each locale, with named logo placeholders; upload logos later in Strapi.
- Upload/select philosophy illustrations in Team → filosofy → items → illustration.
- Set the existing education-session pricing step's `reverse` option where needed.

See [CMS visual updates](cms-visual-updates.md) and [Dietitians](dietitians.md).

## Recovery

If migration fails, retain the existing frontend, inspect the error and correct the cause before retrying the backend. The migration preserves legacy records and does not overwrite existing Dietitian edits. A code rollback alone does not restore database state.

For content recovery, use a separate local checkout matching the backup's original schemas (baseline commit above), restore the verified export there, and inspect it before transferring back. Import requires matching schemas and replaces destination content; do not import an old-schema archive into the new-schema live app. Keep the production environment secrets and R2 configuration. Recreate API tokens/admin access if needed; these are not included in the export. The exported assets use the local provider because this backup was transferred locally; restoration to R2 requires the appropriate destination upload configuration.

The archived content can be recovered independently of Railway's Pro-only native backups. No production database write or deployment is performed by preparing this release.

## References

- [Railway pre-deploy commands](https://docs.railway.com/deployments/pre-deploy-command)
- [Railway config as code](https://docs.railway.com/config-as-code/reference)
- [Vercel Git deployment controls](https://vercel.com/docs/project-configuration/git-configuration)
- [Vercel deployments from Git](https://vercel.com/docs/deployments/overview)
