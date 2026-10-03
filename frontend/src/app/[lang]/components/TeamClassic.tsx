import Image from "next/image";
import Link from "next/link";
import Quote from "./Quote";
import { specializationLabels, type Dietitian } from "../utils/dietitians";
import { getStrapiMedia } from "../utils/api-helpers";

export interface TeamProps {
  data: {
    title: string;
    description: string;
    layout?: "preview" | "classic";
    ctaLabel?: string;
    dietitians?: Dietitian[];
    filosofy?: {
      title?: string;
      body: string;
      type: "quotation" | "filosofy";
      sign?: string;
      isList: boolean;
      items?: Array<{
        id: number;
        title: string;
        description: string;
      }>;
    };
  };
  lang?: string;
}

function DietitianCard({
  name,
  role,
  profilePhoto,
  shortBio,
  specializations,
}: Dietitian) {
  const skills = specializationLabels(specializations);
  const profilePhotoUrl = getStrapiMedia(profilePhoto?.url);

  return (
    <div className="bg-anti-flash_white rounded-3xl p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl lg:max-w-md mx-4 my-4">
      <div className="w-32 h-32 mx-auto mb-4 relative">
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-kiwi-100 to-pasta-100"></div>
        {profilePhotoUrl && (
          <Image
            src={profilePhotoUrl}
            alt={name}
            width={400}
            height={400}
            loading="lazy"
            sizes="128px"
            className="border-2 rounded-full drop-shadow-md dark:bg-gray-500 dark:border-gray-700"
          />
        )}
      </div>

      <h3 className="text-crema-900 text-center mb-2">{name}</h3>
      <p className="text-secondary-700 text-center mb-4">{role}</p>
      <p className="text-crema-700 mb-4">{shortBio}</p>
      <div className="text-left space-y-2 mt-4">
        {skills.map((skill, index) => (
          <div key={index} className="flex items-start">
            <span className="text-secondary-700 mr-2 mt-1">✓</span>
            <p className="text-crema-800 ">{skill}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function TeamClassic({ data, lang }: TeamProps) {
  return (
    <section id="about" className="py-20 lg:py-24 bg-anti-flash_white-100 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl mb-4">{data.title}</h2>
          <p className="text-crema-700 max-w-2xl mx-auto">{data.description}</p>
        </div>

        {data.filosofy && <Quote data={data.filosofy} />}

        <div className="mt-10 flex flex-wrap justify-center">
          {data.dietitians?.map(person => (
            <DietitianCard key={person.documentId} {...person} />
          ))}
        </div>

        {lang ? (
          <div className="mt-8 text-center">
            <Link
              href={`/${lang}/team`}
              className="inline-flex items-center justify-center rounded-full bg-primary px-7 py-3 font-bold text-white transition hover:bg-primary-500"
            >
              {data.ctaLabel || (lang === "it" ? "Scopri il team" : lang === "pt" ? "Conheça a equipa" : "Meet the team")}
            </Link>
          </div>
        ) : null}
      </div>
    </section>
  );
}
