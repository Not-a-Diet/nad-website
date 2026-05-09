import PageHeader from '@/app/[lang]/components/PageHeader';
import { fetchAPI } from '@/app/[lang]/utils/fetch-api';
import BlogList from '@/app/[lang]/views/blog-list';

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

    return (
        <div>
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
