import Link from "next/link";
import Image from "next/image";
import BracketHighlight from "./BracketHighlight";
import PriceDisplay from "./PriceDisplay";
import CtaButton from "./CtaButton";
import FloatingFood, { COMPACT_FLOAT_POSITIONS } from "./FloatingFood";
import { getStrapiMedia } from "../utils/api-helpers";

interface MediaItem {
  id: number | string;
  url: string;
  alternativeText?: string | null;
}

interface PricingTeaserData {
  id: string;
  eyebrow?: string;
  headline?: string;
  lede?: string;
  variant?: "card" | "band" | "inline";
  ctaText?: string;
  ctaUrl?: string;
  ctaNewTab?: boolean;
  secondaryLinkText?: string;
  secondaryLinkUrl?: string;
  firstVisitLabel?: string;
  firstVisitPrice?: string;
  firstVisitMeta?: string;
  followUpLabel?: string;
  followUpPrice?: string;
  followUpMeta?: string;
  showStudio?: boolean;
  showOnline?: boolean;
  studioLabel?: string;
  onlineLabel?: string;
  mascot?: MediaItem | null;
  decoration?: MediaItem[] | null;
}

interface PricingTeaserProps {
  data: PricingTeaserData;
}

function CardVariant({ data }: { data: PricingTeaserData }) {
  const mascotUrl = data.mascot?.url ? getStrapiMedia(data.mascot.url) : null;
  return (
    <article className="grid grid-cols-1 overflow-hidden rounded-[2.5rem] border border-crema-200 bg-white shadow-md md:grid-cols-[1.1fr_1fr]">
      <div className="flex flex-col justify-center gap-4 bg-gradient-to-br from-secondary-100/55 to-tertiary-100/40 px-8 py-10 md:px-11">
        {data.eyebrow ? (
          <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-secondary-500">
            {data.eyebrow}
          </span>
        ) : null}
        <h3 className="m-0 font-heading text-[clamp(1.5rem,2.4vw,1.875rem)] font-bold leading-[1.15] tracking-tight">
          <BracketHighlight text={data.headline} highlightClass="text-primary" />
        </h3>
        {data.lede ? (
          <p className="m-0 text-base leading-[1.5] text-crema-800">{data.lede}</p>
        ) : null}
        <div className="mt-2 flex flex-wrap items-center gap-3.5">
          <CtaButton
            text={data.ctaText}
            url={data.ctaUrl}
            newTab={data.ctaNewTab}
            className="group inline-flex items-center gap-2.5 whitespace-nowrap rounded-full bg-primary px-6 py-3.5 text-base font-bold text-white shadow-[0_4px_12px_rgba(232,71,30,0.22)] transition hover:scale-[1.03] hover:shadow-[0_8px_20px_rgba(232,71,30,0.32)]"
          />
          {data.secondaryLinkText && data.secondaryLinkUrl ? (
            <Link
              href={data.secondaryLinkUrl}
              className="text-sm font-semibold text-crema-800 underline decoration-crema-200 underline-offset-[4px] hover:text-secondary-500"
            >
              {data.secondaryLinkText}
            </Link>
          ) : null}
        </div>
      </div>

      <div className="relative flex flex-col justify-center gap-3 px-9 py-8">
        {mascotUrl ? (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -right-2.5 -top-5 h-[90px] w-[90px] animate-float-slow opacity-90"
          >
            <Image
              src={mascotUrl}
              alt={data.mascot?.alternativeText || ""}
              width={90}
              height={90}
            />
          </span>
        ) : null}
        <div className="relative z-10 flex flex-wrap gap-3">
          <PriceDisplay
            variant="pill"
            num="1"
            accent="primary"
            name={data.firstVisitLabel}
            price={data.firstVisitPrice}
            meta={data.firstVisitMeta}
          />
          <PriceDisplay
            variant="pill"
            num="2"
            accent="secondary"
            name={data.followUpLabel}
            price={data.followUpPrice}
            meta={data.followUpMeta}
          />
        </div>
        {(data.showStudio || data.showOnline) ? (
          <div className="mt-1 flex flex-wrap gap-2 text-xs text-crema-500">
            {data.showStudio && data.studioLabel ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary-100 px-2.5 py-1 font-bold text-secondary-500">
                {data.studioLabel}
              </span>
            ) : null}
            {data.showOnline && data.onlineLabel ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary-100 px-2.5 py-1 font-bold text-secondary-500">
                {data.onlineLabel}
              </span>
            ) : null}
          </div>
        ) : null}
      </div>
    </article>
  );
}

function BandVariant({ data }: { data: PricingTeaserData }) {
  const mascotUrl = data.mascot?.url ? getStrapiMedia(data.mascot.url) : null;
  return (
    <article className="relative grid grid-cols-1 items-center gap-8 overflow-hidden rounded-[2.5rem] bg-crema px-9 py-7 text-white md:grid-cols-[1fr_auto_auto]">
      {mascotUrl ? (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute right-[-30px] top-1/2 h-[220px] w-[220px] -translate-y-1/2 opacity-[0.08]"
        >
          <Image
            src={mascotUrl}
            alt=""
            width={220}
            height={220}
            className="invert"
          />
        </span>
      ) : null}
      <div className="relative z-10">
        {data.eyebrow ? (
          <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-secondary">
            {data.eyebrow}
          </span>
        ) : null}
        <h3 className="mt-1 font-heading text-[clamp(1.25rem,2vw,1.5rem)] font-bold text-white">
          <BracketHighlight text={data.headline} highlightClass="text-secondary" />
        </h3>
      </div>
      <div className="relative z-10 flex items-center gap-6">
        {data.firstVisitLabel ? (
          <div>
            <div className="text-xs uppercase tracking-[0.08em] text-crema-200/70">
              {data.firstVisitLabel}
            </div>
            <div className="font-heading text-[1.75rem] font-bold tracking-tight text-primary-500">
              {data.firstVisitPrice}
            </div>
          </div>
        ) : null}
        <div className="h-10 w-px bg-crema-800" aria-hidden="true" />
        {data.followUpLabel ? (
          <div>
            <div className="text-xs uppercase tracking-[0.08em] text-crema-200/70">
              {data.followUpLabel}
            </div>
            <div className="font-heading text-[1.75rem] font-bold tracking-tight text-secondary">
              {data.followUpPrice}
            </div>
          </div>
        ) : null}
      </div>
      <CtaButton
        text={data.ctaText}
        url={data.ctaUrl}
        newTab={data.ctaNewTab}
        className="group relative z-10 inline-flex items-center gap-2.5 whitespace-nowrap rounded-full bg-secondary px-6 py-3.5 text-base font-bold text-crema transition hover:shadow-[0_8px_20px_rgba(184,206,18,0.35)]"
      />
    </article>
  );
}

function InlineVariant({ data }: { data: PricingTeaserData }) {
  return (
    <article className="rounded-[2.5rem] border border-dashed border-secondary-100 bg-anti-flash_white-100 px-6 py-11 text-center">
      {data.eyebrow ? (
        <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-secondary-500">
          {data.eyebrow}
        </span>
      ) : null}
      <h3 className="my-2 font-heading text-[clamp(1.5rem,2.4vw,1.875rem)] font-bold leading-[1.15] tracking-tight">
        <BracketHighlight text={data.headline} highlightClass="text-primary" />
      </h3>
      {data.lede ? (
        <p className="mx-auto mb-6 max-w-[520px] leading-[1.5] text-crema-800">{data.lede}</p>
      ) : null}
      <div className="mb-6 inline-flex flex-wrap items-stretch gap-0 rounded-full border border-crema-200 bg-white p-1.5 shadow-sm">
        {data.firstVisitLabel ? (
          <div className="flex items-baseline gap-2 px-5 py-2.5">
            <span className="text-sm font-semibold text-crema-800">{data.firstVisitLabel}</span>
            <span className="font-heading text-2xl font-bold tracking-tight text-primary">
              {data.firstVisitPrice}
            </span>
          </div>
        ) : null}
        <div className="my-auto h-6 w-px bg-crema-200" aria-hidden="true" />
        {data.followUpLabel ? (
          <div className="flex items-baseline gap-2 px-5 py-2.5">
            <span className="text-sm font-semibold text-crema-800">{data.followUpLabel}</span>
            <span className="font-heading text-2xl font-bold tracking-tight text-secondary-500">
              {data.followUpPrice}
            </span>
          </div>
        ) : null}
      </div>
      <div className="flex flex-wrap items-center justify-center gap-4">
        <CtaButton
          text={data.ctaText}
          url={data.ctaUrl}
          newTab={data.ctaNewTab}
          className="group inline-flex items-center gap-2.5 whitespace-nowrap rounded-full bg-primary px-6 py-3.5 text-base font-bold text-white shadow-[0_4px_12px_rgba(232,71,30,0.22)] transition hover:scale-[1.03] hover:shadow-[0_8px_20px_rgba(232,71,30,0.32)]"
        />
        {data.secondaryLinkText && data.secondaryLinkUrl ? (
          <Link
            href={data.secondaryLinkUrl}
            className="text-sm font-semibold text-crema-800 underline decoration-crema-200 underline-offset-[4px] hover:text-secondary-500"
          >
            {data.secondaryLinkText}
          </Link>
        ) : null}
      </div>
    </article>
  );
}

export default function PricingTeaser({ data }: PricingTeaserProps) {
  const variant = data.variant || "card";
  const Variant = variant === "band" ? BandVariant : variant === "inline" ? InlineVariant : CardVariant;

  return (
    <section className="relative overflow-hidden px-6 py-24">
      <FloatingFood
        items={data.decoration}
        positions={COMPACT_FLOAT_POSITIONS}
        size={84}
        opacity={0.55}
      />
      <div className="relative z-10 mx-auto max-w-[1180px]">
        <Variant data={data} />
      </div>
    </section>
  );
}
