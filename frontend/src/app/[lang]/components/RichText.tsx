import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface RichTextProps {
  data: {
    body: string;
  };
}

export default function RichText({ data }: RichTextProps) {
  // TODO: STYLE THE MARKDOWN
  return (
    <section className="rich-text py-6 bg-anti-flash_White text-night">
      <Markdown children={data.body} remarkPlugins={[remarkGfm]} />
    </section>
  );
}
