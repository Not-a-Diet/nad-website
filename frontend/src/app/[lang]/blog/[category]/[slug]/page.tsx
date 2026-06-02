import { fetchAPI } from '@/app/[lang]/utils/fetch-api';
import Post from '@/app/[lang]/views/post';
import type { Metadata } from 'next';
import { i18n } from 'i18n-config';
import { buildAlternates, pageUrl, safeMediaUrl } from '@/app/[lang]/utils/seo';
import JsonLd from '@/app/[lang]/components/JsonLd';
import { resolveBusinessInfo } from '@/app/[lang]/utils/site-config';
import { articleSchema, breadcrumbSchema } from '@/app/[lang]/utils/structured-data';

async function getPostBySlug(slug: string, lang: string) {
    const token = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;
    const path = `/articles`;
    const urlParamsObject = {
        locale: lang,
        filters: { slug },
        populate: {
            cover: { fields: ['url', 'alternativeText'] },
            authorsBio: { populate: '*' },
            category: { fields: ['name'] },
            blocks: { populate: '*' },
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
        fields: ['title', 'description', 'publishedAt', 'updatedAt'],
        populate: {
            seo: { populate: '*' },
            cover: { fields: ['url', 'alternativeText'] },
            authorsBio: { fields: ['name'] },
        },
    };
    const options = { headers: { Authorization: `Bearer ${token}` } };
    const response = await fetchAPI(path, urlParamsObject, options);
    return response.data;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string; category: string; lang: string }> }): Promise<Metadata> {
    const { slug, category, lang } = await params;
    const meta = await getMetaData(slug, lang);
    const article = meta?.[0];
    const seo = article?.seo;
    const path = `/blog/${category}/${slug}`;

    const title = seo?.metaTitle ?? article?.title;
    const description = seo?.metaDescription ?? article?.description;
    const ogImage = safeMediaUrl(seo?.shareImage?.url) ?? safeMediaUrl(article?.cover?.url);
    const authorName: string | undefined = article?.authorsBio?.name;

    return {
        title,
        description,
        ...(seo?.keywords ? { keywords: seo.keywords } : {}),
        ...(seo?.metaRobots ? { robots: seo.metaRobots } : {}),
        alternates: buildAlternates(lang, path, seo?.canonicalURL),
        openGraph: {
            title,
            description,
            url: pageUrl(lang, path),
            type: 'article',
            ...(article?.publishedAt ? { publishedTime: article.publishedAt } : {}),
            ...(article?.updatedAt ? { modifiedTime: article.updatedAt } : {}),
            ...(authorName ? { authors: [authorName] } : {}),
            ...(ogImage ? { images: [ogImage] } : {}),
        },
    };
}

export default async function PostRoute({ params }: { params: Promise<{ slug: string; category: string; lang: string }> }) {
    const { slug, category, lang } = await params;
    const data = await getPostBySlug(slug, lang);
    if (data.data.length === 0) return <h2>no post found</h2>;

    const article = data.data[0];
    const path = `/blog/${category}/${slug}`;
    const business = resolveBusinessInfo();
    const author = article.authorsBio;

    const blogPosting = articleSchema(
        {
            title: article.title,
            description: article.description,
            coverUrl: article.cover?.url,
            publishedAt: article.publishedAt,
            updatedAt: article.updatedAt,
            author: author
                ? { name: author.name, bio: author.bio, url: author.url, sameAs: author.sameAs, avatarUrl: author.avatar?.url }
                : null,
        },
        lang,
        path,
        business,
    );

    const breadcrumb = breadcrumbSchema([
        { name: 'Home', path: '', lang },
        { name: 'Blog', path: '/blog', lang },
        { name: article.category?.name ?? category, path: `/blog/${category}`, lang },
        { name: article.title ?? slug, path, lang },
    ]);

    return (
        <>
            <JsonLd data={blogPosting} />
            <JsonLd data={breadcrumb} />
            <Post data={article} lang={lang} />
        </>
    );
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
                populate: { category: { fields: ['slug', 'name'] } },
            },
            options
        );

        for (const article of articleResponse.data) {
            params.push({
                slug: article.slug,
                category: article.category?.slug ?? 'uncategorized',
                lang: locale,
            });
        }
    }

    return params;
}
