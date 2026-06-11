import { getStrapiMedia } from "../utils/api-helpers";
import { parseDescriptionList } from "../utils/description-parser";
import Image from "next/image"

interface FeaturesProps {
  data: {
    heading: string;
    description: string;
    feature: Feature[];
  };
}
interface Picture {
  id: string;
  url: string;
  name: string;
  alternativeText: string;
}

interface Feature {
  id: string;
  title: string;
  description: string;
  showLink: boolean;
  newTab: boolean;
  media: Picture
  url: string;
  text: string;
  color: string;
  descriptionList: string;
}

function Feature({ title, description, showLink, newTab, media, url, text, color, descriptionList }: Feature) {
  const descriptions = parseDescriptionList(descriptionList);
  const colorMap: Record<string, { bg: string, border: string, text: string, button: string, buttonText: string }> = {
    primary: {
      bg: "bg-primary-100",
      border: "border-primary",
      text: "text-primary",
      button: "bg-primary",
      buttonText: "text-white",
    },
    secondary: {
      bg: "bg-secondary-100",
      border: "border-secondary",
      text: "text-secondary-700",
      button: "bg-secondary",
      buttonText: "text-crema",
    },
    tertiary: {
      bg: "bg-tertiary-100",
      border: "border-tertiary-500",
      text: "text-tertiary",
      button: "bg-tertiary-500",
      buttonText: "text-crema",
    },
    quaternary: {
      bg: "bg-quaternary-rose-100",
      border: "border-quaternary-rose",
      text: "text-quaternary-rose",
      button: "bg-quaternary-rose",
      buttonText: "text-white",
    }
  }
  const tw_col: { bg: string, border: string, text: string, button: string, buttonText: string } = colorMap[color] || colorMap.primary;


  return (
    <div className={`flex flex-col ${tw_col.bg} shadow-m items-center p-4 border-2 ${tw_col.border} rounded-3xl hover:shadow-xl transition-all duration-300 hover:-translate-y-2 max-w-md`}>
      {getStrapiMedia(media?.url) && (
      <Image
        src={getStrapiMedia(media?.url)!}
        alt={
          media?.alternativeText || "none provided"
        }
        width={150}
        height={150}
        loading="lazy"
        className="rounded-xl w-[85px] h-[85px] py-4"
      />
      )}

      <h3 className="my-3 text-3xl font-sans font-semibold text-center">{title}</h3>
        <div className="space-y-1 my-6 flex flex-col justify-between">
        <p className="mb-6 text-crema-800/95 flex-grow">{description}</p>
        <ul>
          {descriptions?.map((desc, index) => (
            <li className="p-2" key={index}>
              <span className={`${tw_col.text} mr-2`}>✓</span>
              <span className="text-crema-700 ">{desc}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="relative mt-auto">
        {
          showLink && <a href={url} target={newTab ? '_blank' : '_self'} rel="noopener noreferrer" className={`${tw_col.button} ${tw_col.buttonText} rounded-[0.5rem] py-2 px-6 inline-block`}>{text}</a>
        }
      </div>
    </div>
  );
}


export default function Features({ data }: FeaturesProps) {
  return (
    <section id="features" className="bg-white px-2 py-20 lg:py-24">
      <div className="container mx-auto py-4 space-y-2 text-center">
        <h2 className="text-4xl font-sans font-bold">{data.heading}</h2>
        <p className="font-sans">{data.description}</p>
      </div>
      <div className="container mx-auto my-6 grid justify-center gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {data.feature.map((feature: Feature) => (
          <Feature key={feature.id} {...feature} />
        ))}
      </div>
    </section>
  );
}
