import type { StrapiMedia } from "../types/strapi";

export interface BookingLocation {
  name: string;
  embedUrl: string;
  isDefault?: boolean;
}

export interface Dietitian {
  documentId: string;
  slug: string;
  name: string;
  role: string;
  shortBio?: string;
  bio?: string;
  profilePhoto?: StrapiMedia | null;
  specializations?: unknown;
  bookingEnabled?: boolean;
  bookingLocations?: BookingLocation[];
  listed?: boolean;
  sameAs?: string[];
}

export function specializationLabels(value: unknown): string[] {
  if (typeof value === "string") return value.split(/[\n;,•]+/).map(s => s.trim()).filter(Boolean);
  if (!Array.isArray(value)) return [];
  return value.flatMap(item => {
    const label = typeof item === "string" ? item : item?.title ?? item?.name ?? item?.label;
    return typeof label === "string" && label.trim() ? [label.trim()] : [];
  });
}
