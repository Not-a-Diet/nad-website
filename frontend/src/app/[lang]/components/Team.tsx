import TeamClassic, { type TeamProps } from "./TeamClassic";
import CtaButton from "./CtaButton";
import Quote from "./Quote";

const copy = {
  en: { eyebrow: "People, before plans", cta: "Meet the team" },
  it: { eyebrow: "Le persone, prima dei piani", cta: "Scopri il team" },
  pt: { eyebrow: "Pessoas, antes dos planos", cta: "Conheça a equipa" },
};

export default function Team({ data, lang = "en" }: TeamProps) {
  const text = copy[lang as keyof typeof copy] ?? copy.en;
  if (data.layout === "classic") {
    return <TeamClassic data={data} lang={lang} />;
  }
  return (
    <section id="about" className="bg-anti-flash_white-100 py-12 lg:py-16">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex flex-col gap-6 border-y border-secondary-100 py-8 sm:py-10 lg:flex-row lg:items-center lg:justify-between lg:gap-12">
          <div className="max-w-2xl">
            <p className="mb-2 text-sm font-bold uppercase tracking-widest text-secondary-700">{text.eyebrow}</p>
            <h2 className="text-3xl font-bold text-crema-900 sm:text-4xl">{data.title}</h2>
            <p className="mb-0 mt-3 leading-7 text-crema-700">{data.description}</p>
          </div>
          <CtaButton text={data.ctaLabel || text.cta} url={`/${lang}/team`} className="group inline-flex shrink-0 items-center justify-center gap-3 self-start rounded-full bg-primary px-6 py-3 font-bold text-white transition hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary lg:self-center" />
        </div>
        {data.filosofy && <div className="mt-12"><Quote data={data.filosofy} /></div>}
      </div>
    </section>
  );
}
