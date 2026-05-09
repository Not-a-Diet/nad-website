import PostList from '../views/blog-list';

interface Article {
  id: number;
  title: string;
  description: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  blocks: any[];
  cover: {
    url: string;
  };
  category: {
    name: string;
    slug: string;
  };
  authorsBio: {
    name: string;
    avatar: {
      url: string;
    };
  };
}

interface FeaturedArticlesProps {
  data: {
    title: string;
    description: string;
    posts: Article[];
  };
}

export default function FeaturedArticles({ data, lang = 'en' }: FeaturedArticlesProps & { lang?: string }) {
  if (!data) return null;

  const { title, description } = data;

  return (
    <section id="featured-posts" className="bg-anti-flash_white px-4 font-sans">
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
          <PostList data={data.posts} lang={lang} />
        </div>

      </div>
    </section>
  );

}
