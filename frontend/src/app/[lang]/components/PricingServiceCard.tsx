import Image from "next/image";
import BracketHighlight from "./BracketHighlight";
import PriceDisplay from "./PriceDisplay";
import CtaButton from "./CtaButton";
import FloatingFood, { COMPACT_FLOAT_POSITIONS } from "./FloatingFood";
import { getStrapiMedia } from "../utils/api-helpers";
import { splitLines } from "../utils/split-lines";

interface MediaItem {
  id: number | string;
  url: string;
  alternativeText?: string | null;
}

interface PricingServiceCardData {
  id: string;
  eyebrow?: string;
  title?: string;
  description?: string;
  cardIcon?: MediaItem | null;
  cardTitle?: string;
  cardSubtitle?: string;
  showStudio?: boolean;
  showOnline?: boolean;
  studioLabel?: string;
  onlineLabel?: string;
  firstVisitName?: string;
  firstVisitSub?: string;
  firstVisitPrice?: string;
  firstVisitMeta?: string;
  followUpName?: string;
  followUpSub?: string;
  followUpPrice?: string;
  followUpMeta?: string;
  cardNote?: string;
  ctaText?: string;
  ctaUrl?: string;
  ctaNewTab?: boolean;
  reassurances?: string;
  decoration?: MediaItem[] | null;
}

interface PricingServiceCardProps {
  data: PricingServiceCardData;
}

export default function PricingServiceCard({ data }: PricingServiceCardProps) {
  const iconUrl = data.cardIcon?.url ? getStrapiMedia(data.cardIcon.url) : null;
  const reassuranceItems = splitLines(data.reassurances);

  return (
    <section
      id="pricing"
      className="relative overflow-hidden bg-anti-flash_white pb-16 pt-24"
    >
      <FloatingFood
        items={data.decoration}
        positions={COMPACT_FLOAT_POSITIONS}
        size={100}
        opacity={0.55}
      />

      <div className="relative z-10 mx-auto max-w-[1180px] px-6">
        <div className="mx-auto mb-12 max-w-[780px] text-center">
          {data.eyebrow ? (
            <span className="mb-3.5 inline-block text-sm font-bold uppercase tracking-[0.14em] text-secondary-500">
              {data.eyebrow}
            </span>
          ) : null}
          {data.title ? (
            <h2 className="m-0 mb-4 font-heading text-[clamp(2rem,4.4vw,2.75rem)] font-bold leading-[1.05] tracking-[-0.015em]">
              <BracketHighlight text={data.title} highlightClass="text-primary" />
            </h2>
          ) : null}
          {data.description ? (
            <p className="mx-auto m-0 max-w-[640px] text-lg leading-[1.55] text-crema-800">
              {data.description}
            </p>
          ) : null}
        </div>

        <article className="overflow-hidden rounded-[2.5rem] border border-crema-200 bg-white shadow-md">
          <header className="flex flex-wrap items-center gap-5 border-b border-crema-200 bg-gradient-to-br from-secondary-100/55 to-tertiary-100/40 px-10 pb-7 pt-9">
            {iconUrl ? (
              <span className="flex h-[72px] w-[72px] flex-shrink-0 items-center justify-center rounded-full bg-white shadow-sm">
                <Image
                  src={iconUrl}
                  alt={data.cardIcon?.alternativeText || ""}
                  width={46}
                  height={46}
                  loading="lazy"
                />
              </span>
            ) : null}
            <div className="min-w-0">
              {data.cardTitle ? (
                <h3 className="m-0 mb-1 font-heading text-3xl font-bold tracking-tight">
                  {data.cardTitle}
                </h3>
              ) : null}
              {data.cardSubtitle ? (
                <p className="m-0 max-w-[640px] leading-[1.5] text-crema-800">
                  {data.cardSubtitle}
                </p>
              ) : null}
            </div>
            <div className="ml-auto flex flex-wrap gap-2">
              {data.showStudio && data.studioLabel ? (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-crema-200 bg-white px-3.5 py-2 text-sm font-semibold">
                  <span className="h-2 w-2 rounded-full bg-secondary-500" />
                  {data.studioLabel}
                </span>
              ) : null}
              {data.showOnline && data.onlineLabel ? (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-crema-200 bg-white px-3.5 py-2 text-sm font-semibold">
                  <span className="h-2 w-2 rounded-full bg-secondary-500" />
                  {data.onlineLabel}
                </span>
              ) : null}
            </div>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-[1fr_1px_1fr]">
            <PriceDisplay
              variant="cell"
              num="1"
              accent="primary"
              name={data.firstVisitName}
              sub={data.firstVisitSub}
              price={data.firstVisitPrice}
              meta={data.firstVisitMeta}
            />
            <div className="h-px w-full bg-crema-200 md:h-full md:w-px" aria-hidden="true" />
            <PriceDisplay
              variant="cell"
              num="2"
              accent="secondary"
              name={data.followUpName}
              sub={data.followUpSub}
              price={data.followUpPrice}
              meta={data.followUpMeta}
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-5 border-t border-crema-200 bg-anti-flash_white-100 px-10 pb-9 pt-7">
            {data.cardNote ? (
              <p className="m-0 max-w-[480px] text-sm leading-[1.5] text-crema-800">
                {data.cardNote}
              </p>
            ) : <span />}
            <CtaButton
              text={data.ctaText}
              url={data.ctaUrl}
              newTab={data.ctaNewTab}
              arrow="↗"
              className="group inline-flex items-center gap-2.5 rounded-full bg-primary px-7 py-4 text-base font-bold text-white shadow-[0_4px_12px_rgba(232,71,30,0.25)] transition hover:scale-[1.03] hover:shadow-[0_8px_20px_rgba(232,71,30,0.35)]"
            />
          </div>
        </article>

        {reassuranceItems.length ? (
          <div className="mt-10 flex flex-wrap justify-center gap-x-9 gap-y-5 text-sm text-crema-800">
            {reassuranceItems.map((r, i) => (
              <span key={i} className="inline-flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-secondary-500" />
                {r}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
