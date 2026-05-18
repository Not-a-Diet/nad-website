interface PriceDisplayProps {
  variant: "pill" | "cell";
  num: string;
  accent: "primary" | "secondary";
  name?: string;
  sub?: string;
  price?: string;
  meta?: string;
}

export default function PriceDisplay({
  variant,
  num,
  accent,
  name,
  sub,
  price,
  meta,
}: PriceDisplayProps) {
  if (!name && !price) return null;
  const accentBg = accent === "primary" ? "bg-primary" : "bg-secondary-500";
  const cleanPrice = (price || "").replace(/^€\s?/, "").trim();

  if (variant === "pill") {
    return (
      <div className="inline-flex flex-col rounded-2xl border border-crema-200 bg-white px-5 py-4 min-w-[168px] transition hover:-translate-y-0.5 hover:shadow-md">
        <span className="mb-1.5 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.08em] text-crema-800">
          <span
            className={`inline-flex h-[18px] w-[18px] items-center justify-center rounded-full text-[10px] text-white ${accentBg}`}
          >
            {num}
          </span>
          {name}
        </span>
        <span className="flex items-baseline gap-1 font-heading tracking-tight">
          <span className="text-base font-semibold text-crema-800">€</span>
          <span className="text-3xl font-bold leading-none">{cleanPrice}</span>
        </span>
        {meta ? <span className="mt-1 text-xs text-crema-500">{meta}</span> : null}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 px-8 py-8 md:px-10">
      <div className="flex items-center gap-2.5 text-crema-800">
        <span
          className={`inline-flex h-[26px] w-[26px] items-center justify-center rounded-full text-sm font-bold text-white ${accentBg}`}
        >
          {num}
        </span>
        <span className="text-lg font-bold">{name}</span>
      </div>
      {sub ? (
        <p className="m-0 max-w-[360px] text-sm leading-[1.45] text-crema-500">{sub}</p>
      ) : null}
      <div className="mt-auto flex items-baseline gap-1.5">
        <span className="-translate-y-2.5 text-2xl font-semibold text-crema-800">€</span>
        <span className="font-heading text-[3rem] font-bold leading-none tracking-[-0.03em]">
          {cleanPrice}
        </span>
      </div>
      {meta ? <span className="text-sm text-crema-500">{meta}</span> : null}
    </div>
  );
}
