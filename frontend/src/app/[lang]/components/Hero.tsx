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
    <section className="flex item-center justify-center text-black min-h-[90vh] relative md:mt-2">
      <div className="container flex justify-center text-center w-full p-2 h-auto lg:max-w-[1100px] mx-auto lg:py-24 lg:flex-col">
        <div className="flex flex-col justify-center items-center text-center rounded-lg mt-10 lg:p-6 lg:mt-0 lg:w-auto xl:w-auto lg:text-center">
          <HighlightedText
            text={data.title}
            tag="h1"
            className="font-sans font-bold text-[3rem] leading-none p-2"
            color="text-primary-500"
            secondColor="text-secondary-500"
          />

          <HighlightedText
            text={data.description}
            tag="p"
            className="font-sans p-5"
            color="text-night"
          />
          <div className="flex flex-col space-y-4 sm:items-center sm:justify-center sm:flex-row sm:space-y-0 sm:space-x-4 lg:justify-center">
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
        {/* <div className="flex items-center drop-shadow-2xl rounded-2xl justify-center mt-8 lg:mt-0 sm:h-80 lg:h-96 xl:h-112 2xl:h-128">
          {/* <Image
            src={imgUrl || ""}
            alt={
              data.picture.data.attributes.alternativeText || "none provided"
            }
            className="object-contain rounded-xl h-72 sm:h-80 lg:h-96 xl:h-112 2xl:h-128 "
            width={600}
            height={600}
          /> 
        </div> */}
      </div>
    </section>
  );
}
