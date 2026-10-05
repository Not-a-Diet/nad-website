interface ArrowIconProps {
  direction?: "right" | "left" | "up-right";
  size?: number;
  className?: string;
}

export default function ArrowIcon({ direction = "right", size = 14, className = "" }: ArrowIconProps) {
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`shrink-0 ${className}`}
    >
      <g transform={direction === "left" ? "rotate(180 12 12)" : direction === "up-right" ? "rotate(-45 12 12)" : undefined}>
        <path d="M5 12 h14" />
        <path d="M13 5 l7 7 l-7 7" />
      </g>
    </svg>
  );
}
