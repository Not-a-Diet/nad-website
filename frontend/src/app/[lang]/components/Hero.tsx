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
  }[];
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
    const imgUrls = data.picture.data?.map( attr => { 
     return {
      url: getStrapiMedia(attr.attributes.url), 
      alte: attr.attributes.alternativeText
    }
    });

    const pos = [
      "bottom-32 right-4 lg:right-80",
      "top-32 left-4 lg:left-64",
      "top-42 right-4 lg:right-32",
      "bottom-32 left-4 lg:left-40"
    ]
    const animations = [
      "animate-float-slow",
      "animate-float-medium",
      "animate-float-fast",
      "animate-float-medium"
    ];

    return (
    <section className="flex item-center justify-center text-black min-h-[90vh] relative md:mt-2">
      {imgUrls && imgUrls.map((imgUrl, index) => (
      <div className={`absolute z-[0] ${pos[index]} ${animations[index]} saturate-135`} key={index}>
        <div className="relative w-44 h-44">
          <Image
            src={imgUrl.url || ""}
            alt={
              imgUrl.alte || "none provided"
            }
            className="object-contain rounded-xl h-72 sm:h-80 lg:h-96 xl:h-112 2xl:h-128 "
            width={120}
            height={120}
          />
        </div>
      </div>
      ))}

      <div className="container flex justify-center text-center z-10 w-full p-2 h-auto lg:max-w-[1100px] mx-auto lg:py-24 lg:flex-col">
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
            {/* CSS Animations */}
      <style>{`
        @keyframes float-slow {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          33% { transform: translate(10px, -20px) rotate(5deg); }
          66% { transform: translate(-10px, -10px) rotate(-5deg); }
        }
        @keyframes float-medium {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          33% { transform: translate(-15px, -15px) rotate(-3deg); }
          66% { transform: translate(15px, -25px) rotate(3deg); }
        }
        @keyframes float-fast {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          33% { transform: translate(20px, -10px) rotate(8deg); }
          66% { transform: translate(-20px, -20px) rotate(-8deg); }
        }
        .animate-float-slow {
          animation: float-slow 12s ease-in-out infinite;
        }
        .animate-float-medium {
          animation: float-medium 10s ease-in-out infinite;
        }
        .animate-float-fast {
          animation: float-fast 8s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}
