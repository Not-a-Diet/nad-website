"use client";

import ArrowIcon from "./ArrowIcon";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { getStrapiMedia } from "../utils/api-helpers";

export interface TeamDirectoryMember {
  slug: string;
  name: string;
  role?: string;
  shortBio?: string;
  profilePhoto?: {
    url?: string;
    alternativeText?: string;
  } | null;
}

interface Props {
  lang: string;
  members: TeamDirectoryMember[];
}

const copy = {
  en: {
    eyebrow: "Our team",
    title: "The people behind Not a Diet",
    description: "Meet the qualified professionals ready to support you with practical, compassionate nutrition care.",
    profile: "View profile",
    previous: "Previous team members",
    next: "Next team members",
    pages: "Team member pages",
    page: "Go to team member page",
    empty: "Our team profiles will be here soon.",
  },
  it: {
    eyebrow: "Il nostro team",
    title: "Le persone dietro Not a Diet",
    description: "Scopri le professioniste qualificate pronte a sostenerti con una cura nutrizionale pratica e attenta.",
    profile: "Vedi il profilo",
    previous: "Membri del team precedenti",
    next: "Prossimi membri del team",
    pages: "Pagine dei membri del team",
    page: "Vai alla pagina del team",
    empty: "I profili del nostro team saranno disponibili a breve.",
  },
  pt: {
    eyebrow: "A nossa equipa",
    title: "As pessoas por trás da Not a Diet",
    description: "Conheça as profissionais qualificadas prontas para apoiar com cuidados nutricionais práticos e atenciosos.",
    profile: "Ver perfil",
    previous: "Membros anteriores da equipa",
    next: "Próximos membros da equipa",
    pages: "Páginas dos membros da equipa",
    page: "Ir para a página da equipa",
    empty: "Os perfis da nossa equipa estarão disponíveis em breve.",
  },
} as const;

export default function TeamDirectory({ lang, members }: Props) {
  const text = copy[lang as keyof typeof copy] ?? copy.en;
  const trackRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(0);
  const [pageCount, setPageCount] = useState(1);

  const measure = useCallback(() => {
    const track = trackRef.current;
    const card = track?.querySelector<HTMLElement>("[data-team-card]");
    if (!track || !card) return;

    const style = getComputedStyle(track);
    const gap = Number.parseFloat(style.columnGap || style.gap || "0");
    const perPage = Math.max(1, Math.round((track.clientWidth + gap) / (card.offsetWidth + gap)));
    const pages = Math.max(1, Math.ceil(members.length / perPage));
    setPageCount(pages);
    setPage((current) => Math.min(current, pages - 1));
  }, [members.length]);

  useLayoutEffect(() => {
    measure();
  }, [measure]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const observer = new ResizeObserver(measure);
    observer.observe(track);
    return () => observer.disconnect();
  }, [measure]);

  const scrollToPage = (target: number) => {
    const track = trackRef.current;
    if (!track) return;
    const next = Math.max(0, Math.min(pageCount - 1, target));
    setPage(next);
    track.scrollTo({ left: next * track.clientWidth, behavior: "smooth" });
  };

  const handleScroll = () => {
    const track = trackRef.current;
    if (!track) return;
    const current = Math.round(track.scrollLeft / track.clientWidth);
    setPage(Math.max(0, Math.min(pageCount - 1, current)));
  };

  return (
    <section className="relative overflow-hidden bg-anti-flash_white-100 pb-20 pt-40 sm:pb-24 sm:pt-40 lg:pb-28 lg:pt-44">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-80 bg-[radial-gradient(circle_at_50%_-20%,rgba(220,252,231,0.9),transparent_70%)]" />
      <div className="relative mx-auto max-w-[1240px] px-5 sm:px-8 lg:px-10">
        <header className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-extrabold uppercase tracking-[0.16em] text-secondary-700">{text.eyebrow}</p>
          <h1 className="mt-3 text-balance text-4xl font-extrabold tracking-tight text-crema-900 sm:text-5xl">{text.title}</h1>
          <p className="mx-auto mt-5 max-w-2xl text-pretty text-lg leading-8 text-crema-500">{text.description}</p>
        </header>

        {members.length > 0 ? (
          <div className="mt-12 sm:mt-14">
            <div
              ref={trackRef}
              onScroll={handleScroll}
              className="-mx-5 grid snap-x snap-mandatory auto-cols-[calc(100%_-_3.5rem)] grid-flow-col gap-5 overflow-x-auto overscroll-x-contain px-5 pb-5 [scrollbar-width:none] sm:-mx-8 sm:auto-cols-[calc((100%_-_1.5rem)/2)] sm:gap-6 sm:px-8 lg:-mx-10 lg:auto-cols-[calc((100%_-_3rem)/3)] lg:px-10 [&::-webkit-scrollbar]:hidden"
            >
              {members.map((member, index) => {
                const image = getStrapiMedia(member.profilePhoto?.url);

                return (
                  <Link
                    key={member.slug}
                    data-team-card
                    href={`/${lang}/team/${member.slug}`}
                    className="group relative flex min-h-[430px] snap-start flex-col overflow-hidden rounded-[2rem] border border-crema-200 bg-white p-5 shadow-sm transition-[transform,box-shadow,border-color] duration-300 ease-out hover:-translate-y-1 hover:border-secondary-100 hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary motion-reduce:transition-none sm:p-6"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden rounded-[1.45rem] bg-gradient-to-br from-secondary-100 via-anti-flash_white to-tertiary-100">
                      {image ? (
                        <Image
                          src={image}
                          alt={member.profilePhoto?.alternativeText ?? member.name}
                          fill
                          sizes="(max-width: 639px) calc(100vw - 3.5rem), (max-width: 1023px) calc((100vw - 6rem) / 2), 380px"
                          priority={index === 0}
                          className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03] motion-reduce:transition-none"
                        />
                      ) : (
                        <span className="flex h-full w-full items-center justify-center text-6xl font-bold text-secondary-700">
                          {member.name.charAt(0)}
                        </span>
                      )}
                      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/20 to-transparent" />
                    </div>

                    <div className="flex flex-1 flex-col px-1 pb-1 pt-6">
                      {member.role ? <p className="text-sm font-extrabold uppercase tracking-[0.12em] text-secondary-700">{member.role}</p> : null}
                      <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-crema-900">{member.name}</h2>
                      {member.shortBio ? <p className="mt-3 text-base leading-7 text-crema-500">{member.shortBio}</p> : null}
                      <span className="mt-auto pt-6 inline-flex items-center gap-2 font-bold text-primary transition-colors group-hover:text-primary-500">
                        {text.profile}
                        <ArrowIcon />
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>

            {pageCount > 1 ? (
              <div className="mt-4 flex items-center justify-between gap-6 sm:mt-6">
                <div className="flex items-center gap-2" role="group" aria-label={text.pages}>
                  {Array.from({ length: pageCount }).map((_, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => scrollToPage(index)}
                      aria-label={`${text.page} ${index + 1}`}
                      aria-current={page === index ? "true" : undefined}
                      className="flex h-8 min-w-8 items-center justify-center rounded-full p-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary"
                    >
                      <span className={`h-2 rounded-full transition-[width,background-color] duration-300 ${page === index ? "w-7 bg-primary" : "w-2 bg-crema-200"}`} />
                    </button>
                  ))}
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => scrollToPage(page - 1)}
                    disabled={page === 0}
                    aria-label={text.previous}
                    className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-crema-200 bg-white text-crema-800 transition hover:border-crema-800 disabled:cursor-not-allowed disabled:opacity-35 focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary"
                  >
                    <ArrowIcon direction="left" size={20} />
                  </button>
                  <button
                    type="button"
                    onClick={() => scrollToPage(page + 1)}
                    disabled={page === pageCount - 1}
                    aria-label={text.next}
                    className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-crema-200 bg-white text-crema-800 transition hover:border-crema-800 disabled:cursor-not-allowed disabled:opacity-35 focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary"
                  >
                    <ArrowIcon size={20} />
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        ) : (
          <p className="mt-14 text-center text-lg text-crema-500">{text.empty}</p>
        )}
      </div>
    </section>
  );
}
