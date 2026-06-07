import Link from "next/link";
import { ReactNode } from "react";

interface CtaButtonProps {
  text?: string;
  url?: string;
  newTab?: boolean;
  className: string;
  arrow?: "→" | "↗" | "none";
}

export default function CtaButton({
  text,
  url,
  newTab,
  className,
  arrow = "→",
}: CtaButtonProps) {
  if (!text) return null;
  const arrowEl: ReactNode =
    arrow === "none" ? null : (
      <svg
        aria-hidden="true"
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`shrink-0 transition-transform group-hover:translate-x-[3px] ${arrow === "↗" ? "group-hover:-translate-y-[3px]" : ""}`}
      >
        {arrow === "↗" ? (
          <>
            <path d="M7 17 L17 7" />
            <path d="M8 7 h9 v9" />
          </>
        ) : (
          <>
            <path d="M5 12 h14" />
            <path d="M13 5 l7 7 l-7 7" />
          </>
        )}
      </svg>
    );
  const inner = (
    <>
      {text}
      {arrowEl}
    </>
  );
  if (!url) {
    return <span className={className}>{inner}</span>;
  }
  return (
    <Link
      href={url}
      target={newTab ? "_blank" : "_self"}
      rel={newTab ? "noopener noreferrer" : undefined}
      className={className}
    >
      {inner}
    </Link>
  );
}
