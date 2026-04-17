import { fetchAPI } from '@/app/[lang]/utils/fetch-api';
import Post from '@/app/[lang]/views/post';
import type { Metadata } from 'next';
import { i18n } from 'i18n-config';

async function getPostBySlug(slug: string, lang: string) {
    const token = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;
    const path = `/articles`;
    const urlParamsObject = {
        locale: lang,
        filters: { slug },
        populate: {
            cover: { fields: ['url'] },
            authorsBio: { populate: '*' },
            category: { fields: ['name'] },
            blocks: { 
                populate: {
                    '__component': '*', 
                    'files': '*',
                    'file': '*',
                    'url': '*',
                    'body': '*',
                    'title': '*',
                    'author': '*',
                }
            },
        },
    };
    const options = { headers: { Authorization: `Bearer ${token}` } };
    const response = await fetchAPI(path, urlParamsObject, options);
    return response;
}

async function getMetaData(slug: string, lang: string) {
    const token = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;
    const path = `/articles`;
    const urlParamsObject = {
        locale: lang,
        filters: { slug },
        populate: { seo: { populate: '*' } },
    };
    const options = { headers: { Authorization: `Bearer ${token}` } };
    const response = await fetchAPI(path, urlParamsObject, options);
    return response.data;
}

export async function generateMetadata({ params }: { params: { slug: string; lang: string } }): Promise<Metadata> {
    const meta = await getMetaData(params.slug, params.lang);
    const metadata = meta[0]?.attributes.seo;

    return {
        title: metadata?.metaTitle,
        description: metadata?.metaDescription,
    };
}

export default async function PostRoute({ params }: { params: { slug: string, lang: string } }) {
    const { slug, lang } = params;
    const data = await getPostBySlug(slug, lang);
    if (data.data.length === 0) return <h2>no post found</h2>;
    return <Post data={data.data[0]} lang={lang} />;
}

export async function generateStaticParams() {
    const token = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;
    const path = `/articles`;
    const options = { headers: { Authorization: `Bearer ${token}` } };

    const params = [];
    for (const locale of i18n.locales) {
        const articleResponse = await fetchAPI(
            path,
            {
                locale,
                populate: ['category'],
            },
            options
        );

        for (const article of articleResponse.data) {
            params.push({
                slug: article.attributes.slug,
                category: article.attributes.category?.data?.attributes?.slug ?? article.attributes.slug,
                lang: locale,
            });
        }
    }

    return params;
}
