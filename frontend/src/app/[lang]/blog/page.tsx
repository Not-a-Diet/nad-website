import type { Metadata } from "next";
import { fetchAPI } from "../utils/fetch-api";
import Blog from "../views/blog-list";
import PageHeader from "../components/PageHeader";
import BlogLoadMore from "../components/BlogLoadMore";
import { buildAlternates, pageUrl } from "../utils/seo";

const PAGE_LIMIT = parseInt(process.env.NEXT_PUBLIC_PAGE_LIMIT ?? "6", 10);

async function getBlogHeaders(lang: string) {
  const token = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;
  try {
    const res = await fetchAPI(
      "/blog-headers",
      { locale: lang },
      { headers: { Authorization: `Bearer ${token}` } },
    );
    return res?.data?.[0];
  } catch {
    return undefined;
  }
}

async function getInitialArticles(lang: string) {
  const token = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;
  return fetchAPI(
    "/articles",
    {
      locale: lang,
      sort: { createdAt: "desc" },
      populate: {
        cover: { fields: ["url"] },
        category: { populate: "*" },
        authorsBio: { populate: "*" },
      },
      pagination: { start: 0, limit: PAGE_LIMIT },
    },
    { headers: { Authorization: `Bearer ${token}` } },
  );
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const headers = await getBlogHeaders(lang);
  const title = headers?.heading ? `${headers.heading}` : "Blog";
  const description = headers?.text;
  return {
    title,
    ...(description ? { description } : {}),
    alternates: buildAlternates(lang, "/blog"),
    openGraph: { title, ...(description ? { description } : {}), url: pageUrl(lang, "/blog"), type: "website" },
  };
}

export default async function BlogIndex({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;

  const [articlesResponse, blogHeaders] = await Promise.all([
    getInitialArticles(lang),
    getBlogHeaders(lang),
  ]);

  const articles = articlesResponse?.data ?? [];
  const meta = articlesResponse?.meta ?? {
    pagination: { start: 0, limit: PAGE_LIMIT, total: articles.length },
  };

  return (
    <div>
      <PageHeader heading={blogHeaders?.heading ?? ""} text={blogHeaders?.text ?? ""} />
      <Blog data={articles} lang={lang} />
      <BlogLoadMore lang={lang} initialMeta={meta} />
    </div>
  );
}
