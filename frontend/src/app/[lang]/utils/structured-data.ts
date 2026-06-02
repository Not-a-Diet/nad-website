import { SITE_URL } from "./constants";
import { hreflang, pageUrl, safeMediaUrl } from "./seo";
import type { BusinessInfo } from "./site-config";

// Pure schema.org builders. Every `url`/`image` is absolute: page URLs use the
// canonical www host (SITE_URL); media uses safeMediaUrl (CDN, never localhost).

function postalAddress(b: BusinessInfo) {
  const addr: Record<string, unknown> = { "@type": "PostalAddress" };
  if (b.streetAddress) addr.streetAddress = b.streetAddress;
  if (b.addressLocality) addr.addressLocality = b.addressLocality;
  if (b.addressRegion) addr.addressRegion = b.addressRegion;
  if (b.postalCode) addr.postalCode = b.postalCode;
  if (b.addressCountry) addr.addressCountry = b.addressCountry;
  return Object.keys(addr).length > 1 ? addr : undefined;
}

export function organizationSchema(b: BusinessInfo) {
  return prune({
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: b.name,
    legalName: b.legalName,
    url: b.url,
    logo: b.logo,
    email: b.email,
    telephone: b.telephone,
    sameAs: b.sameAs?.length ? b.sameAs : undefined,
  });
}

export function localBusinessSchema(b: BusinessInfo) {
  return prune({
    "@context": "https://schema.org",
    "@type": b.businessType || "LocalBusiness",
    "@id": `${SITE_URL}/#localbusiness`,
    name: b.name,
    url: b.url,
    image: b.logo,
    email: b.email,
    telephone: b.telephone,
    priceRange: b.priceRange,
    address: postalAddress(b),
    geo:
      b.latitude != null && b.longitude != null
        ? { "@type": "GeoCoordinates", latitude: b.latitude, longitude: b.longitude }
        : undefined,
    openingHoursSpecification: b.openingHours?.length ? b.openingHours : undefined,
    sameAs: b.sameAs?.length ? b.sameAs : undefined,
  });
}

export function websiteSchema(b: BusinessInfo, lang: string) {
  return prune({
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: b.name,
    url: SITE_URL,
    inLanguage: hreflang(lang),
    publisher: { "@id": `${SITE_URL}/#organization` },
  });
}

export interface BreadcrumbItem {
  name: string;
  /** locale-less path, e.g. "/blog" or "" for home. */
  path: string;
  lang: string;
}

export function breadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: pageUrl(it.lang, it.path),
    })),
  };
}

interface ArticleSchemaInput {
  title?: string;
  description?: string;
  coverUrl?: string | null;
  publishedAt?: string;
  updatedAt?: string;
  author?: { name?: string; bio?: string; url?: string; sameAs?: string[]; avatarUrl?: string | null } | null;
}

export function articleSchema(
  article: ArticleSchemaInput,
  lang: string,
  path: string,
  business: BusinessInfo,
) {
  const image = safeMediaUrl(article.coverUrl);
  const author = article.author;
  const avatar = safeMediaUrl(author?.avatarUrl);

  return prune({
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: article.title,
    description: article.description,
    image: image ?? undefined,
    inLanguage: hreflang(lang),
    mainEntityOfPage: { "@type": "WebPage", "@id": pageUrl(lang, path) },
    datePublished: article.publishedAt,
    dateModified: article.updatedAt ?? article.publishedAt,
    author: author?.name
      ? prune({
          "@type": "Person",
          name: author.name,
          url: author.url,
          image: avatar ?? undefined,
          description: author.bio,
          sameAs: author.sameAs?.length ? author.sameAs : undefined,
        })
      : undefined,
    publisher: {
      "@type": "Organization",
      name: business.name,
      logo: { "@type": "ImageObject", url: business.logo },
    },
  });
}

/**
 * FAQPage builder. NOTE: `Faq.tsx` already emits FAQPage inline as the single
 * source. This builder is intentionally NOT wired into any page that renders
 * the FAQ section — kept available only if FAQ emission is ever centralised.
 */
export function faqSchema(items: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((it) => ({
      "@type": "Question",
      name: it.question,
      acceptedAnswer: { "@type": "Answer", text: it.answer },
    })),
  };
}

/** Drop undefined/null/empty values recursively so JSON-LD stays clean. */
function prune<T>(obj: T): T {
  if (Array.isArray(obj)) {
    return obj.map((v) => prune(v)).filter((v) => v != null) as unknown as T;
  }
  if (obj && typeof obj === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(obj)) {
      const pv = prune(v as unknown);
      if (pv == null) continue;
      if (typeof pv === "string" && pv.trim() === "") continue;
      out[k] = pv;
    }
    return out as T;
  }
  return obj;
}
