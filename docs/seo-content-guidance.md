# Content guidance for AEO / GEO (marketing team)

The site is now technically optimized (sitemap, structured data, hreflang, FAQ
schema). The remaining lever is **how articles and pages are written** so answer
engines (Google AI Overviews, Perplexity, ChatGPT search) can quote them.

## Write for being quoted

1. **Question-style headings.** Use real questions as `H2`/`H3` ("How long does
   a nutrition journey last?") instead of vague labels ("Timeline"). Answer
   engines match questions to headings.
2. **Lead with a direct answer.** Put a 1–2 sentence, self-contained answer
   immediately under each question heading, before the elaboration. That snippet
   is what gets cited.
3. **Be factual and dated.** Concrete, verifiable statements ("A BIA scan takes
   about 10 minutes") outperform vague claims. Where a fact can age, state it
   plainly so it can be refreshed.
4. **One idea per paragraph.** Short paragraphs are easier to extract than walls
   of text.
5. **Fill the FAQ section.** Each page/article can carry a `sections.faq` block;
   it emits `FAQPage` JSON-LD automatically — the single highest-value
   answer-engine schema. Keep questions in the user's own words.

## CMS fields that feed structured data

- **Article SEO** (`shared.seo`): `metaTitle`, `metaDescription`, `shareImage`,
  and now `keywords`, `metaRobots`, `canonicalURL`. Fill these per article/locale.
- **Author** (`author`): `bio`, `url`, `sameAs` (social profile URLs) → E-E-A-T
  `Person` schema. Fill once per author.
- **Cover image alt text** (`cover.alternativeText`): used as the real `alt` and
  in `BlogPosting` image — write descriptive alt text, not "cover image".
- **Global business facts** (`global.businessInfo`): legal name, telephone, email,
  address, geo, opening hours, `sameAs` → `LocalBusiness` schema. Fill once.

## Don't

- Don't keyword-stuff. Write naturally; the schema does the machine-readable work.
- Don't duplicate the same FAQ verbatim on both the home page and a dedicated FAQ
  page — split (teaser vs full) to avoid two identical `FAQPage` blocks.
