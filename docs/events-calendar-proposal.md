# PER-36: events calendar proposal

Status: exploration; no event routes or content types have been added.

Start with a chronological agenda grouped by month. Each row uses a portrait
image on the left and event details on the right: date/time, title, short
description, location or “Online”, and a registration link. On mobile, stack
the photo above the details. Use the existing cream backgrounds, green accents,
rounded image corners, Bricolage headings, and `CtaButton` styling.

The [reference event](https://www.zreen.it/eventi/approccio-nutraceutico-nella-transizione-menopausale/)
presents an image, date/time, duration, speaker, price, and event description.
These are useful content fields; its health claims and event content should
not be copied into NAD. A month grid can be added later if event volume makes
date-based browsing useful.

## Reuse and proposed structure

- Reuse `getStrapiMedia`, Next Image, `fetchAPI`, `localizedHref`, `CtaButton`,
  and the responsive portrait/text layout already used by `PricingSteps`.
  Keep events separate from pricing so their dates and lifecycle are explicit.
- Add a localized Strapi **Event** collection with draft/publish, a stable slug,
  title, summary, description, portrait image, start/end instants, an IANA time
  zone, location/online label, speaker, optional price text, registration URL,
  and scheduled/cancelled status. Store instants consistently and display the
  event's named time zone to avoid browser-local time ambiguity.
- A server-rendered `/[lang]/events` agenda shows upcoming events, with a
  separate past-events view. A home-page teaser can reuse the same event card
  and link to the agenda. Show a localized empty state when nothing is scheduled.
- Add detail routes only if events need long descriptions on NAD; an external
  registration URL can serve the first version. Avoid duplicating event data
  across homepage sections and the agenda.
- Registration initially links to the organizer's existing booking service.
  This avoids introducing another form or booking integration.

## Decisions before implementation

1. Confirm the agenda layout and placement (dedicated page plus home teaser).
2. Supply one representative event and decide whether details live on NAD or
   the external registration page.
3. Confirm the default event time zone and whether past events remain public.

Acceptance should cover EN/IT/PT, mobile stacking, keyboard navigation,
missing images, cancelled events, no upcoming events, daylight-saving changes,
and events crossing midnight. Event metadata and sitemap entries can reuse
the project's SEO utilities once detail routes are in scope.
