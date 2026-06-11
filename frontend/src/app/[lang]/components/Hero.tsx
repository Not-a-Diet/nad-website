import Link from "next/link";
import HighlightedText from "./HighlightedText";
import FloatingFood from "./FloatingFood";
import { renderButtonStyle } from "../utils/render-button-style";

interface Button {
  id: string;
  url: string;
  text: string;
  type: string;
  newTab: boolean;
}

interface PictureItem {
  id: string;
  url: string;
  name: string;
  alternativeText: string;
}

interface HeroProps {
  data: {
    id: string;
    title: string;
    description: string;
    picture: PictureItem[];
    buttons: Button[];
  };
}

export default function Hero({ data }: HeroProps) {
  return (
    <section
      id="hero"
      className="flex item-center justify-center text-black min-h-[90vh] relative md:mt-2 overflow-hidden"
    >
      <FloatingFood items={data.picture} size={120} />

      <div className="container flex justify-center text-center z-10 w-full p-2 h-auto lg:max-w-[1100px] mx-auto lg:py-24 lg:flex-col">
        <div className="flex flex-col justify-center items-center text-center rounded-lg mt-10 lg:p-6 lg:mt-0 lg:w-auto xl:w-auto lg:text-center">
          <HighlightedText
            text={data.title}
            tag="h1"
            className="font-sans font-bold text-[3rem] leading-none p-2"
            color="text-primary"
            secondColor="text-secondary"
          />

          <HighlightedText
            text={data.description}
            tag="p"
            className="font-sans p-5 w-2/3"
            color="text-night"
          />
          <div className="flex flex-col space-y-4 sm:items-center sm:justify-center sm:flex-row sm:space-y-0 sm:space-x-4 lg:justify-center">
            {data.buttons.map((button: Button) => (
              <Link
                key={button.id}
                href={button.url}
                target={button.newTab ? "_blank" : "_self"}
                rel={button.newTab ? "noopener noreferrer" : undefined}
                className={renderButtonStyle(button.type)}
              >
                {button.text}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
