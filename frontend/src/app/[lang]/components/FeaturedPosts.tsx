import PostList from '../views/blog-list';

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

export default function FeaturedArticles({ data }: FeaturedArticlesProps) {
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
          <PostList data={data.posts.data} />
        </div>

      </div>
    </section>
  );

}
