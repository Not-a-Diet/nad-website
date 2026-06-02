import {Metadata} from "next";
import {notFound} from "next/navigation";
import {i18n} from "i18n-config";
import {fetchAPI} from "@/app/[lang]/utils/fetch-api";
import {getPageBySlug} from "@/app/[lang]/utils/get-page-by-slug";
import {FALLBACK_SEO} from "@/app/[lang]/utils/constants";
import {buildAlternates, pageUrl, safeMediaUrl} from "@/app/[lang]/utils/seo";
import JsonLd from "@/app/[lang]/components/JsonLd";
import {breadcrumbSchema} from "@/app/[lang]/utils/structured-data";
import componentResolver from "../utils/component-resolver";
import type { Section } from "../types/strapi";


type Props = {
    params: Promise<{
        lang: string,
        slug: string[]
    }>
}


export async function generateMetadata({params}: Props): Promise<Metadata> {
    const { lang, slug } = await params;
    const path = `/${slug.join('/')}`;
    const page = await getPageBySlug(slug.join('/'), lang);

    if (!Array.isArray(page.data) || page.data.length === 0 || !page.data[0]?.seo) {
        return { ...FALLBACK_SEO, alternates: buildAlternates(lang, path) };
    }
    const metadata = page.data[0].seo;
    const ogImage = safeMediaUrl(metadata.shareImage?.url);

    return {
        title: metadata.metaTitle,
        description: metadata.metaDescription,
        ...(metadata.keywords ? { keywords: metadata.keywords } : {}),
        ...(metadata.metaRobots ? { robots: metadata.metaRobots } : {}),
        alternates: buildAlternates(lang, path, metadata.canonicalURL),
        openGraph: {
            title: metadata.metaTitle,
            description: metadata.metaDescription,
            url: pageUrl(lang, path),
            type: "website",
            ...(ogImage ? { images: [ogImage] } : {}),
        },
    };
}


export default async function PageRoute({params}: Props) {
    const { lang, slug } = await params;
    const page = await getPageBySlug(slug.join('/'), lang);
    if (!page.data || page.data.length === 0) return notFound();
    const entry = page.data[0];
    const contentSections = entry.contentSections;
    if (!Array.isArray(contentSections)) return notFound();

    const pageName = entry.heading || entry.shortName || entry.seo?.metaTitle || slug[slug.length - 1];
    const breadcrumb = breadcrumbSchema([
        { name: 'Home', path: '', lang },
        { name: pageName, path: `/${slug.join('/')}`, lang },
    ]);

    return (
        <>
            <JsonLd data={breadcrumb} />
            {contentSections.map((section: Section, index: number) => componentResolver(section, index, lang))}
        </>
    );
}

export async function generateStaticParams() {
    try {
        const token = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;
        const options = { headers: { Authorization: `Bearer ${token}` } };
        const params: { lang: string; slug: string[] }[] = [];

        for (const locale of i18n.locales) {
            const res = await fetchAPI(
                "/pages",
                { locale, fields: ["slug"], pagination: { pageSize: 100 } },
                options,
            );
            for (const page of res?.data ?? []) {
                const slug: string | undefined = page?.slug;
                if (!slug || slug === "home") continue;
                params.push({ lang: locale, slug: slug.split("/").filter(Boolean) });
            }
        }
        return params;
    } catch {
        return [];
    }
}
