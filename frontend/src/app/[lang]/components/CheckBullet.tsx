interface CheckBulletProps {
  accentClass: string;
}

export default function CheckBullet({ accentClass }: CheckBulletProps) {
  return (
    <span
      aria-hidden="true"
      className={`mt-0.5 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full text-white ${accentClass}`}
    >
      <svg viewBox="0 0 12 12" fill="none" className="h-2.5 w-2.5">
        <path
          d="M2 6.5 5 9l5-6"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}
