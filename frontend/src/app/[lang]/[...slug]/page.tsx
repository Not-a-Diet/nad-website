import {Metadata} from "next";
import {notFound} from "next/navigation";
import {getPageBySlug} from "@/app/[lang]/utils/get-page-by-slug";
import {FALLBACK_SEO} from "@/app/[lang]/utils/constants";
import componentResolver from "../utils/component-resolver";


type Props = {
    params: Promise<{
        lang: string,
        slug: string[]
    }>
}


export async function generateMetadata({params}: Props): Promise<Metadata> {
    const { lang, slug } = await params;
    const page = await getPageBySlug(slug.join('/'), lang);

    if (!Array.isArray(page.data) || page.data.length === 0 || !page.data[0]?.seo) return FALLBACK_SEO;
    const metadata = page.data[0].seo

    return {
        title: metadata.metaTitle,
        description: metadata.metaDescription
    }
}


export default async function PageRoute({params}: Props) {
    const { lang, slug } = await params;
    const page = await getPageBySlug(slug.join('/'), lang);
    if (!page.data || page.data.length === 0) return notFound();
    const contentSections = page.data[0].contentSections;
    return contentSections.map((section: any, index: number) => componentResolver(section, index, lang));
}
