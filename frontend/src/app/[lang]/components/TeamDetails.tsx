import Image from "next/image";
import Link from "next/link";
import { getStrapiMedia } from "../utils/api-helpers";

export interface TeamProfileCardItem {
  label: string;
  value?: string;
  description?: string;
}

export interface TeamProfileSpecialization {
  title: string;
  description?: string;
}

export interface TeamProfileLink {
  label?: string;
  text?: string;
  href?: string;
  url?: string;
  social?: string;
  newTab?: boolean;
}

type TeamProfilePill = TeamProfileCardItem | string;

export interface TeamProfile {
  slug: string;
  name: string;
  role?: string;
  occupation?: string;
  description?: string;
  extendedBio?: string;
  philosophy?: string;
  credentials?: TeamProfileCardItem[];
  trustPills?: TeamProfilePill[];
  specializations?: TeamProfileSpecialization[];
  locations?: TeamProfileCardItem[];
  languages?: TeamProfileCardItem[];
  socials?: TeamProfileLink[];
  ctaLabel?: string;
  ctaHref?: string;
  localizations?: Array<{
    locale?: string;
    slug?: string;
  }>;
  profilePhoto?: {
    url?: string;
    alternativeText?: string;
    formats?: {
      large?: { url?: string };
      medium?: { url?: string };
      small?: { url?: string };
      thumbnail?: { url?: string };
    };
  } | null;
}

interface Props {
  lang: string;
  member: TeamProfile;
}

const labels = {
  en: {
    home: "Home",
    team: "Team",
    profileType: "Dietista",
    approach: "My approach",
    specializations: "Specializations",
    credentials: "Credentials",
    locations: "Consultation locations",
    ctaTitle: "Ready to start?",
    ctaText: "Book a consultation with Vanessa — in person or online.",
    book: "Book a consultation",
    whatsapp: "Contact via WhatsApp",
    education: "Education",
    register: "Professional register",
    languages: "Languages",
  },
  it: {
    home: "Home",
    team: "Team",
    profileType: "Dietista",
    approach: "Il mio approccio",
    specializations: "Specializzazioni",
    credentials: "Credenziali",
    locations: "Luoghi di consulenza",
    ctaTitle: "Pronta a iniziare?",
    ctaText: "Prenota una consulenza con Vanessa — in presenza o online.",
    book: "Prenota una consulenza",
    whatsapp: "Contatta via WhatsApp",
    education: "Formazione",
    register: "Albo professionale",
    languages: "Lingue",
  },
  pt: {
    home: "Home",
    team: "Equipa",
    profileType: "Dietista",
    approach: "A minha abordagem",
    specializations: "Especializações",
    credentials: "Credenciais",
    locations: "Locais de consulta",
    ctaTitle: "Pronta para começar?",
    ctaText: "Marque uma consulta com Vanessa — presencialmente ou online.",
    book: "Marcar consulta",
    whatsapp: "Contactar por WhatsApp",
    education: "Formação",
    register: "Registo profissional",
    languages: "Idiomas",
  },
} as const;

function localeCopy(lang: string) {
  return labels[lang as keyof typeof labels] ?? labels.en;
}

function textFrom(item?: TeamProfileCardItem) {
  if (!item) return "";
  return [item.value ?? item.label, item.description].filter(Boolean).join(" — ");
}

function pillText(item: TeamProfilePill) {
  return typeof item === "string" ? item : textFrom(item);
}

function profileImage(member: TeamProfile) {
  return getStrapiMedia(
    member.profilePhoto?.formats?.medium?.url ??
      member.profilePhoto?.formats?.small?.url ??
      member.profilePhoto?.url,
  );
}

function linkHref(link?: TeamProfileLink) {
  return link?.href ?? link?.url ?? "";
}

function linkText(link?: TeamProfileLink) {
  return link?.label ?? link?.text ?? "";
}

function findContact(member: TeamProfile, social: string) {
  return member.socials?.find((link) => link.social?.toLowerCase() === social);
}

function looksLikeHtml(value: string) {
  return /<\/?[a-z][\s\S]*>/i.test(value);
}

function CredentialIcon({ type }: { type: "education" | "register" | "languages" }) {
  if (type === "register") {
    return (
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-orange-100 text-orange-500">
        <svg aria-hidden="true" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path d="M12 3 5 6v5c0 4.5 3 8.5 7 10 4-1.5 7-5.5 7-10V6l-7-3Z" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      </span>
    );
  }

  if (type === "languages") {
    return (
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-yellow-100 text-yellow-600">
        <svg aria-hidden="true" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18M12 3c2.3 2.4 3.5 5.4 3.5 9S14.3 18.6 12 21c-2.3-2.4-3.5-5.4-3.5-9S9.7 5.4 12 3Z" />
        </svg>
      </span>
    );
  }

  return (
    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-green-100 text-green-500">
      <svg aria-hidden="true" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path d="M12 14 3 9l9-5 9 5-9 5Z" />
        <path d="m6 11.5-3 1.7L12 18l9-4.8-3-1.7" />
      </svg>
    </span>
  );
}

function ChipIcon({ index }: { index: number }) {
  const icons = [
    <path key="education" d="M12 14 4 10l8-4 8 4-8 4Z" />,
    <path key="shield" d="M12 3 5 6v5c0 4.5 3 8.5 7 10 4-1.5 7-5.5 7-10V6l-7-3Z" />,
    <path key="people" d="M8 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm8 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM4 20a4 4 0 0 1 8 0m0 0a4 4 0 0 1 8 0" />,
  ];

  return (
    <svg aria-hidden="true" className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      {icons[index % icons.length]}
    </svg>
  );
}

function splitCredentials(credentials: TeamProfileCardItem[] = [], copy: ReturnType<typeof localeCopy>) {
  const find = (patterns: RegExp[]) =>
    credentials.find((item) => patterns.some((pattern) => pattern.test(`${item.label} ${item.description ?? ""}`)));

  const education = find([/education/i, /formazione/i, /formação/i, /university/i, /universit/i, /universidade/i]);
  const register = find([/register/i, /albo/i, /ordine/i, /ondi/i, /registo/i, /ordem/i]);
  const languages = find([/language/i, /lingue/i, /idiomas/i, /italian/i, /italiano/i]);

  return [
    education && { type: "education" as const, heading: copy.education, body: textFrom(education) },
    register && { type: "register" as const, heading: copy.register, body: textFrom(register) },
    languages && { type: "languages" as const, heading: copy.languages, body: textFrom(languages) },
  ].filter(Boolean) as Array<{ type: "education" | "register" | "languages"; heading: string; body: string }>;
}

function BodyCopy({ value }: { value: string }) {
  if (looksLikeHtml(value)) {
    return (
      <div
        className="space-y-4 text-lg leading-8 text-crema-700"
        dangerouslySetInnerHTML={{ __html: value }}
      />
    );
  }

  return <p className="text-lg leading-8 text-crema-700">{value}</p>;
}

export default function TeamDetails({ lang, member }: Props) {
  const copy = localeCopy(lang);
  const photo = profileImage(member);
  const credentials = member.credentials?.filter((item) => item.label?.trim()) ?? [];
  const credentialCards = splitCredentials(credentials, copy);
  const chips = (member.trustPills?.length ? member.trustPills : credentials).slice(0, 4);
  const specializations = member.specializations?.filter((item) => item.title?.trim()) ?? [];
  const locations = member.locations?.filter((item) => item.label?.trim()) ?? [];
  const philosophy = member.philosophy?.trim();
  const approach = (member.extendedBio ?? member.description)?.trim();
  const role = member.role ?? member.occupation;
  const bookingLink = member.socials?.find((link) => link.social === "WEBSITE") ?? member.socials?.[0];
  const whatsappLink = findContact(member, "whatsapp");
  const bookingHref = member.ctaHref ?? linkHref(bookingLink);
  const bookingText = member.ctaLabel ?? copy.book;

  return (
    <div className="bg-white pt-24 text-crema-900">
      <nav className="mx-auto flex max-w-7xl items-center gap-3 px-6 py-6 text-sm text-crema-400 lg:px-16" aria-label="Breadcrumb">
        <Link href={`/${lang}`} className="transition hover:text-crema-700">
          {copy.home}
        </Link>
        <span aria-hidden="true">›</span>
        <Link href={`/${lang}/team`} className="transition hover:text-crema-700">
          {copy.team}
        </Link>
        <span aria-hidden="true">›</span>
        <span className="max-w-32 font-semibold leading-5 text-crema-800">{member.name}</span>
      </nav>

      <section className="mx-auto max-w-6xl px-6 pb-14 pt-6 text-center lg:px-16">
        <div className="mx-auto h-48 w-48 overflow-hidden rounded-full border-4 border-white bg-crema-100 shadow-lg ring-1 ring-crema-200">
          {photo ? (
            <Image
              src={photo}
              alt={member.profilePhoto?.alternativeText ?? member.name}
              width={192}
              height={192}
              className="h-full w-full object-cover"
              unoptimized
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-green-100 to-yellow-50 text-5xl font-bold text-green-500">
              {member.name.charAt(0)}
            </div>
          )}
        </div>

        <p className="mt-8 text-sm font-extrabold uppercase tracking-widest text-green-500">{copy.profileType}</p>
        <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-crema-900 md:text-5xl">{member.name}</h1>
        {role ? <p className="mt-4 text-xl font-bold text-green-500">{role}</p> : null}

        {chips.length > 0 ? (
          <ul className="mx-auto mt-8 grid max-w-5xl grid-cols-1 gap-3 text-sm font-semibold text-crema-700 sm:grid-cols-2 lg:grid-cols-3">
            {chips.map((item, index) => (
              <li
                key={`${pillText(item)}-${index}`}
                className={index === 0 ? "flex min-h-10 items-center justify-center gap-3 rounded-full border border-lime-400 bg-green-100/70 px-5 text-green-600" : "flex min-h-10 items-center justify-center gap-3 rounded-full border border-crema-200 bg-white px-5 shadow-sm"}
              >
                <ChipIcon index={index} />
                <span className="leading-tight">{pillText(item)}</span>
              </li>
            ))}
          </ul>
        ) : null}
      </section>

      {philosophy ? (
        <section className="mx-auto max-w-7xl px-6 lg:px-16">
          <figure className="rounded-[2rem] bg-gradient-to-br from-green-50 via-white to-yellow-50 px-8 py-12 text-center md:px-24">
            <blockquote className="mx-auto max-w-5xl text-2xl italic leading-relaxed text-crema-800 md:text-3xl">
              “{philosophy}”
            </blockquote>
            <figcaption className="mt-8 font-extrabold text-orange-500">— {member.name}</figcaption>
          </figure>
        </section>
      ) : null}

      <section className="mx-auto max-w-6xl px-6 py-16 lg:px-16">
        {approach ? (
          <div className="mx-auto max-w-5xl">
            <h2 className="text-3xl font-extrabold tracking-tight text-crema-900">{copy.approach}</h2>
            <div className="mt-8">
              <BodyCopy value={approach} />
            </div>
          </div>
        ) : null}

        <div className="mt-20 grid gap-16 lg:grid-cols-[1.25fr_0.9fr] lg:items-start">
          <section>
            <h2 className="text-3xl font-extrabold tracking-tight text-crema-900">{copy.specializations}</h2>
            <ul className="mt-10 divide-y divide-crema-200">
              {specializations.map((item) => (
                <li key={item.title} className="grid grid-cols-[1.5rem_1fr] gap-4 py-5">
                  <span className="pt-1 text-xl font-bold text-green-500">✓</span>
                  <div>
                    <h3 className="text-xl font-extrabold text-crema-900">{item.title}</h3>
                    {item.description ? <p className="mt-2 text-lg leading-7 text-crema-400">{item.description}</p> : null}
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <aside>
            {credentialCards.length > 0 ? (
              <>
                <h2 className="text-3xl font-extrabold tracking-tight text-crema-900">{copy.credentials}</h2>
                <div className="mt-10 space-y-5">
                  {credentialCards.map((item) => (
                    <article key={item.heading} className="flex gap-5 rounded-3xl border border-crema-200 bg-white p-6 shadow-sm">
                      <CredentialIcon type={item.type} />
                      <div>
                        <h3 className="text-sm font-extrabold uppercase tracking-[0.18em] text-crema-400">{item.heading}</h3>
                        <p className="mt-4 text-lg font-bold leading-8 text-crema-800">{item.body}</p>
                      </div>
                    </article>
                  ))}
                </div>
              </>
            ) : null}

            {locations.length > 0 ? (
              <section className={credentialCards.length > 0 ? "mt-10" : ""}>
                <h2 className="text-3xl font-extrabold tracking-tight text-crema-900">{copy.locations}</h2>
                <ul className="mt-7 space-y-6">
                  {locations.map((item) => (
                    <li key={item.label} className="grid grid-cols-[0.75rem_1fr] gap-4">
                      <span className="mt-2 h-3 w-3 rounded-full bg-orange-500" aria-hidden="true" />
                      <div>
                        <h3 className="text-lg font-extrabold text-crema-900">{item.label}</h3>
                        {item.description ? <p className="mt-1 text-base text-crema-400">{item.description}</p> : null}
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}
          </aside>
        </div>
      </section>

      <section className="bg-gradient-to-br from-green-50 via-white to-yellow-50 px-6 py-20 text-center lg:px-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-4xl font-extrabold tracking-tight text-crema-900">{copy.ctaTitle}</h2>
          <p className="mt-6 text-lg text-crema-400">{copy.ctaText}</p>
          <div className="mt-10 flex flex-col items-center justify-center gap-5 sm:flex-row">
            {bookingHref ? (
              <Link
                href={bookingHref}
                target={bookingLink?.newTab ? "_blank" : undefined}
                className="inline-flex min-h-14 min-w-56 items-center justify-center gap-8 rounded-full bg-orange-500 px-7 text-lg font-extrabold text-white shadow-sm transition hover:bg-orange-600"
              >
                {bookingText}
                <span aria-hidden="true">→</span>
              </Link>
            ) : null}

            {whatsappLink ? (
              <Link
                href={linkHref(whatsappLink)}
                target={whatsappLink.newTab ? "_blank" : undefined}
                className="inline-flex min-h-14 min-w-56 items-center justify-center rounded-2xl border border-crema-200 bg-white px-7 text-lg font-extrabold text-crema-900 shadow-sm transition hover:border-green-300"
              >
                {linkText(whatsappLink) || copy.whatsapp}
              </Link>
            ) : null}
          </div>
        </div>
      </section>
    </div>
  );
}
