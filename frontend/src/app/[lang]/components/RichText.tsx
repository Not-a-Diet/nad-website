import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface RichTextProps {
  data: {
    content: string;
  };
}

export default function RichText({ data }: RichTextProps) {
  console.log("rich-text-data:", data);

  return (
    <section className="rich-text mt-24 p-6">
      <Markdown children={data.content} remarkPlugins={[remarkGfm]} />
    </section>
  );
}
