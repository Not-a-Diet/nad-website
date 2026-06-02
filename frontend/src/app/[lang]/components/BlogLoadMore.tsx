"use client";

import { useState } from "react";
import { fetchAPI } from "../utils/fetch-api";
import BlogList from "../views/blog-list";
import type { Article } from "../types/strapi";

interface Meta {
  pagination: { start: number; limit: number; total: number };
}

/**
 * Client island for the blog index. The first page of articles is server-
 * rendered (crawlable <a> links) by the page; this only appends subsequent
 * pages on demand, so crawlers still see real links without any JS.
 */
export default function BlogLoadMore({
  lang,
  initialMeta,
}: {
  readonly lang: string;
  readonly initialMeta: Meta;
}) {
  const [extra, setExtra] = useState<Article[]>([]);
  const [meta, setMeta] = useState<Meta>(initialMeta);
  const [error, setError] = useState<string | null>(null);

  const limit = parseInt(process.env.NEXT_PUBLIC_PAGE_LIMIT ?? "6", 10);
  const hasMore = meta.pagination.start + meta.pagination.limit < meta.pagination.total;

  async function loadMore() {
    const start = meta.pagination.start + meta.pagination.limit;
    setError(null);
    try {
      const token = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;
      const res = await fetchAPI(
        "/articles",
        {
          locale: lang,
          sort: { createdAt: "desc" },
          populate: {
            cover: { fields: ["url"] },
            category: { populate: "*" },
            authorsBio: { populate: "*" },
          },
          pagination: { start, limit },
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setExtra((prev) => [...prev, ...res.data]);
      setMeta(res.meta);
    } catch (err) {
      console.error("[blog] failed to load more posts", err);
      setError("We couldn't load more posts. Please try again.");
    }
  }

  return (
    <>
      {extra.length > 0 && <BlogList data={extra} lang={lang} />}
      {error && <p className="p-4 text-center text-night">{error}</p>}
      {hasMore && (
        <div className="flex justify-center">
          <button
            type="button"
            className="px-6 py-3 text-sm rounded-lg hover:underline text-ebony"
            onClick={loadMore}
          >
            Load more posts...
          </button>
        </div>
      )}
    </>
  );
}
