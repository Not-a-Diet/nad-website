"use client";
import { use, useState, useEffect } from "react";
import { fetchAPI } from "../utils/fetch-api";

import Loader from "../components/Loader";
import Blog from "../views/blog-list";
import PageHeader from "../components/PageHeader";

interface Meta {
  pagination: {
    start: number;
    limit: number;
    total: number;
  };
}

interface BlogHeaders {
  heading: string;
  text: string;
}

export default function Profile({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = use(params);
  const [meta, setMeta] = useState<Meta | undefined>();
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [blogHeaders, setBlogHeaders] = useState<BlogHeaders>();
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadInitialData() {
      setLoading(true);
      setLoadError(null);
      try {
        const token = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;
        const options = { headers: { Authorization: `Bearer ${token}` } };

        const [articlesResponse, headersResponse] = await Promise.all([
          fetchAPI("/articles", {
            locale: lang,
            sort: { createdAt: "desc" },
            populate: {
              cover: { fields: ["url"] },
              category: { populate: "*" },
              authorsBio: { populate: "*" },
            },
            pagination: { start: 0, limit: parseInt(process.env.NEXT_PUBLIC_PAGE_LIMIT ?? '6', 10) },
          }, options),
          fetchAPI("/blog-headers", { locale: lang }, options),
        ]);

        if (cancelled) return;

        setData(articlesResponse.data);
        setMeta(articlesResponse.meta);
        setBlogHeaders(headersResponse.data[0]);
      } catch (error) {
        if (cancelled) return;
        console.error("[blog] failed to load initial posts", error);
        setLoadError("We couldn't load the blog right now. Please try again in a moment.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadInitialData();
    return () => { cancelled = true; };
  }, [lang]);

  async function loadMorePosts(): Promise<void> {
    if (!meta) return;
    const start = meta.pagination.start + meta.pagination.limit;
    const limit = parseInt(process.env.NEXT_PUBLIC_PAGE_LIMIT ?? '6', 10);
    try {
      const token = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;
      const path = `/articles`;
      const urlParamsObject = {
        locale: lang,
        sort: { createdAt: "desc" },
        populate: {
          cover: { fields: ["url"] },
          category: { populate: "*" },
          authorsBio: { populate: "*" },
        },
        pagination: { start, limit },
      };
      const options = { headers: { Authorization: `Bearer ${token}` } };
      const responseData = await fetchAPI(path, urlParamsObject, options);

      setData((prevData) => [...prevData, ...responseData.data]);
      setMeta(responseData.meta);
    } catch (error) {
      console.error("[blog] failed to load more posts", error);
      setLoadError("We couldn't load more posts. Please try again.");
    }
  }

  if (isLoading) return <Loader />;
  if (loadError && !meta) {
    return (
      <div className="container mx-auto p-8 text-center">
        <p className="text-night">{loadError}</p>
      </div>
    );
  }
  if (!meta) return <Loader />;

  return (
    <div>
      <PageHeader heading={blogHeaders ? blogHeaders.heading : ""} text={blogHeaders ? blogHeaders.text : ""} />
      <Blog data={data} lang={lang}>
        {meta.pagination.start + meta.pagination.limit <
          meta.pagination.total && (
          <div className="flex justify-center">
            <button
              type="button"
              className="px-6 py-3 text-sm rounded-lg hover:underline text-ebony"
              onClick={loadMorePosts}
            >
              Load more posts...
            </button>
          </div>
        )}
      </Blog>
    </div>
  );
}