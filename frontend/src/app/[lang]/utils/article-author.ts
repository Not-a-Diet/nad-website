import type { Article, ArticleAuthor } from "../types/strapi";

/** Shared byline and structured author data from the canonical Dietitian. */
export function articleAuthor(article: Pick<Article, "dietitian">, lang: string): ArticleAuthor | undefined {
  const person = article.dietitian;
  if (!person) return undefined;
  return {
    name: person.name,
    avatar: person.profilePhoto ?? undefined,
    bio: person.shortBio ?? person.bio,
    url: `/${lang}/team/${person.slug}`,
    sameAs: person.sameAs,
  };
}
