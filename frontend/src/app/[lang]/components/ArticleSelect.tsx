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
    ? "px-3 py-1 rounded-lg hover:underline bg-ebony text-anti-flash_white"
    : "px-3 py-1 rounded-lg hover:underline bg-ebony text-anti-flash_white";
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
    <div className="p-4 rounded-lg bg-anti-fllash_white-100 min-h-[365px] relative drop-shadow-lg ">
      <h4 className="text-xl font-semibold">Browse By Category</h4>

      <div>
        <div className="flex flex-wrap py-6 space-x-2 light:border-night">
          {categories.map((category: Category) => {
            if (category.attributes.articles.data.length === 0) return null;
            return (
              <Link
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
          <Link href={"/blog"} className={selectedFilter("", "filter")}>
            #all
          </Link>
        </div>

        <div className="space-y-2">
          <h4 className="text-lg font-semibold">Other Posts You May Like</h4>
          <ul className="ml-4 space-y-1 list-disc">
            {articles.map((article: Article) => {
              return (
                <li>
                  <Link
                    rel="noopener noreferrer"
                    href={`/blog/${params.category}/${article.attributes.slug}`}
                    className={`${
                      params.slug === article.attributes.slug &&
                      "text-kelly_green"
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
