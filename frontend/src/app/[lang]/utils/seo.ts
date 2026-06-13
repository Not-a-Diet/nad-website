import { i18n } from "i18n-config";
import { SITE_URL } from "./constants";
import { getStrapiMedia } from "./api-helpers";

/** schema.org / OpenGraph locale codes per app locale. */
const OG_LOCALE: Record<string, string> = {
  en: "en_US",
  it: "it_IT",
  pt: "pt_PT",
};

export function ogLocale(lang: string): string {
  return OG_LOCALE[lang] ?? lang;
}

/** BCP-47 language tags for `inLanguage` / hreflang. */
const HREFLANG: Record<string, string> = {
  en: "en",
  it: "it",
  pt: "pt",
};

export function hreflang(lang: string): string {
  return HREFLANG[lang] ?? lang;
}

/** Normalise a locale-less path to a leading-slash form ('' stays ''). */
function cleanPath(path: string): string {
  if (!path) return "";
  return path.startsWith("/") ? path : `/${path}`;
}

/**
 * Canonical + hreflang alternates for a path that does NOT include the locale
 * prefix. Pass '' for a locale home, '/blog' for the blog index, etc.
 * `canonicalOverride` honours a CMS `seo.canonicalURL` when set.
 */
export function buildAlternates(
  lang: string,
  path = "",
  canonicalOverride?: string,
) {
  const clean = cleanPath(path);
  const languages: Record<string, string> = {};
  for (const locale of i18n.locales) {
    languages[hreflang(locale)] = `${SITE_URL}/${locale}${clean}`;
  }
  languages["x-default"] = `${SITE_URL}/${i18n.defaultLocale}${clean}`;

  return {
    canonical: canonicalOverride?.trim()
      ? canonicalOverride.trim()
      : `${SITE_URL}/${lang}${clean}`,
    languages,
  };
}

/** Canonical only, for routes whose slugs are localized and cannot share hreflang. */
export function buildCanonical(
  lang: string,
  path = "",
  canonicalOverride?: string,
) {
  const clean = cleanPath(path);
  return {
    canonical: canonicalOverride?.trim()
      ? canonicalOverride.trim()
      : `${SITE_URL}/${lang}${clean}`,
  };
}

/** Absolute URL for a locale path (no locale prefix), e.g. for OpenGraph `url`. */
export function pageUrl(lang: string, path = ""): string {
  return `${SITE_URL}/${lang}${cleanPath(path)}`;
}

/**
 * Absolute media URL safe to emit into metadata / JSON-LD, or null.
 * Returns null for missing media and for dev `localhost` URLs (local Strapi
 * upload provider) — never leak those into canonical/OG/structured data.
 */
export function safeMediaUrl(url?: string | null): string | null {
  const resolved = getStrapiMedia(url ?? "");
  if (!resolved) return null;
  if (resolved.startsWith("/") || resolved.includes("localhost") || resolved.includes("127.0.0.1")) {
    return null;
  }
  return resolved;
}
