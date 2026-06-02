export const FALLBACK_SEO = {
    title: "Not a diet - Website",
    description: "Discover Not a diet, a revolutionary approach to health and wellness that emphasizes balance, mindfulness, and sustainable habits over restrictive dieting.",
}

/**
 * Canonical site origin (www is canonical — see CLAUDE.md / SEO plan).
 * Used for canonical URLs, hreflang, sitemap, OG urls and JSON-LD `url`s.
 * Never the apex, never the media/CMS host (those are only for asset URLs).
 */
export const SITE_URL = (
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.notadiet.life"
).replace(/\/$/, "");