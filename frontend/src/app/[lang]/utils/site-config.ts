import { SITE_URL } from "./constants";

/**
 * Sitewide business facts for JSON-LD. Hardcoded defaults are the fallback;
 * CMS `Global.businessInfo` (Phase 0.5) overrides any field it provides.
 * Edit the defaults here only until the marketing team fills the CMS fields.
 */
export interface BusinessInfo {
  name: string;
  legalName: string;
  businessType: string;
  url: string;
  logo: string;
  email?: string;
  telephone?: string;
  priceRange?: string;
  streetAddress?: string;
  addressLocality?: string;
  addressRegion?: string;
  postalCode?: string;
  addressCountry?: string;
  latitude?: number;
  longitude?: number;
  /** schema.org OpeningHoursSpecification objects, or plain "Mo-Fr 09:00-18:00" strings. */
  openingHours?: unknown[];
  sameAs?: string[];
}

const DEFAULT_BUSINESS: BusinessInfo = {
  name: "Not a Diet",
  legalName: "Not a Diet",
  businessType: "Nutritionist",
  url: SITE_URL,
  logo: `${SITE_URL}/og-default.png`,
  email: "info@notadiet.life",
  addressLocality: "Porcia",
  addressRegion: "PN",
  addressCountry: "IT",
  priceRange: "€€",
  sameAs: [],
};

function nonEmpty(v: unknown): boolean {
  if (v == null) return false;
  if (typeof v === "string") return v.trim() !== "";
  if (Array.isArray(v)) return v.length > 0;
  return true;
}

/** CMS `businessInfo` component shape (all optional / may be absent). */
type CmsBusinessInfo = Partial<{
  legalName: string;
  businessType: string;
  telephone: string;
  email: string;
  priceRange: string;
  streetAddress: string;
  addressLocality: string;
  addressRegion: string;
  postalCode: string;
  addressCountry: string;
  latitude: number | string;
  longitude: number | string;
  openingHours: unknown[];
  sameAs: string[];
}>;

/** Merge CMS business facts over the hardcoded defaults (CMS wins per field). */
export function resolveBusinessInfo(cms?: CmsBusinessInfo | null): BusinessInfo {
  const out: BusinessInfo = { ...DEFAULT_BUSINESS };
  if (!cms) return out;

  const keys: (keyof CmsBusinessInfo)[] = [
    "legalName", "businessType", "telephone", "email", "priceRange",
    "streetAddress", "addressLocality", "addressRegion", "postalCode",
    "addressCountry", "openingHours", "sameAs",
  ];
  const target = out as unknown as Record<string, unknown>;
  for (const k of keys) {
    if (nonEmpty(cms[k])) target[k] = cms[k];
  }
  if (nonEmpty(cms.latitude)) out.latitude = Number(cms.latitude);
  if (nonEmpty(cms.longitude)) out.longitude = Number(cms.longitude);
  // `name` mirrors legalName when CMS supplies one but no separate display name.
  if (nonEmpty(cms.legalName)) out.name = cms.legalName as string;
  return out;
}
