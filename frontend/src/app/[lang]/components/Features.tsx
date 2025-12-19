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
  data: {
    id: string;
    attributes: {
      url: string;
      name: string;
      alternativeText: string;
    };
  };
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
  const colorMap: Record<string, { bg: string, border: string, text: string, button: string }> = {
    primary: {
      bg: "bg-primary-100",
      border: "border-primary",
      text: "text-primary-500",
      button: "bg-primary",
    },
    secondary: {
      bg: "bg-secondary-100",
      border: "border-secondary",
      text: "text-secondary-500",
      button: "bg-secondary",
    },
    tertiary: {
      bg: "bg-tertiary-100",
      border: "border-tertiary-500",
      text: "text-tertiary-500",
      button: "bg-tertiary-500",
    },
    quaternary: {
      bg: "bg-quaternary-100",
      border: "border-quaternary-500",
      text: "text-quaternary-500",
      button: "bg-quaternary-500",
    }
  }
  const tw_col: { bg: string, border: string, text: string, button: string } = colorMap[color] || "bg-gray-500";


  return (
    <div className={`flex flex-col ${tw_col.bg} shadow-m items-center p-4 border-2 ${tw_col.border} rounded-3xl hover:shadow-xl transition-all duration-300 hover:-translate-y-2 max-w-md`}>
      <Image
        src={getStrapiMedia(media?.data?.attributes?.url) || ""}
        alt={
          media?.data?.attributes?.alternativeText || "none provided"
        }
        width={150}
        height={150}
        className="rounded-xl w-[85px] h-[85px] py-4"
      />

      <h3 className="my-3 text-3xl font-sans font-semibold text-center">{title}</h3>
      <div className="space-y-1 my-6 flex flex-col between">
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
          showLink && <a href={url} target={newTab ? '_blank' : '_self'}><button className={`${tw_col.button} rounded-[0.5rem] py-2 px-6`}>{text}</button></a>
        }
      </div>
    </div>
  );
}


export default function Features({ data }: FeaturesProps) {
  return (
    <section id="features" className="bg-white p-2 mt-24 lg:mt-2 lg:max-w[900px] m:py-12 lg:py-24">
      <div className="container mx-auto py-4 space-y-2 text-center">
        <h2 className="text-4xl font-sans font-bold">{data.heading}</h2>
        <p className="font-sans">{data.description}</p>
      </div>
      <div className="container mx-auto my-6 grid justify-center gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {data.feature.map((feature: Feature, index: number) => (
          <Feature key={index} {...feature} />
        ))}
      </div>
    </section>
  );
}
