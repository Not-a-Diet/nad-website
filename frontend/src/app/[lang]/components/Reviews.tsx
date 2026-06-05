"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import Image from "next/image";
import BracketHighlight from "./BracketHighlight";
import { getStrapiMedia } from "../utils/api-helpers";

/* ---------- types ---------- */

type Platform = "google" | "trustpilot" | "instagram" | "facebook";

interface ReviewAvatar {
  url: string;
  alternativeText?: string;
}

interface Review {
  id: number | string;
  authorName: string;
  date?: string;
  rating: number;
  comment: string;
  platform: Platform;
  sourceUrl?: string;
  avatar?: ReviewAvatar | null;
}

interface ReviewsProps {
  data: {
    id: number | string;
    eyebrow?: string;
    title?: string;
    description?: string;
    variant?: "watermark" | "inline";
    showSummary?: boolean;
    summaryAverage?: number;
    summaryCount?: number;
    summaryLabel?: string;
    loop?: boolean;
    autoplay?: boolean;
    autoplayInterval?: number;
    reviews?: Review[];
  };
  lang?: string;
}

/* ---------- platform logos ---------- */

interface LogoProps {
  size?: number;
  mono?: boolean;
}

function GoogleLogo({ size = 22, mono = false }: LogoProps) {
  if (mono) {
    return (
      <svg width={size} height={size} viewBox="0 0 48 48" fill="currentColor" aria-hidden="true">
        <path d="M24 4C12.954 4 4 12.954 4 24s8.954 20 20 20c11.046 0 20-8.954 20-20 0-1.34-.135-2.65-.391-3.913H24v7.826h11.262C34.062 32.43 29.5 36 24 36c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.046 0 5.82 1.135 7.93 3.002l5.535-5.535C33.872 6.244 29.16 4 24 4z" />
      </svg>
    );
  }
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#4285F4" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.6-6 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.7 1.1 7.8 3l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c11 0 20-8.9 20-20 0-1.2-.1-2.3-.4-3.5z" />
      <path fill="#34A853" d="M6.3 14.7l6.6 4.8C14.6 16 19 13 24 13c3 0 5.7 1.1 7.8 3l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.6 8.3 6.3 14.7z" />
      <path fill="#FBBC04" d="M24 44c5.2 0 9.9-2 13.5-5.2l-6.2-5.2c-2 1.4-4.5 2.4-7.3 2.4-5.3 0-9.7-3.4-11.3-8l-6.5 5C9.4 39.6 16.2 44 24 44z" />
      <path fill="#EA4335" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.3-4.3 5.7l6.2 5.2C40.9 36 44 30.5 44 24c0-1.2-.1-2.3-.4-3.5z" />
    </svg>
  );
}

function TrustpilotLogo({ size = 22, mono = false }: LogoProps) {
  const fill = mono ? "currentColor" : "#00B67A";
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path fill={fill} d="M12 1.5l2.92 6.93L22.5 9.1l-5.74 4.9 1.78 7.5L12 17.55 5.46 21.5l1.78-7.5L1.5 9.1l7.58-.67L12 1.5z" />
    </svg>
  );
}

function InstagramLogo({ size = 22, mono = false }: LogoProps) {
  if (mono) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M7.5 2.5h9A5 5 0 0 1 21.5 7.5v9a5 5 0 0 1-5 5h-9a5 5 0 0 1-5-5v-9a5 5 0 0 1 5-5zm0 2A3 3 0 0 0 4.5 7.5v9a3 3 0 0 0 3 3h9a3 3 0 0 0 3-3v-9a3 3 0 0 0-3-3h-9zM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6zm5.6-2.6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
      </svg>
    );
  }
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <defs>
        <radialGradient id="igFill" cx="30%" cy="105%" r="120%">
          <stop offset="0%" stopColor="#FFDD55" />
          <stop offset="50%" stopColor="#FF543E" />
          <stop offset="100%" stopColor="#C837AB" />
        </radialGradient>
      </defs>
      <rect x="2" y="2" width="20" height="20" rx="5" fill="url(#igFill)" />
      <circle cx="12" cy="12" r="4.2" fill="none" stroke="#fff" strokeWidth="1.8" />
      <circle cx="17.4" cy="6.6" r="1.1" fill="#fff" />
    </svg>
  );
}

function FacebookLogo({ size = 22, mono = false }: LogoProps) {
  const fill = mono ? "currentColor" : "#1877F2";
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path fill={fill} d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06C2 17.1 5.66 21.27 10.44 22v-7.03H7.9v-2.9h2.54V9.85c0-2.51 1.49-3.9 3.77-3.9 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.87h2.77l-.44 2.9h-2.33V22C18.34 21.27 22 17.1 22 12.06z" />
    </svg>
  );
}

const PLATFORMS: Record<Platform, { name: string; Logo: (p: LogoProps) => React.ReactElement; tint: string }> = {
  google: { name: "Google", Logo: GoogleLogo, tint: "#4285F4" },
  trustpilot: { name: "Trustpilot", Logo: TrustpilotLogo, tint: "#00B67A" },
  instagram: { name: "Instagram", Logo: InstagramLogo, tint: "#C837AB" },
  facebook: { name: "Facebook", Logo: FacebookLogo, tint: "#1877F2" },
};

/* avatar background tints cycled by index (matches the brand "produce" hues) */
const AVATAR_TINTS = ["#ffedd5", "#dcfce7", "#fce4ec", "#fef9c3", "#cffafe"];

/* ---------- atoms ---------- */

function Stars({ value = 5 }: { value?: number }) {
  return (
    <div className="inline-flex gap-0.5" aria-label={`${value} out of 5 stars`}>
      {[0, 1, 2, 3, 4].map((i) => (
        <svg
          key={i}
          width="18"
          height="18"
          viewBox="0 0 24 24"
          className={i < value ? "text-tertiary-500" : "text-crema-200"}
          aria-hidden="true"
        >
          <path
            fill="currentColor"
            d="M12 2l2.92 6.93L22.5 9.6l-5.74 4.9 1.78 7.5L12 18.05 5.46 22l1.78-7.5L1.5 9.6l7.58-.67L12 2z"
          />
        </svg>
      ))}
    </div>
  );
}

function PlatformChip({ platform }: { platform: Platform }) {
  const meta = PLATFORMS[platform];
  if (!meta) return null;
  const { Logo, name } = meta;
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-crema-200 bg-white py-1 pl-1.5 pr-2.5 text-xs font-semibold text-crema-500">
      <Logo size={16} />
      <span>via {name}</span>
    </span>
  );
}

function PlatformWatermark({ platform }: { platform: Platform }) {
  const meta = PLATFORMS[platform];
  if (!meta) return null;
  const { Logo } = meta;
  return (
    <div
      className="pointer-events-none absolute -bottom-8 -right-7 z-[1] rotate-[-6deg] opacity-10 transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] [&>svg]:block group-hover:opacity-[0.18] group-hover:-translate-x-1 group-hover:-translate-y-1 motion-reduce:transition-none"
      style={{ color: meta.tint }}
      aria-hidden="true"
    >
      <Logo size={150} mono />
    </div>
  );
}

/* ---------- card ---------- */

function ReviewCard({
  review,
  variant,
  tint,
  lang,
}: {
  review: Review;
  variant: "watermark" | "inline";
  tint: string;
  lang?: string;
}) {
  const initials = review.authorName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);

  const avatarUrl = getStrapiMedia(review.avatar?.url);
  const dateLabel = review.date
    ? new Intl.DateTimeFormat(lang || "en", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(new Date(review.date))
    : null;

  return (
    <article data-rv-card className="group relative flex min-h-[280px] snap-start flex-col gap-4 overflow-hidden rounded-3xl border-2 border-crema-200 bg-anti-flash_white p-6 pb-4 transition-[transform,box-shadow,border-color] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] hover:-translate-y-0.5 hover:border-secondary-100 hover:shadow-xl motion-reduce:transition-none">
      <header className="relative z-[2] flex items-center justify-between gap-3">
        <Stars value={review.rating} />
        {variant === "inline" && <PlatformChip platform={review.platform} />}
      </header>

      <p className="relative z-[2] m-0 flex-1 text-base leading-[1.55] text-crema-800">
        <span
          className="mb-1.5 -ml-1 block font-heading text-[56px] font-bold leading-[0.7] text-primary"
          aria-hidden="true"
        >
          &ldquo;
        </span>
        {review.comment}
      </p>

      <footer className="relative z-[2] flex items-center justify-between gap-3 border-t border-crema-200 pt-3">
        <div className="flex min-w-0 items-center gap-3">
          {avatarUrl ? (
            <Image
              src={avatarUrl}
              alt={review.avatar?.alternativeText || review.authorName}
              width={40}
              height={40}
              className="h-10 w-10 shrink-0 rounded-full object-cover"
              loading="lazy"
            />
          ) : (
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold tracking-[0.02em] text-crema"
              style={{ background: tint }}
            >
              {initials}
            </div>
          )}
          <div className="min-w-0">
            <p className="m-0 truncate text-sm font-bold text-crema">
              {review.sourceUrl ? (
                <a
                  href={review.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="hover:underline"
                >
                  {review.authorName}
                </a>
              ) : (
                review.authorName
              )}
            </p>
            {dateLabel && <p className="m-0 text-xs text-crema-500">{dateLabel}</p>}
          </div>
        </div>
      </footer>

      {variant === "watermark" && (
        <>
          {/* radial fade so the comment stays legible over the mark */}
          <div className="pointer-events-none absolute bottom-0 right-0 z-[1] h-[70%] w-[70%] bg-[radial-gradient(ellipse_at_bottom_right,transparent_0%,#ffffff_70%)]" />
          <PlatformWatermark platform={review.platform} />
        </>
      )}
    </article>
  );
}

/* ---------- section ---------- */

export default function Reviews({ data, lang }: Readonly<ReviewsProps>) {
  const reviews = data.reviews ?? [];
  const variant = data.variant ?? "watermark";

  const loop = data.loop ?? false;
  const autoplay = data.autoplay ?? false;
  const autoplayMs = Math.max(2, data.autoplayInterval ?? 5) * 1000;

  const trackRef = useRef<HTMLDivElement>(null);
  const pageRef = useRef(0);
  const [page, setPage] = useState(0);
  const [pageCount, setPageCount] = useState(1);
  const [paused, setPaused] = useState(false);

  const measure = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector<HTMLElement>("[data-rv-card]");
    if (!card) return;
    const style = getComputedStyle(track);
    const gap = parseFloat(style.columnGap || style.gap || "0");
    const cardW = card.offsetWidth + gap;
    const perPage = Math.max(1, Math.round((track.clientWidth + gap) / cardW));
    const pages = Math.max(1, Math.ceil(reviews.length / perPage));
    setPageCount(pages);
    setPage((p) => Math.min(p, pages - 1));
  }, [reviews.length]);

  useLayoutEffect(() => {
    measure();
  }, [measure]);

  useEffect(() => {
    const ro = new ResizeObserver(measure);
    if (trackRef.current) ro.observe(trackRef.current);
    return () => ro.disconnect();
  }, [measure]);

  const scrollTo = (newPage: number) => {
    const track = trackRef.current;
    if (!track) return;
    const clamped = Math.max(0, Math.min(pageCount - 1, newPage));
    setPage(clamped);
    track.scrollTo({ left: clamped * track.clientWidth, behavior: "smooth" });
  };

  // Arrow nav. With `loop` on, wrap past the edges (last → first, first → last).
  const goPrev = () => scrollTo(loop && page === 0 ? pageCount - 1 : page - 1);
  const goNext = () => scrollTo(loop && page >= pageCount - 1 ? 0 : page + 1);

  const onScroll = () => {
    const track = trackRef.current;
    if (!track) return;
    const p = Math.round(track.scrollLeft / track.clientWidth);
    if (p !== page) setPage(p);
  };

  // keep latest page in a ref so the autoplay timer reads it without resetting
  useEffect(() => {
    pageRef.current = page;
  }, [page]);

  // Infinite autoplay: advance one page on a timer, loop back to the first.
  // Pauses on hover/focus; skipped for reduced-motion users and single page.
  useEffect(() => {
    if (!autoplay || paused || pageCount <= 1) return;
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    const id = setInterval(() => {
      const track = trackRef.current;
      if (!track) return;
      const next = pageRef.current >= pageCount - 1 ? 0 : pageRef.current + 1;
      setPage(next);
      track.scrollTo({ left: next * track.clientWidth, behavior: "smooth" });
    }, autoplayMs);
    return () => clearInterval(id);
  }, [autoplay, paused, pageCount, autoplayMs]);

  if (reviews.length === 0) return null;

  const summary = data.showSummary && data.summaryAverage != null
    ? { average: data.summaryAverage, count: data.summaryCount, label: data.summaryLabel }
    : null;

  return (
    <section className="w-full bg-anti-flash_white px-6 py-20 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-[1240px]">
        {/* Header */}
        <div className="mb-12 flex flex-wrap items-end justify-between gap-12">
          <div className="max-w-[640px]">
            {data.eyebrow && (
              <p className="m-0 mb-3 text-sm font-bold uppercase tracking-[0.12em] text-secondary-500">
                {data.eyebrow}
              </p>
            )}
            {data.title && (
              <h2 className="m-0 mb-4 text-balance font-heading text-[clamp(2rem,3.6vw,2.25rem)] font-bold leading-[1.05] tracking-[-0.01em] text-crema">
                <BracketHighlight text={data.title} highlightClass="text-primary" />
              </h2>
            )}
            {data.description && (
              <p className="m-0 text-pretty text-lg leading-[1.5] text-crema-500">
                {data.description}
              </p>
            )}
          </div>

          {summary && (
            <div className="flex min-w-[240px] flex-col gap-1.5 rounded-3xl border-2 border-secondary-100 bg-anti-flash_white px-6 py-4">
              <Stars value={Math.round(summary.average)} />
              <p className="m-0 text-base text-crema-500">
                <strong className="text-2xl font-bold text-crema">
                  {summary.average.toFixed(1)}
                </strong>{" "}
                out of 5
              </p>
              {summary.label && (
                <p className="m-0 text-xs text-crema-500">
                  {summary.count ? `${summary.count}+ ` : ""}
                  {summary.label}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Carousel */}
        <div
          className="relative"
          onMouseEnter={autoplay ? () => setPaused(true) : undefined}
          onMouseLeave={autoplay ? () => setPaused(false) : undefined}
          onFocusCapture={autoplay ? () => setPaused(true) : undefined}
          onBlurCapture={autoplay ? () => setPaused(false) : undefined}
        >
          <div
            ref={trackRef}
            onScroll={onScroll}
            className="-m-2 grid snap-x snap-mandatory auto-cols-[calc(100%_-_2rem)] grid-flow-col gap-6 overflow-x-auto overflow-y-hidden p-2 [-ms-overflow-style:none] [scrollbar-width:none] sm:auto-cols-[calc((100%_-_1.5rem)/2)] lg:auto-cols-[calc((100%_-_3rem)/3)] [&::-webkit-scrollbar]:hidden"
          >
            {reviews.map((r, i) => (
              <ReviewCard
                key={r.id ?? i}
                review={r}
                variant={variant}
                tint={AVATAR_TINTS[i % AVATAR_TINTS.length]}
                lang={lang}
              />
            ))}
          </div>

          {/* Controls */}
          {pageCount > 1 && (
            <div className="mt-8 flex items-center justify-between gap-6">
              <div className="flex items-center gap-2" role="tablist" aria-label="Review pages">
                {Array.from({ length: pageCount }).map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => scrollTo(i)}
                    aria-label={`Go to page ${i + 1}`}
                    aria-selected={i === page}
                    className={`h-2 cursor-pointer rounded-full border-0 transition-[background,width] duration-300 ${
                      i === page ? "w-6 bg-primary" : "w-2 bg-crema-200 hover:bg-crema-500"
                    }`}
                  />
                ))}
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={goPrev}
                  disabled={!loop && page === 0}
                  aria-label="Previous reviews"
                  className="inline-flex h-12 w-12 items-center justify-center rounded-full border-2 border-crema bg-anti-flash_white text-crema transition-[background,color,transform] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] enabled:hover:scale-105 enabled:hover:bg-crema enabled:hover:text-white disabled:cursor-not-allowed disabled:border-crema-200 disabled:text-crema-500 disabled:opacity-35 motion-reduce:transition-none"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M15 18l-6-6 6-6" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={goNext}
                  disabled={!loop && page >= pageCount - 1}
                  aria-label="Next reviews"
                  className="inline-flex h-12 w-12 items-center justify-center rounded-full border-2 border-crema bg-anti-flash_white text-crema transition-[background,color,transform] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] enabled:hover:scale-105 enabled:hover:bg-crema enabled:hover:text-white disabled:cursor-not-allowed disabled:border-crema-200 disabled:text-crema-500 disabled:opacity-35 motion-reduce:transition-none"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M9 6l6 6-6 6" />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
