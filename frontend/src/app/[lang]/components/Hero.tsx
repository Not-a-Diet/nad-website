import Link from "next/link";
import Image from "next/image";
import HighlightedText from "./HighlightedText";
import { getStrapiMedia } from "../utils/api-helpers";
import { renderButtonStyle } from "../utils/render-button-style";
import FoodCalculator from "./FoodCalculator";

interface Button {
  id: string;
  url: string;
  text: string;
  type: string;
  newTab: boolean;
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

interface HeroProps {
  data: {
    id: string;
    title: string;
    description: string;
    picture: Picture;
    buttons: Button[];
  };
}

export default function Hero({ data }: HeroProps) {
  const imgUrl = getStrapiMedia(data.picture.data.attributes.url);

    return (
    <section className="text-night relative md:mt-2 top-16">
      <div className="container flex flex-col justify-center text-center w-full p-2 h-auto lg:max-w-[1100px] mx-auto sm:py-12 lg:py-24 lg:flex-row">
        <div className="flex flex-col justify-center text-center rounded-lg mt-10 lg:p-6 lg:mt-0 lg:max-w-md xl:max-w-lg lg:text-left">
          <HighlightedText
            text={data.title}
            tag="h1"
            className="font-heading text-5xl sm:text-6xl mb-8"
            color="text-kelly_green"
          />

          <HighlightedText
            text={data.description}
            tag="p"
            className="tmt-6 mb-8 text-lg sm:mb-12 font-marker"
            color="text-kelly_green"
          />
          <div className="flex flex-col space-y-4 sm:items-center sm:justify-center sm:flex-row sm:space-y-0 sm:space-x-4 lg:justify-start">
            {data.buttons.map((button: Button, index: number) => (
              <Link
                key={index}
                href={button.url}
                target={button.newTab ? "_blank" : "_self"}
                className={renderButtonStyle(button.type)}
              >
                {button.text}
              </Link>
            ))}
          </div>
        </div>
        <div className="flex items-center drop-shadow-2xl rounded-2xl justify-center mt-8 lg:mt-0 sm:h-80 lg:h-96 xl:h-112 2xl:h-128">
          <Image
            src={imgUrl || ""}
            alt={
              data.picture.data.attributes.alternativeText || "none provided"
            }
            className="object-contain rounded-xl h-72 sm:h-80 lg:h-96 xl:h-112 2xl:h-128 "
            width={600}
            height={600}
          />
        </div>
      </div>
    </section>
  );
}
