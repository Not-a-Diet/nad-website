import Link from "next/link";
import { ReactNode } from "react";
import ArrowIcon from "./ArrowIcon";

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
      <ArrowIcon
        direction={arrow === "↗" ? "up-right" : "right"}
        className={`transition-transform group-hover:translate-x-[3px] ${arrow === "↗" ? "group-hover:-translate-y-[3px]" : ""}`}
      />
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
