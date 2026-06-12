import { formatDate, getStrapiMedia } from '@/app/[lang]/utils/api-helpers';
import Image from 'next/image';
import componentResolver from '../utils/component-resolver';
import type { Article, Section } from '../types/strapi';

export default function Post({ data, lang = 'en' }: { data: Article; lang?: string }) {
  const { title, description, publishedAt, cover, authorsBio } = data;
  const author = authorsBio;
  const imageUrl = getStrapiMedia(cover?.url);
  const authorImgUrl = getStrapiMedia(authorsBio?.avatar?.url ?? '');
  return (
    <article className="space-y-8 bg-anti-flash_white text-night">
      {imageUrl && (
        <Image
          src={imageUrl}
          alt={cover?.alternativeText || title || "article cover image"}
          width={400}
          height={400}
          className="w-full h-96 object-cover rounded-lg"
        />
      )}
      <div className="space-y-6">
        <h1 className="leading-tight text-5xl font-sans font-bold">{title}</h1>
        <div className="flex flex-col items-start justify-between w-full md:flex-row md:items-center text-anti-flash_white">
          <div className="flex items-center md:space-x-2">
            {authorImgUrl && (
              <Image
                src={authorImgUrl}
                alt={author ? `${author.name}` : "author"}
                width={400}
                height={400}
                sizes="56px"
                className="w-14 h-14 border rounded-full dark:bg-gray-500 dark:border-gray-700"
              />
            )}
            <p className="text-md text-secondary-700">
              {author && author.name} • {formatDate(publishedAt)}
            </p>
          </div>
        </div>
      </div>
      <div className="text-black bg-anti-flash_white">
        <p>{description}</p>
        {(data.blocks || []).map((section: Section, index: number) => componentResolver(section, index, lang))}
      </div>
    </article>
  );
}