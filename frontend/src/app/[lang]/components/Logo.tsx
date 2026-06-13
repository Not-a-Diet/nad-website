import Link from "next/link";
import Image from "next/image";

export default function Logo({
  src,
  children,
  lang = "en",
}: {
  src: string | null;
  children?: React.ReactNode;
  /** Current locale — used to build a redirect-free home link. */
  lang?: string;
}) {
  return (
    <Link
      href={`/${lang}`}
      aria-label="Not a Diet - Back to homepage"
      className="flex items-center p-2"
    >
      {src && <Image src={src} alt="logo" width={75} height={75} />}
      <div>{children}</div>
    </Link>
  );
}
