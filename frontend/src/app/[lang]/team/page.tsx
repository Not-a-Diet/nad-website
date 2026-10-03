import type { Metadata } from "next";
import { getDietitians } from "@/app/[lang]/utils/get-dietitians";
import TeamDirectory from "@/app/[lang]/components/TeamDirectory";
import { buildAlternates, pageUrl } from "@/app/[lang]/utils/seo";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const title = "Our Team";
  const description = "Meet the qualified nutrition professionals behind Not a Diet.";

  return {
    title,
    description,
    alternates: buildAlternates(lang, "/team"),
    openGraph: { title, description, url: pageUrl(lang, "/team"), type: "website" },
  };
}

export default async function TeamPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const members = await getDietitians(lang);

  return <TeamDirectory lang={lang} members={members} />;
}
