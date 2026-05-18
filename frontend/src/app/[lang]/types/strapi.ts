/**
 * Shared Strapi v5 response shapes for the NAD website.
 *
 * Strapi v5 returns flat entries — fields live directly on the entry object
 * alongside `documentId` and `id`. No `.attributes` nesting (that was v4).
 */

export interface StrapiMedia {
  url: string;
  alternativeText?: string;
  width?: number;
  height?: number;
}

export interface Avatar {
  url: string;
}

export interface AuthorsBio {
  name: string;
  avatar?: Avatar;
}

export interface CategorySummary {
  id: number;
  documentId?: string;
  name: string;
  slug: string;
}

export interface Category extends CategorySummary {
  articles: Article[];
}

/**
 * A dynamic-zone section. `__component` is the Strapi component UID
 * (e.g. "sections.hero"). All other fields vary per component type, so we
 * keep them loosely typed and let each section component cast on receipt.
 */
export interface Section {
  __component: string;
  id: number;
  [key: string]: unknown;
}

/** Block-level content used inside an article body (dynamic zone). */
export type Block = Section;

export interface Article {
  id: number;
  documentId?: string;
  title: string;
  description: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  blocks?: Block[];
  cover?: StrapiMedia;
  category?: CategorySummary;
  authorsBio?: AuthorsBio;
}

/** Stripped-down article shape used by the blog sidebar. */
export type ArticleSummary = Pick<Article, "id" | "title" | "slug">;

/** Sidebar data fetched by the blog category/slug layout. */
export interface SideMenuData {
  articles: ArticleSummary[];
  categories: Category[];
}

/** Generic Strapi v5 paginated response meta. */
export interface PaginationMeta {
  pagination: {
    start: number;
    limit: number;
    total: number;
  };
}
