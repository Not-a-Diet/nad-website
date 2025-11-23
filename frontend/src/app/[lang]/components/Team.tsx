import { assert } from "console";
import { parseDescriptionList } from "../utils/description-parser";
import { getStrapiMedia } from "../utils/api-helpers";
import Image from "next/image";

interface TeamProps {
  data: {
    title: string;
    description: string;
    member: Array<TeamMember>;
  };
}

interface TeamMember {
    name: string;
    occupation: string;
    profilePhoto: {
        data: {
            attributes: {
                url: string;
            };
        }
    };
    description: string;
    skills: string;
}

function TeamMemberCard({ name, occupation, profilePhoto, description, skills }: TeamMember) {
    const skillsArr = parseDescriptionList(skills);
    const profilePhotoUrl = getStrapiMedia(profilePhoto.data?.attributes.url);

    return (
        <div className="bg-anti-flash_white rounded-3xl p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 lg: max-w-md mx-4 my-4">
            <div className="w-32 h-32 mx-auto mb-4 relative">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-kiwi-100 to-pasta-100"></div>
                {profilePhotoUrl && (
                    <Image
                        src={profilePhotoUrl}
                        alt="professionist image"
                        width={400}
                        height={400}
                        className="border-2 rounded-full drop-shadow-md dark:bg-gray-500 dark:border-gray-700"
                    />
                )}
            </div>
            <h3 className="text-crema-900 text-center mb-2">{name}</h3>
            <p className="text-secondary text-center mb-4">{occupation}</p>
            <p className="text-crema-700 mb-4">{description}</p>
            <div className="text-left space-y-2 mt-4">
                {skillsArr.map((skill, index) => (
                    <div key={index} className="flex items-start">
                        <span className="text-secondary mr-2 mt-1">✓</span>
                        <p className="text-crema-800 ">{skill}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}



export default function Team({ data }: TeamProps) {
  return (
    <section className="py-24 bg-anti-flash_white-100 relative overflow-hidden">
        <div className="container mx-auto px-4">
            <div className="text-center mb-16">
                <h2 className="text-4xl font-sans font-bold text-crema-900 mb-4">{data.title}</h2>
                <p className="text-crema-700 max-w-2xl mx-auto">{data.description}</p>
            </div>
            <div className="flex flex-row items-center justify-center flex-wrap">
                {data.member?.map((member, index) => (
                    <div key={index}>
                         <TeamMemberCard key={index} {...member} />
                    </div>
                ))}
            </div>
        </div>
    </section>
  );
}