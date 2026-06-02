"use client";

import { useCallback, useState } from "react";
import BracketHighlight from "./BracketHighlight";

interface FaqItem {
  id: number | string;
  question: string;
  answer: string;
}

interface FaqProps {
  data: {
    id: number | string;
    eyebrow?: string;
    title?: string;
    subtitle?: string;
    openMode?: "single" | "multi";
    ctaNote?: string;
    ctaText?: string;
    ctaUrl?: string;
    items?: FaqItem[];
  };
}

/** Split a textarea answer into paragraphs on blank lines. */
function toParagraphs(answer: string): string[] {
  return answer
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);
}

/** Flatten an answer to a single string for the FAQPage JSON-LD acceptedAnswer. */
function toPlainText(answer: string): string {
  return answer.replace(/\s+/g, " ").trim();
}

function Chevron() {
  return (
    <svg
      className="chev h-[18px] w-[18px] shrink-0 text-crema-500 transition-[transform,color] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] group-data-[open=true]:rotate-180 group-data-[open=true]:text-quaternary-rose motion-reduce:transition-none"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M6 9 l6 6 l6 -6" />
    </svg>
  );
}

export default function Faq({ data }: Readonly<FaqProps>) {
  const items = data.items ?? [];
  const mode = data.openMode ?? "single";
  const hasFooter = Boolean(data.ctaNote || data.ctaText);

  const [openSet, setOpenSet] = useState<Set<number>>(() => new Set());
  const toggle = useCallback(
    (i: number) => {
      setOpenSet((prev) => {
        const next = new Set(prev);
        if (next.has(i)) {
          next.delete(i);
        } else {
          if (mode === "single") next.clear();
          next.add(i);
        }
        return next;
      });
    },
    [mode]
  );

  const idPrefix = `faq-${data.id}`;

  // FAQPage JSON-LD — this component is the SINGLE source of FAQPage structured
  // data (decision: keep it inline). It works on home pages and inside article
  // `blocks`. No images/URLs here, so no localhost-leak risk the SEO plan flags
  // for media-bearing schema. Phase 2's centralized `faqSchema()` / `<JsonLd>`
  // must NOT also emit FAQPage for pages that render this section — let the
  // page-level builder skip self-emitting FAQ sections to avoid duplicates.
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((it) => ({
      "@type": "Question",
      name: it.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: toPlainText(it.answer),
      },
    })),
  };

  return (
    <section
      className="faq-v1 w-full px-6 py-14 lg:px-8 lg:py-20"
      aria-labelledby={items.length ? `${idPrefix}-title` : undefined}
    >
      <div className="mx-auto max-w-[1180px]">
      {items.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
        />
      )}

      {/* Header */}
      {(data.eyebrow || data.title || data.subtitle) && (
        <div className="mb-9 max-w-[720px]">
          {data.eyebrow && (
            <p className="m-0 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-quaternary-rose">
              <span className="inline-block h-[6px] w-[6px] rounded-full bg-quaternary-rose" />
              {data.eyebrow}
            </p>
          )}
          {data.title && (
            <h2
              id={`${idPrefix}-title`}
              className="mb-3 mt-3.5 text-balance font-heading text-[clamp(1.875rem,3.4vw,2.5rem)] font-bold leading-[1.05] tracking-[-0.015em] text-crema"
            >
              <BracketHighlight text={data.title} highlightClass="text-quaternary-rose" />
            </h2>
          )}
          {data.subtitle && (
            <p className="m-0 max-w-[56ch] text-pretty text-[1.0625rem] leading-[1.55] text-crema-500">
              {data.subtitle}
            </p>
          )}
        </div>
      )}

      {/* Hairline-divided list */}
      <ul className="m-0 list-none border-t border-crema-200 p-0">
        {items.map((item, i) => {
          const isOpen = openSet.has(i);
          const btnId = `${idPrefix}-q${i}`;
          const panelId = `${idPrefix}-p${i}`;
          return (
            <li
              key={item.id ?? i}
              data-open={isOpen ? "true" : "false"}
              className={`group border-b border-crema-200${hasFooter ? " last:border-b-0" : ""}`}
            >
              <h3 className="m-0 text-[length:inherit] font-[inherit]">
                <button
                  type="button"
                  id={btnId}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => toggle(i)}
                  className="flex w-full cursor-pointer items-start gap-6 px-1 py-[22px] text-left text-[1.0625rem] font-semibold leading-[1.4] text-crema transition-colors duration-150 ease-[cubic-bezier(0.4,0,0.2,1)] hover:text-quaternary-rose focus:outline-none focus-visible:rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-quaternary-rose"
                >
                  <span className="flex-1">{item.question}</span>
                  <Chevron />
                </button>
              </h3>
              <div
                id={panelId}
                role="region"
                aria-labelledby={btnId}
                aria-hidden={!isOpen}
                className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] group-data-[open=true]:grid-rows-[1fr] motion-reduce:transition-none"
              >
                <div className="min-h-0 overflow-hidden">
                  <div className="pb-[22px] pl-1 pr-14">
                    {toParagraphs(item.answer).map((para, p) => (
                      <p
                        key={p}
                        className="m-0 text-pretty text-base leading-[1.6] text-crema-800 [&+p]:mt-[0.65em]"
                      >
                        {para}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      {/* Footer CTA */}
      {hasFooter && (
        <div className="mt-10 flex flex-wrap items-center gap-[18px] border-t border-crema-200 pt-7">
          {data.ctaNote && (
            <p className="m-0 text-[0.9375rem] text-crema-500">{data.ctaNote}</p>
          )}
          {data.ctaText && data.ctaUrl && (
            <a
              href={data.ctaUrl}
              className="inline-flex items-center gap-2.5 rounded-full bg-crema px-5 py-[11px] text-sm font-semibold text-white transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] hover:scale-[1.04] motion-reduce:transition-none"
            >
              {data.ctaText}
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M5 12 h14" />
                <path d="M13 5 l7 7 l-7 7" />
              </svg>
            </a>
          )}
        </div>
      )}
      </div>
    </section>
  );
}
