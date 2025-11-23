import { parseDescriptionList } from "../utils/description-parser";

interface FeaturesProps {
  data: {
    heading: string;
    description: string;
    feature: Feature[];
  };
}

interface Feature {
  id: string;
  title: string;
  description: string;
  showLink: boolean;
  newTab: boolean;
  url: string;
  text: string;
  color: string;
  descriptionList: string;
}

function Feature({ title, description, showLink, newTab, url, text, color, descriptionList}: Feature) {
  const descriptions = parseDescriptionList(descriptionList);
  const colorMap: Record<string, {bg: string, border: string, text: string}> = {
    primary: {
      bg: "bg-primary-100",
      border: "border-primary-500",
      text: "text-primary-500", 
    },
    secondary: {
      bg: "bg-secondary-100",
      border: "border-secondary-500", 
      text: "text-secondary-500",
    },
    tertiary: {
      bg: "bg-tertiary-100",
      border: "border-tertiary-500", 
      text: "text-tertiary-500",
    },
    quaternary: {
      bg: "bg-quaternary-100",
      border: "border-quaternary-500", 
      text: "text-quaternary-500",
    }
  }
  const tw_col: {bg:string, border: string, text: string}  = colorMap[color] || "bg-gray-500";
  
  return (
    <div className={`flex flex-col ${tw_col.bg} shadow-m items-center p-4 border-2 ${tw_col.border} rounded-3xl hover:shadow-xl transition-all duration-300 hover:-translate-y-2 max-w-md`}>
      <svg 
      height="40px" 
      width="40px" 
      version="1.1" 
      id="_x32_" 
      xmlns="http://www.w3.org/2000/svg" 
      xmlnsXlink="http://www.w3.org/1999/xlink" 
      viewBox="0 0 512 512" xmlSpace="preserve" 
      fill="#5da414">
        <g id="SVGRepo_bgCarrier" 
        strokeWidth="0">
          </g>
          <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
          <g id="SVGRepo_iconCarrier"><g> <path d="M447.086,151.483c0.871-5.634,1.326-11.401,1.326-17.288c0-61.926-50.204-112.136-112.136-112.136 c-16.007,0-31.224,3.36-44.995,9.404C268.701,11.864,239.222,0,206.978,0C141.236,0,87.016,49.302,79.259,112.949 C35.441,131.825,4.762,175.381,4.762,226.114c0,68.028,55.144,123.173,123.173,123.173c12.452,0,24.48-1.856,35.814-5.306 c15.336,24.86,46.426,86.204,40.837,168.018h121.332c0,0-6.826-66.643,33.019-174.465c13.682,6.73,29.078,10.522,45.353,10.522 c56.858,0,102.948-46.09,102.948-102.948C507.238,203.527,482.572,167.728,447.086,151.483z M200.136,339.406 c9.27,6.252,19.636,10.999,30.747,13.92l0.678,45.934L200.136,339.406z M280.513,424.045l-8.57-68.565 c10.88-1.654,21.186-5.074,30.635-9.904L280.513,424.045z"></path> </g> </g></svg>
      <h3 className="my-3 text-3xl font-heading text-center">{title}</h3>
      <div className="space-y-1 my-6 flex flex-col between">
        <p className="mb-6 text-crema-800/95">{description}</p>
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
          showLink && <a href={url} target={newTab ? '_blank' : '_self'}><button className={`${tw_col.border} border-2 py-2 px-6`}>{text}</button></a>  
        }
      </div>
    </div>
  );
}


export default function Features({ data }: FeaturesProps) {
  return (
    <section className="bg-white p-2 mt-24 lg:mt-2 lg:max-w[900px] m:py-12 lg:py-24">
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
