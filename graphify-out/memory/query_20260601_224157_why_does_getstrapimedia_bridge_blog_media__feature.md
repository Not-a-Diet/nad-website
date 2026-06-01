---
type: "query"
date: "2026-06-01T22:41:57.005951+00:00"
question: "Why does getStrapiMedia bridge Blog Media, Features & Philosophy, Localization & Analytics and other communities?"
contributor: "graphify"
source_nodes: ["getStrapiMedia", "getStrapiURL", "Media", "RootLayout", "PricingTeaser", "Features"]
---

# Q: Why does getStrapiMedia bridge Blog Media, Features & Philosophy, Localization & Analytics and other communities?

## Answer

getStrapiMedia (frontend/src/app/[lang]/utils/api-helpers.ts, community 17) is the universal Strapi media-URL adapter: a leaf utility whose only outgoing dependency is getStrapiURL, but which is called/imported by ~10 component clusters across the app (blog views, RootLayout/SEO, Features/Team, PricingTeaser, PricingServiceCard/FloatingFood, PricingSteps, Media.tsx). All 26 edges are EXTRACTED. High betweenness (0.025) because it is a fan-in shared kernel: the only concern every visual surface shares is resolving a Strapi image URL, so shortest paths between otherwise-unrelated feature clusters route through it. Any CMS-media-URL change is therefore a single-chokepoint edit on the frontend rather than a sprawling one.

## Source Nodes

- getStrapiMedia
- getStrapiURL
- Media
- RootLayout
- PricingTeaser
- Features