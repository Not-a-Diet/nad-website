import Image from 'next/image';
import Link from 'next/link';
import PostList from '../views/blog-list';
import { getStrapiMedia } from '../utils/api-helpers';

// --- Interfaces for Data Structure ---

// Helper for Strapi Image structure
interface StrapiImage {
  data: {
    attributes: {
      url: string;
      alternativeText?: string;
    };
  };
}

interface ArticleAttributes {
  title: string;
  description: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  blocks: any[];
  cover: {
    data: {
      attributes: {
        url: string;
      };
    };
  };
  category: {
    data: {
      attributes: {
        name: string;
        slug: string;
      };
    };
  };
  authorsBio: {
    data: {
      attributes: {
        name: string;
        avatar: {
          data: {
            attributes: {
              url: string;
            };
          };
        };
      };
    };
  };
};

interface ArticleEntity {
  id: number;
  attributes: ArticleAttributes;
}

// Main Component Interface matching the provided API structure
interface FeaturedArticlesProps {
  data: {
    title: string;
    description: string;
    posts: {
      data: ArticleEntity[];
    };
  };
}

// --- Helper Functions ---

const getCategoryStyles = (category: string) => {
  switch (category) {
    case 'Educazione':
      return 'bg-secondary-100 text-secondary-DEFAULT'; // Green
    case 'Pratica':
      return 'bg-primary-100 text-primary-DEFAULT'; // Orange
    case 'Mindset':
      return 'bg-tertiary-100 text-tertiary-DEFAULT'; // Yellow
    default:
      return 'bg-crema-200 text-crema-800'; // Fallback
  }
};

// --- Sub-Component: Article Card ---

const ArticleCard = ({ article }: { article: ArticleAttributes }) => {
  const imageUrl = article.cover.data?.attributes?.url || '/placeholder.jpg';

  const categoryStyle = 'bg-crema-200 text-crema-800';

  return (
    <div className="flex flex-col h-full bg-anti-flash_white-DEFAULT rounded-2xl overflow-hidden group">
      {/* Image Container */}
      <div className="relative h-64 w-full mb-5 rounded-2xl overflow-hidden">
        <Image
          src={getStrapiMedia(imageUrl) ?? ""}
          alt={article.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      {/* Content */}
      <div className="flex flex-col flex-grow pr-4">
        {/* Meta Row: Category & Time */}
        <div className="flex items-center justify-between mb-3">
          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${categoryStyle}`}>
            {"TEST"}
          </span>
          <div className="flex items-center gap-1 text-crema-500 text-sm">
            {/* Clock Icon SVG */}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{article.description.split(" ").length / 200}</span>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-crema-DEFAULT mb-2 font-sans">
          {article.title}
        </h3>

        {/* Description */}
        <p className="text-crema-500 text-base mb-6 line-clamp-3 font-sans">
          {article.description}
        </p>

        {/* Read More Link */}
        <div className="mt-auto">
          <Link
            href={`/blog/${article.slug}`}
            className="inline-flex items-center text-secondary-DEFAULT font-semibold hover:text-secondary-500 transition-colors"
          >
            <span className="mr-2 text-xs">○</span>
            Leggi di più
          </Link>
        </div>
      </div>
    </div>
  );
};

// --- Main Component ---

export default function FeaturedArticles({ data }: FeaturedArticlesProps) {
  // Guard clause in case data is missing
  console.log(data);
  if (!data) return null;

  const { title, description, posts } = data;

  return (
    <section className="bg-anti-flash_white-DEFAULT py-20 px-4 font-sans">
      <div className="max-w-7xl mx-auto">

        {/* Section Header */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-crema-DEFAULT mb-6 leading-tight">
            {title}
          </h2>
          <p className="text-lg text-crema-500">
            {description}
          </p>
        </div>

        {/* Posts Grid */}
        <div className='flex flex-col'>
          <PostList data={data.posts.data} />
        </div>

      </div>
    </section>
  );

}
