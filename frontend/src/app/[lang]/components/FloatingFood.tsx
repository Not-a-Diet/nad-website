import Image from "next/image";
import { getStrapiMedia } from "../utils/api-helpers";

export interface FloatingFoodItem {
  id: number | string;
  url: string;
  alternativeText?: string | null;
}

interface FloatingFoodProps {
  items: FloatingFoodItem[] | null | undefined;
  positions?: string[];
  animations?: string[];
  size?: number;
  opacity?: number;
  saturate?: boolean;
}

// Shared "rings" used across sections. Keeping these centralised makes the
// floating mascots feel like one family rather than a random scattering.
//
// The site's Navbar is `fixed top-0` with ~96px of vertical footprint, so any
// "top" position must clear that — we use `top-32` (128px) as the minimum.
// Sections also have their own padding, so we keep items inside the section
// box rather than against its edge to avoid clipping under `overflow-hidden`.

// Tall sections (Hero ≈ 90vh) — four items, spread to the four corners.
export const DEFAULT_FLOAT_POSITIONS = [
  "top-32 left-4 lg:left-[8%]",
  "top-32 right-4 lg:right-[8%]",
  "bottom-24 left-4 lg:left-[10%]",
  "bottom-24 right-4 lg:right-[10%]",
];

// Compact sections (PricingTeaser, PricingServiceCard, PricingSteps) — only two items, placed
// diagonally so they don't crowd the central card.
export const COMPACT_FLOAT_POSITIONS = [
  "top-10 left-4 lg:left-[6%]",
  "bottom-10 right-4 lg:right-[6%]",
];

export const DEFAULT_FLOAT_ANIMATIONS = [
  "animate-float-slow",
  "animate-float-medium",
  "animate-float-fast",
  "animate-float-medium",
];

export default function FloatingFood({
  items,
  positions = DEFAULT_FLOAT_POSITIONS,
  animations = DEFAULT_FLOAT_ANIMATIONS,
  size = 110,
  opacity = 1.0,
  saturate = false,
}: FloatingFoodProps) {
  const valid = (items ?? []).filter((i) => i?.url);
  if (!valid.length) return null;

  return (
    <>
      {valid.slice(0, positions.length).map((item, index) => {
        const url = getStrapiMedia(item.url);
        if (!url) return null;
        return (
          <span
            key={item.id ?? index}
            aria-hidden="true"
            className={`pointer-events-none absolute z-0 ${positions[index]} ${animations[index % animations.length]} ${saturate ? "saturate-150" : ""}`}
            style={{ opacity }}
          >
            <Image
              src={url}
              alt={item.alternativeText || ""}
              width={size}
              height={size}
              loading="lazy"
              className="select-none"
            />
          </span>
        );
      })}
    </>
  );
}
