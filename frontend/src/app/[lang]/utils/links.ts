import { i18n } from "i18n-config";

/**
 * Normalise a CMS-stored URL so it always carries a locale prefix.
 *
 * Rules (applied in order):
 *  1. null / undefined / ""  → "/${lang}"
 *  2. External schemes (http, https, mailto, tel, //) → unchanged
 *  3. Hash anchors (#…) → unchanged
 *  4. Already locale-prefixed (/en/…, /it/…, /pt/…) → unchanged
 *  5. "/" or "/home" → "/${lang}"
 *  6. Any other internal path → "/${lang}${path}"
 *     Accidental double-slashes are collapsed (e.g. "/en//blog" → "/en/blog").
 */
export function localizedHref(
  url: string | null | undefined,
  lang: string,
): string {
  if (!url) return `/${lang}`;

  // External schemes — never touch these
  if (/^(https?:\/\/|mailto:|tel:|\/\/)/.test(url)) return url;

  // Hash anchor — stay on the same page
  if (url.startsWith("#")) return url;

  // Already has a locale prefix — leave as-is so CMS cross-locale links work
  if (
    i18n.locales.some(
      (locale) => url === `/${locale}` || url.startsWith(`/${locale}/`),
    )
  )
    return url;

  // Root or /home are both "go to the current locale's home"
  if (url === "/" || url === "/home") return `/${lang}`;

  // Any other internal path: prepend locale
  const path = url.startsWith("/") ? url : `/${url}`;
  const result = `/${lang}${path}`;

  // Collapse accidental double-slashes that are not part of a protocol
  return result.replace(/([^:])\/\/+/g, "$1/");
}
