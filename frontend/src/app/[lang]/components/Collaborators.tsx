"use client";

import { useId, useState } from "react";
import Image from "next/image";
import BracketHighlight from "@/app/[lang]/components/BracketHighlight";
import { getStrapiMedia } from "@/app/[lang]/utils/api-helpers";
import type { StrapiMedia } from "@/app/[lang]/types/strapi";

interface CollaboratorsProps {
  data: {
    title: string;
    logos?: Array<{
      id: number | string;
      title?: string | null;
      logo?: StrapiMedia | null;
    }>;
  };
  lang?: string;
}

const labels = {
  en: { pause: "Pause scrolling", resume: "Resume scrolling" },
  it: { pause: "Pausa scorrimento", resume: "Riprendi scorrimento" },
  pt: { pause: "Pausar movimento", resume: "Retomar movimento" },
};

export default function Collaborators({ data, lang = "en" }: CollaboratorsProps) {
  const headingId = useId();
  const [paused, setPaused] = useState(false);
  const copy = labels[lang as keyof typeof labels] || labels.en;
  const logos = (data.logos || []).flatMap((item) => {
    const src = getStrapiMedia(item.logo?.url);
    const name = item.title?.trim() || item.logo?.alternativeText?.trim();
    return name ? [{ id: item.id, src, name }] : [];
  });

  if (!logos.length) return null;
  const scrolling = logos.length > 1;

  return (
    <section aria-labelledby={headingId} className="bg-anti-flash_white px-6 py-20 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-wrap items-center justify-between gap-6">
          <h2 id={headingId} className="font-heading text-3xl font-bold tracking-tight text-crema md:text-4xl">
            <BracketHighlight text={data.title} highlightClass="text-primary" />
          </h2>
          {scrolling && (
            <button
              type="button"
              onClick={() => setPaused(!paused)}
              className="rounded-full border-2 border-crema-200 px-5 py-2 text-sm font-semibold text-crema hover:border-secondary-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-secondary-700 motion-reduce:hidden"
            >
              {paused ? copy.resume : copy.pause}
            </button>
          )}
        </div>
        <div className="collaborator-strip overflow-hidden" data-paused={paused}>
          <div className={`flex ${scrolling ? "collaborator-track" : ""}`}>
            {(scrolling ? [false, true] : [false]).map((duplicate) => (
              <ul
                key={String(duplicate)}
                aria-hidden={duplicate || undefined}
                className={`m-0 flex min-w-full shrink-0 list-none items-center justify-around gap-10 py-4 pr-10 ${duplicate ? "collaborator-copy" : ""}`}
              >
                {logos.map((logo) => (
                  <li key={logo.id} className="flex h-28 w-44 shrink-0 items-center justify-center rounded-2xl bg-white px-5 py-4">
                    {logo.src ? (
                      <Image
                        src={logo.src}
                        alt={duplicate ? "" : logo.name}
                        width={176}
                        height={80}
                        className="h-20 w-full object-contain"
                      />
                    ) : (
                      <span className="flex h-20 w-full items-center justify-center rounded-xl border-2 border-dashed border-crema-200 px-3 text-center text-sm font-semibold text-crema-500">
                        {logo.name}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
