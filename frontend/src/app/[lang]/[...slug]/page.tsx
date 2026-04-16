import {Metadata} from "next";
import {notFound} from "next/navigation";
import {getPageBySlug} from "@/app/[lang]/utils/get-page-by-slug";
import {FALLBACK_SEO} from "@/app/[lang]/utils/constants";
import componentResolver from "../utils/component-resolver";


type Props = {
    params: {
        lang: string,
        slug: string
    }
}


export async function generateMetadata({params}: Props): Promise<Metadata> {
    const page = await getPageBySlug(params.slug, params.lang);

    if (!Array.isArray(page.data) || page.data.length === 0 || !page.data[0]?.attributes?.seo) return FALLBACK_SEO;
    const metadata = page.data[0].attributes.seo

    return {
        title: metadata.metaTitle,
        description: metadata.metaDescription
    }
}


export default async function PageRoute({params}: Props) {
    const page = await getPageBySlug(params.slug, params.lang);
    if (!page.data || page.data.length === 0) return notFound();
    const contentSections = page.data[0].attributes.contentSections;
    return contentSections.map((section: any, index: number) => componentResolver(section, index));
}
