import Image from "next/image";
import BracketHighlight from "./BracketHighlight";
import CheckBullet from "./CheckBullet";
import FloatingFood, { COMPACT_FLOAT_POSITIONS } from "./FloatingFood";
import { getStrapiMedia } from "../utils/api-helpers";
import { splitLines } from "../utils/split-lines";

interface MediaItem {
  id: number | string;
  url: string;
  alternativeText?: string | null;
}

interface PricingList {
  id: string;
  heading?: string;
  items?: string;
}

interface PricingStep {
  id: string;
  stepNumber?: string;
  title?: string;
  lede?: string;
  image?: MediaItem | null;
  imagePlaceholder?: string;
  stickerText?: string;
  durationLabel?: string;
  durationValue?: string;
  modeLabel?: string;
  modeValue?: string;
  priceLabel?: string;
  priceValue?: string;
  lists?: PricingList[];
  callout?: string;
  reverse?: boolean;
  accent?: "primary" | "secondary";
}

interface PricingStepsData {
  id: string;
  structureTitle?: string;
  steps?: PricingStep[];
  decoration?: MediaItem[] | null;
}

interface PricingStepsProps {
  data: PricingStepsData;
}

function Step({ step, index }: { step: PricingStep; index: number }) {
  const accent = step.accent || (index === 0 ? "primary" : "secondary");
  const accentBg = accent === "primary" ? "bg-primary" : "bg-secondary-500";
  const accentText = accent === "primary" ? "text-primary" : "text-secondary-500";
  const accentBorder = accent === "primary" ? "border-l-primary" : "border-l-secondary-500";

  const imgUrl = step.image?.url ? getStrapiMedia(step.image.url) : null;

  return (
    <div className={`grid grid-cols-1 items-start gap-8 lg:grid-cols-2 lg:gap-14 ${step.reverse ? "lg:[&>.step-media]:order-2" : ""}`}>
      <div className="step-media relative">
        <span
          className={`absolute -left-5 -top-5 z-10 flex h-16 w-16 items-center justify-center rounded-full font-heading text-[1.75rem] font-bold text-white shadow-md ${accentBg}`}
        >
          {step.stepNumber || String(index + 1)}
        </span>
        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl bg-crema-200">
          {imgUrl ? (
            <Image
              src={imgUrl}
              alt={step.image?.alternativeText || step.title || ""}
              fill
              sizes="(max-width: 920px) 100vw, 50vw"
              className="object-cover"
            />
          ) : step.imagePlaceholder ? (
            <div className="flex h-full w-full items-center justify-center bg-anti-flash_white-100 px-6 text-center text-sm text-crema-500">
              {step.imagePlaceholder}
            </div>
          ) : null}
        </div>
        {step.stickerText ? (
          <span className="absolute bottom-4 right-4 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-sm font-semibold shadow-md">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className={accentText}>
              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
              <path d="M12 7v5l3 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            {step.stickerText}
          </span>
        ) : null}
      </div>

      <div>
        {step.title ? (
          <h3 className="m-0 mb-3.5 font-heading text-[clamp(1.5rem,2.6vw,1.875rem)] font-bold leading-[1.15] tracking-tight">
            {step.title}
          </h3>
        ) : null}
        {step.lede ? (
          <p className="m-0 mb-7 text-lg leading-[1.5] text-crema-800">{step.lede}</p>
        ) : null}

        {(step.durationValue || step.modeValue || step.priceValue) ? (
          <div className="mb-7 flex flex-wrap gap-8 border-y border-crema-200 py-4">
            {step.durationValue ? (
              <div>
                <div className="mb-1 text-xs font-bold uppercase tracking-[0.12em] text-crema-500">
                  {step.durationLabel || "Durata"}
                </div>
                <div className="text-lg font-bold">{step.durationValue}</div>
              </div>
            ) : null}
            {step.modeValue ? (
              <div>
                <div className="mb-1 text-xs font-bold uppercase tracking-[0.12em] text-crema-500">
                  {step.modeLabel || "Modalità"}
                </div>
                <div className="text-lg font-bold">{step.modeValue}</div>
              </div>
            ) : null}
            {step.priceValue ? (
              <div>
                <div className="mb-1 text-xs font-bold uppercase tracking-[0.12em] text-crema-500">
                  {step.priceLabel || "Prezzo"}
                </div>
                <div className={`text-lg font-bold ${accentText}`}>{step.priceValue}</div>
              </div>
            ) : null}
          </div>
        ) : null}

        {(step.lists || []).map((list) => {
          const items = splitLines(list.items);
          if (!items.length) return null;
          return (
            <div key={list.id} className="mb-6 last:mb-0">
              {list.heading ? (
                <h4 className="m-0 mb-3 text-sm font-bold uppercase tracking-[0.08em] text-crema-800">
                  {list.heading}
                </h4>
              ) : null}
              <ul className="m-0 flex list-none flex-col gap-2.5 p-0">
                {items.map((item, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 text-base leading-[1.5] text-crema-800"
                  >
                    <CheckBullet accentClass={accentBg} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}

        {step.callout ? (
          <div
            className={`mt-6 rounded-2xl border-l-4 bg-anti-flash_white-100 p-5 text-sm leading-[1.55] text-crema-800 ${accentBorder}`}
          >
            {step.callout}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default function PricingSteps({ data }: PricingStepsProps) {
  if (!data.structureTitle && (!data.steps || data.steps.length === 0)) return null;

  return (
    <section className="relative overflow-hidden bg-white py-20 lg:py-24" id="structure">
      <FloatingFood
        items={data.decoration}
        positions={COMPACT_FLOAT_POSITIONS}
        size={100}
        opacity={0.55}
      />
      <div className="relative z-10 mx-auto max-w-[1180px] px-6">
        {data.structureTitle ? (
          <div className="mx-auto mb-14 max-w-[760px] text-center">
            <h2 className="m-0 font-heading text-[clamp(1.75rem,3.6vw,2.25rem)] font-bold leading-[1.1] tracking-tight">
              <BracketHighlight
                text={data.structureTitle}
                highlightClass="text-secondary-500"
              />
            </h2>
          </div>
        ) : null}

        <div className="flex flex-col gap-24">
          {(data.steps || []).map((step, index) => (
            <Step key={step.id} step={step} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
