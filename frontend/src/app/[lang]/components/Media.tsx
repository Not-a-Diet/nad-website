import { getStrapiMedia } from "../utils/api-helpers";
import Image from "next/image";

interface MediaProps {
  file: {
    id: number;
    url: string;
    name: string;
    alternativeText: string | null;
    documentId?: string | number;
  } | null;
}

interface MediaComponentProps {
  data: MediaProps;
}

export default function Media({ data }: MediaComponentProps) {
  const imgUrl = getStrapiMedia(data.file?.url);
  if (!imgUrl) return null;
  return (
    <div className="flex items-center justify-center mt-8 lg:mt-0 h-72 sm:h-80 lg:h-96 xl:h-112 2xl:h-128">
      <Image
        src={imgUrl}
        alt={data.file?.alternativeText ?? data.file?.name ?? ""}
        className="object-cover w-full h-full rounded-lg overflow-hidden"
        width={400}
        height={400}
        loading="lazy"
      />
    </div>
  );
}