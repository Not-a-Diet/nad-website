---
type: "query"
date: "2026-05-21T22:49:32.605440+00:00"
question: "Why does Banner() bridge three separate communities - Banner, Blog Post Layout & Article Select, and Contact & Booking Components?"
contributor: "graphify"
source_nodes: ["Banner()", "ArticleSelect()", "Error component", "Layout Components test suite"]
---

# Q: Why does Banner() bridge three separate communities - Banner, Blog Post Layout & Article Select, and Contact & Booking Components?

## Answer

Banner() lives in its own tiny community (#105) with classnames, colors(), BannerProps. Its high betweenness (0.009) is an artifact, not a real hub. It bridges community #27 (Blog Post Layout & Article Select) via a single INFERRED conceptually_related_to edge to ArticleSelect() - a soft extraction guess with no import/call/data link. It bridges community #3 (Contact & Booking Components) only transitively: Banner() references the Layout Components test suite (layout-components.test.tsx), which also references Error component (Error.tsx), and Error.tsx was clustered into community #3. So the bridge is (1) one soft inferred edge and (2) a shared multi-component test file - not runtime coupling. Real bridge nodes like fetchAPI() and getStrapiMedia() connect via genuine call/data edges. Side finding: error/loading boundary components (Error, Loader, SectionErrorBoundary) are scattered across communities #3 and #31.

## Source Nodes

- Banner()
- ArticleSelect()
- Error component
- Layout Components test suite