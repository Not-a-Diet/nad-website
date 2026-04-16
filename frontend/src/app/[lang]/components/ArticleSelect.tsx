import Link from "next/link";

interface Category {
  id: number;
  attributes: {
    name: string;
    slug: string;
    articles: {
      data: Array<{}>;
    };
  };
}

interface Article {
  id: number;
  attributes: {
    title: string;
    slug: string;
  };
}

function selectedFilter(current: string, selected: string) {
  return current === selected
    ? "px-3 py-1 rounded-lg bg-secondary text-white"
    : "px-3 py-1 rounded-lg hover:underline bg-secondary-100 text-black";
}

export default function ArticleSelect({
  categories,
  articles,
  params,
}: {
  categories: Category[];
  articles: Article[];
  params: {
    slug: string;
    category: string;
  };
}) {

  return (
    <div className="p-4 flex flex-col items-center text-center rounded-lg bg-anti-flash_white min-h-[365px]">
      <h4 className="text-xl font-semibold">Browse By Category</h4>

      <div>
        <div className="text-secondary flex flex-wrap items-center justify-center py-6 space-x-2 border-black">
          {categories.map((category: Category) => {
            if (category.attributes.articles.data.length === 0) return null;
            return (
              <Link
                key={category.id}
                href={`/blog/${category.attributes.slug}`}
                className={selectedFilter(
                  category.attributes.slug,
                  params.category
                )}
              >
                #{category.attributes.name}
              </Link>
            );
          })}
          <Link href="/blog" key="all" className={selectedFilter("", "filter")}>
            #all
          </Link>
        </div>

        <div className="space-y-2">
          <h4 className="text-lg font-semibold">Other Posts You May Like</h4>
          <ul className="ml-4 space-y-1 list-disc">
            {articles.map((article: Article) => {
              return (
                <li key={article.id}>
                  <Link
                    href={`/blog/${params.category}/${article.attributes.slug}`}
                    className={`${
                      params.slug === article.attributes.slug &&
                      "text-secondary"
                    }  hover:underline transition-colors duration-200`}
                  >
                    {article.attributes.title}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}