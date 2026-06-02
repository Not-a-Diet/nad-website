import type { Metadata } from 'next';
import PageHeader from '@/app/[lang]/components/PageHeader';
import { fetchAPI } from '@/app/[lang]/utils/fetch-api';
import BlogList from '@/app/[lang]/views/blog-list';
import { buildAlternates, pageUrl } from '@/app/[lang]/utils/seo';
import JsonLd from '@/app/[lang]/components/JsonLd';
import { breadcrumbSchema } from '@/app/[lang]/utils/structured-data';

export async function generateMetadata({ params }: { params: Promise<{ category: string; lang: string }> }): Promise<Metadata> {
    const { category, lang } = await params;
    const path = `/blog/${category}`;
    let name = category;
    let description: string | undefined;
    try {
        const token = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;
        const res = await fetchAPI(
            '/categories',
            { locale: lang, filters: { slug: category }, fields: ['name', 'description'] },
            { headers: { Authorization: `Bearer ${token}` } },
        );
        const cat = res?.data?.[0];
        if (cat?.name) name = cat.name;
        if (cat?.description) description = cat.description;
    } catch {
        // fall back to slug-derived title
    }
    const title = `${name} — Blog`;
    return {
        title,
        ...(description ? { description } : {}),
        alternates: buildAlternates(lang, path),
        openGraph: { title, ...(description ? { description } : {}), url: pageUrl(lang, path), type: 'website' },
    };
}

async function fetchPostsByCategory(filter: string, lang: string) {
    const token = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;
    const path = `/articles`;
    const urlParamsObject = {
        locale: lang,
        sort: { createdAt: 'desc' },
        filters: {
            category: {
                slug: filter,
            },
        },
        populate: {
            cover: { fields: ['url'] },
            category: {
                populate: '*',
            },
            authorsBio: {
                populate: '*',
            },
        },
    };
    const options = { headers: { Authorization: `Bearer ${token}` } };
    return await fetchAPI(path, urlParamsObject, options);
}

export default async function CategoryRoute({ params }: { params: Promise<{ category: string; lang: string }> }) {
    const { category, lang } = await params;
    const responseData = await fetchPostsByCategory(category, lang);
    const data = responseData?.data ?? [];

    if (data.length === 0) return <div>No posts in this category.</div>;

    const categoryData = data[0]?.category;
    if (!categoryData) return <div>No posts in this category.</div>;
    const { name, description } = categoryData;

    const breadcrumb = breadcrumbSchema([
        { name: 'Home', path: '', lang },
        { name: 'Blog', path: '/blog', lang },
        { name, path: `/blog/${category}`, lang },
    ]);

    return (
        <div>
            <JsonLd data={breadcrumb} />
            <PageHeader heading={name} text={description} />
            <BlogList data={data} lang={lang} />
        </div>
    );
}

export async function generateStaticParams() {
    try {
        const token = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;
        const categoriesResponse = await fetchAPI('/categories', {
            populate: '*',
        }, { headers: { Authorization: `Bearer ${token}` } });

        const categories = categoriesResponse?.data ?? [];
        const { i18n } = await import('i18n-config');

        return i18n.locales.flatMap((locale: string) =>
            categories.map((category: { slug: string }) => ({
                category: category.slug,
                lang: locale,
            }))
        );
    } catch {
        return [];
    }
}
