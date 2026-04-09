import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";

interface RichTextProps {
  data: {
    body: string;
  };
}

export default function RichText({ data }: RichTextProps) {
  return (
    <section className="rich-text mt-24 p-6">
      <Markdown
        children={data.body}
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSanitize]}
      />
    </section>
  );
}
