import { Fragment } from "react";

interface BracketHighlightProps {
  text?: string;
  highlightClass: string;
}

export default function BracketHighlight({ text, highlightClass }: BracketHighlightProps) {
  if (!text) return null;
  const parts = text.split(/(\[[^\]]+\])/g);
  return (
    <>
      {parts.map((p, i) =>
        p.startsWith("[") && p.endsWith("]") ? (
          <span key={i} className={highlightClass}>
            {p.slice(1, -1)}
          </span>
        ) : (
          <Fragment key={i}>{p}</Fragment>
        )
      )}
    </>
  );
}
