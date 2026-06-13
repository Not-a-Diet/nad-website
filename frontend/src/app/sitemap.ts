import type { MetadataRoute } from "next";
import { i18n } from "i18n-config";
import { fetchAPI } from "@/app/[lang]/utils/fetch-api";
import { SITE_URL } from "@/app/[lang]/utils/constants";
import { hreflang, pageUrl } from "@/app/[lang]/utils/seo";

// Sitemap is generated from Strapi (cms.notadiet.life via fetchAPI). All URLs
// use the canonical www host. Home + dynamic pages carry hreflang alternates
// (their slug is shared across locales); blog/category/article slugs can be
// localized, so those are listed as plain per-locale entries.

const authOptions = () => {
  const token = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;
  return { headers: token ? { Authorization: `Bearer ${token}` } : {} };
};

type SitemapPage = {
  slug?: string;
  updatedAt?: string;
  seo?: { metaRobots?: string | null } | null;
};

type SitemapArticle = SitemapPage & {
  category?: { slug?: string } | null;
};

/** hreflang alternates map for a locale-less path shared across every locale. */
function sharedAlternates(path: string, locales: readonly string[] = i18n.locales) {
  const languages: Record<string, string> = {};
  for (const locale of locales) {
    languages[hreflang(locale)] = pageUrl(locale, path);
  }
  if (locales.includes(i18n.defaultLocale)) {
    languages["x-default"] = pageUrl(i18n.defaultLocale, path);
  }
  return languages;
}

function isNoindex(value?: string | null) {
  return value?.toLowerCase().split(/[\s,]+/).includes("noindex") ?? false;
}

async function safeFetch(path: string, params: Record<string, unknown>) {
  try {
    const res = await fetchAPI(path, params, authOptions());
    return Array.isArray(res?.data) ? res.data : [];
  } catch (err) {
    console.error(`[sitemap] failed to fetch ${path}`, err);
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];

  // Home — one entry per locale, all sharing hreflang alternates.
  for (const locale of i18n.locales) {
    entries.push({
      url: pageUrl(locale, ""),
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
      alternates: { languages: sharedAlternates("") },
    });
  }

  // Dynamic pages (catch-all) — slug is non-localized, so indexable entries can
  // share hreflang. Never put CMS `noindex` pages into sitemap or alternates.
  const pagesBySlug = new Map<string, Partial<Record<string, SitemapPage>>>();
  for (const locale of i18n.locales) {
    const pages = await safeFetch("/pages", {
      locale,
      fields: ["slug", "updatedAt"],
      populate: { seo: { fields: ["metaRobots"] } },
      pagination: { pageSize: 100 },
    });
    for (const page of pages as SitemapPage[]) {
      const slug: string | undefined = page?.slug;
      if (!slug || slug === "home" || isNoindex(page?.seo?.metaRobots)) continue;
      const group = pagesBySlug.get(slug) ?? {};
      group[locale] = page;
      pagesBySlug.set(slug, group);
    }
  }

  for (const [slug, localizedPages] of pagesBySlug) {
    const path = `/${slug}`;
    const locales = i18n.locales.filter((locale) => localizedPages[locale]);
    for (const locale of locales) {
      const page = localizedPages[locale];
      if (!page) continue;
      entries.push({
        url: pageUrl(locale, path),
        lastModified: page?.updatedAt ? new Date(page.updatedAt) : new Date(),
        changeFrequency: "monthly",
        priority: 0.7,
        alternates: { languages: sharedAlternates(path, locales) },
      });
    }
  }

  // Blog index — one per locale.
  for (const locale of i18n.locales) {
    entries.push({
      url: pageUrl(locale, "/blog"),
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
      alternates: { languages: sharedAlternates("/blog") },
    });
  }

  // Categories — /blog/<category>.
  for (const locale of i18n.locales) {
    const categories = await safeFetch("/categories", {
      locale,
      fields: ["slug", "updatedAt"],
      pagination: { pageSize: 100 },
    });
    for (const cat of categories) {
      const slug: string | undefined = cat?.slug;
      if (!slug) continue;
      entries.push({
        url: pageUrl(locale, `/blog/${slug}`),
        lastModified: cat?.updatedAt ? new Date(cat.updatedAt) : new Date(),
        changeFrequency: "weekly",
        priority: 0.6,
      });
    }
  }

  // Articles — /blog/<category>/<slug>.
  for (const locale of i18n.locales) {
    const articles = await safeFetch("/articles", {
      locale,
      fields: ["slug", "updatedAt"],
      populate: { category: { fields: ["slug"] }, seo: { fields: ["metaRobots"] } },
      sort: { updatedAt: "desc" },
      pagination: { pageSize: 100 },
    });
    for (const article of articles as SitemapArticle[]) {
      const slug: string | undefined = article?.slug;
      if (!slug || isNoindex(article?.seo?.metaRobots)) continue;
      const categorySlug: string = article?.category?.slug ?? "uncategorized";
      entries.push({
        url: pageUrl(locale, `/blog/${categorySlug}/${slug}`),
        lastModified: article?.updatedAt ? new Date(article.updatedAt) : new Date(),
        changeFrequency: "monthly",
        priority: 0.6,
      });
    }
  }

  // Drop anything that resolved to a localhost/asset URL (never in sitemap).
  return entries.filter((e) => e.url.startsWith(SITE_URL));
}
