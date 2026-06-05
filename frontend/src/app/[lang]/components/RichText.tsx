import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";

interface RichTextProps {
  // Two component variants resolve to this same component:
  //   shared.rich-text   (Articles)  → field `body`
  //   sections.rich-text (Pages)     → field `content`
  data: {
    body?: string;
    content?: string;
  };
}

export default function RichText({ data }: RichTextProps) {
  const markdown = data.content ?? data.body ?? "";

  return (
    <section className="rich-text px-6 py-20 lg:py-24">
      <Markdown
        children={markdown}
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSanitize]}
      />
    </section>
  );
}
