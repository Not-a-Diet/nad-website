import { cache } from "react";
import { fetchAPI } from "./fetch-api";
import type { Dietitian } from "./dietitians";

/** One shared, localized collection: adding a profile also adds it to team and booking. */
export const getDietitians = cache(async (lang: string): Promise<Dietitian[]> => {
  const token = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;
  const all: Dietitian[] = [];
  let page = 1;
  let pageCount = 1;
  do {
    const response = await fetchAPI("/dietitians", {
      locale: lang,
      filters: { listed: true },
      populate: { profilePhoto: true, bookingLocations: true },
      sort: ["name:asc"],
      pagination: { page, pageSize: 100 },
    }, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
    all.push(...(response.data ?? []));
    pageCount = response.meta?.pagination?.pageCount ?? 1;
    page += 1;
  } while (page <= pageCount);
  return all;
});
