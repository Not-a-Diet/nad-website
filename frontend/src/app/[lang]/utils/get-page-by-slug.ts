import {fetchAPI} from "@/app/[lang]/utils/fetch-api";

import { getDietitians } from "./get-dietitians";
import type { Section } from "../types/strapi";

function needsDietitians(section: Section) {
    return (section.__component === "sections.team" && section.layout === "classic") ||
        (section.__component === "sections.contact" && Boolean(section.bookingCalendar));
}

export async function getPageBySlug(slug: string, lang: string) {
    const token = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;

    const path = `/pages`;
    const urlParamsObject = {
        filters: {slug}, 
        locale: lang,
    };
    const options = {headers: {Authorization: `Bearer ${token}`}};
    const response = await fetchAPI(path, urlParamsObject, options);
    const needsProfiles = response.data?.some((page: { contentSections?: Section[] }) =>
        page.contentSections?.some(needsDietitians));
    if (!needsProfiles) return response;
    try {
        const dietitians = await getDietitians(lang);
        for (const page of response.data) {
            for (const section of page.contentSections ?? []) {
                if (needsDietitians(section)) {
                    section.dietitians = dietitians;
                }
            }
        }
    } catch (error) {
        // Preserve the existing section while the CMS migration is being rolled out.
        console.error("[dietitians] profiles unavailable", error);
    }
    return response;
}