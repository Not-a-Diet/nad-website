/**
 * Renders a JSON-LD <script>. Server component — no "use client".
 * CSP already allows inline scripts in prod (script-src 'unsafe-inline'),
 * so no next.config.js change is needed.
 *
 * Note: FAQPage structured data is emitted inline by `Faq.tsx` (the single
 * source for FAQ schema). Do NOT also pass a `faqSchema()` object here for a
 * page that renders the FAQ section, or the FAQPage will be duplicated.
 */
export default function JsonLd({ data }: { readonly data: unknown }) {
  if (!data) return null;
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
