import {Metadata} from "next";
import {notFound} from "next/navigation";
import {i18n} from "i18n-config";
import JsonLd from "@/app/[lang]/components/JsonLd";
import TeamDetails, {
  TeamProfile,
  TeamProfileCardItem,
  TeamProfileLink,
  TeamProfileSpecialization,
} from "@/app/[lang]/components/TeamDetails";
import {fetchAPI} from "@/app/[lang]/utils/fetch-api";
import {hreflang, ogLocale, pageUrl, safeMediaUrl} from "@/app/[lang]/utils/seo";

type RawTeamMember = Record<string, any>;

interface RouteParams {
  lang: string;
  slug: string;
}

interface Props {
  params: Promise<RouteParams>;
}

function toText(value: unknown): string | undefined {
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : undefined;
  }
  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  return undefined;
}

function splitList(value: unknown): string[] {
  if (typeof value === "string") {
    return value
      .split(/[\n;,•]+/)
      .map((item) => item.trim())
      .filter(Boolean);
  }

  if (Array.isArray(value)) {
    return value.flatMap((item) => splitList(item)).filter(Boolean);
  }

  return [];
}

function asSpecializations(value: unknown): TeamProfileSpecialization[] {
  if (Array.isArray(value)) {
    return value
      .map((item) => {
        if (typeof item === "string") {
          const title = item.trim();
          return title ? {title} : null;
        }
        if (item && typeof item === "object") {
          const title =
            toText(item.title) ?? toText(item.name) ?? toText(item.label) ?? toText(item.value);
          const description = toText(item.description ?? item.body);
          return title ? {title, ...(description ? {description} : {})} : null;
        }
        return null;
      })
      .filter((item): item is TeamProfileSpecialization => Boolean(item));
  }

  return splitList(value).map((title) => ({title}));
}

function asCardItems(value: unknown): TeamProfileCardItem[] {
  if (Array.isArray(value)) {
    return value
      .map((item) => {
        if (typeof item === "string") {
          const label = item.trim();
          return label ? {label} : null;
        }
        if (item && typeof item === "object") {
          const label =
            toText(item.label) ??
            toText(item.title) ??
            toText(item.name) ??
            toText(item.value);
          const itemValue = toText(item.value ?? item.description ?? item.detail);
          const href = toText(item.href ?? item.url);
          return label ? {label, ...(itemValue ? {value: itemValue} : {}), ...(href ? {href} : {})} : null;
        }
        return null;
      })
      .filter((item): item is TeamProfileCardItem => Boolean(item));
  }

  return splitList(value).map((label) => ({label}));
}

function cardsFromSchemaField(value: unknown, fallbackLabel: string): TeamProfileCardItem[] {
  return asCardItems(value).map((item) =>
    item.value ? item : {label: fallbackLabel, value: item.label},
  );
}

function asSocialLinks(value: unknown): TeamProfileLink[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => {
      if (!item || typeof item !== "object") {
        return null;
      }
      const href = toText(item.href ?? item.url);
      if (!href) return null;
      const label =
        toText(item.label) ??
        toText(item.text) ??
        toText(item.title) ??
        toText(item.name) ??
        toText(item.social) ??
        href;
      return {
        label,
        href,
        social: toText(item.social),
        newTab: item.newTab === true,
      };
    })
    .filter(Boolean) as TeamProfileLink[];
}

function normalizeTeamMember(raw: RawTeamMember, lang: string): TeamProfile {
  const localizations = Array.isArray(raw.localizations)
    ? raw.localizations
        .map((item) => {
          const locale = toText(item?.locale);
          const slug = toText(item?.slug);
          return locale && slug ? {locale, slug} : null;
        })
        .filter(
          (item): item is {
            locale: string;
            slug: string;
          } => Boolean(item),
        )
    : [];
  const explicitCredentials = asCardItems(raw.credentials);
  const schemaCredentials = [
    ...cardsFromSchemaField(raw.education, "Education"),
    ...cardsFromSchemaField(raw.degree, "Degree"),
    ...cardsFromSchemaField(raw.albo, "Registration"),
    ...cardsFromSchemaField(raw.associations, "Associations"),
    ...cardsFromSchemaField(raw.languages, "Languages"),
  ];

  return {
    slug: toText(raw.slug) ?? "",
    name: toText(raw.name) ?? "Team member",
    occupation: toText(raw.occupation) ?? toText(raw.role),
    description: toText(raw.description) ?? toText(raw.shortBio) ?? toText(raw.intro),
    extendedBio: toText(raw.extendedBio) ?? toText(raw.bio) ?? toText(raw.longBio) ?? toText(raw.about),
    philosophy:
      toText(raw.philosophy) ??
      toText(raw.quote) ??
      toText(raw.philosophyQuote) ??
      toText(raw.values),
    trustPills: splitList(raw.trustPills).length > 0 ? splitList(raw.trustPills) : splitList(raw.skills),
    specializations:
      asSpecializations(raw.specializations).length > 0
        ? asSpecializations(raw.specializations)
        : asSpecializations(raw.skills),
    credentials: explicitCredentials.length > 0 ? explicitCredentials : schemaCredentials,
    languages: asCardItems(raw.languages),
    locations: asCardItems(raw.locations),
    socials: asSocialLinks(raw.contactLinks ?? raw.socials ?? raw.socialLinks ?? raw.links),
    profilePhoto: raw.profilePhoto,
    ctaLabel: toText(raw.ctaLabel) ?? toText(raw.callToActionLabel) ?? toText(raw.contactLabel),
    ctaHref: toText(raw.ctaHref) ?? toText(raw.callToActionHref) ?? toText(raw.contactHref) ?? `/${lang}#contact`,
    localizations,
  };
}

async function getTeamMemberBySlug(lang: string, slug: string): Promise<TeamProfile | null> {
  const token = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;
  const options = { headers: { Authorization: `Bearer ${token}` } };
  const response = await fetchAPI("/dietitians", {
    locale: lang,
    filters: {slug: slug},
    populate: {
      profilePhoto: true,
      contactLinks: true,
      localizations: {fields: ["slug", "locale"]},
    },
    pagination: {pageSize: 1},
  }, options);

  const raw = response?.data?.[0] as RawTeamMember | undefined;
  return raw ? normalizeTeamMember(raw, lang) : null;
}

function buildLocalizedAlternates(member: TeamProfile, lang: string) {
  const localizationMap = new Map(
    (member.localizations ?? []).map((item) => [item.locale, item.slug] as const),
  );

  const languages = Object.fromEntries(
    i18n.locales.map((locale) => {
      const localizedSlug = localizationMap.get(locale) ?? member.slug;
      return [hreflang(locale), pageUrl(locale, `/team/${localizedSlug}`)];
    }),
  );

  return {
    canonical: pageUrl(lang, `/team/${localizationMap.get(lang) ?? member.slug}`),
    languages: {
      ...languages,
      "x-default": pageUrl(
        i18n.defaultLocale,
        `/team/${localizationMap.get(i18n.defaultLocale) ?? member.slug}`,
      ),
    },
  };
}

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {lang, slug} = await params;
  const member = await getTeamMemberBySlug(lang, slug);

  if (!member) {
    return {
      title: "Team member not found",
      robots: {index: false, follow: false},
      alternates: {canonical: pageUrl(lang, `/team/${slug}`)},
    };
  }

  const image = safeMediaUrl(
    member.profilePhoto?.formats?.large?.url ??
      member.profilePhoto?.formats?.medium?.url ??
      member.profilePhoto?.formats?.small?.url ??
      member.profilePhoto?.url ??
      null,
  );
  const title = member.name;
  const description =
    member.description ??
    member.extendedBio ??
    member.philosophy ??
    `Meet ${member.name}, a member of the Not a Diet team.`;

  return {
    title,
    description,
    alternates: buildLocalizedAlternates(member, lang),
    openGraph: {
      title,
      description,
      url: pageUrl(lang, `/team/${slug}`),
      type: "profile",
      locale: ogLocale(lang),
      ...(image ? {images: [image]} : {}),
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title,
      description,
      ...(image ? {images: [image]} : {}),
    },
  };
}

export async function generateStaticParams() {
  const params: Array<{lang: string; slug: string}> = [];

  const token = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;
  const options = { headers: { Authorization: `Bearer ${token}` } };
  for (const lang of i18n.locales) {
    try {
      const response = await fetchAPI("/dietitians", {
        locale: lang,
        fields: ["slug"],
        filters: { listed: true },
        pagination: {pageSize: 100},
      }, options);

      for (const item of response?.data ?? []) {
        const slug = toText(item?.slug);
        if (slug) {
          params.push({lang, slug});
        }
      }
    } catch {
      continue;
    }
  }

  return params;
}

export default async function TeamDetailPage({params}: Props) {
  const {lang, slug} = await params;
  const member = await getTeamMemberBySlug(lang, slug);

  if (!member) {
    notFound();
  }

  const canonicalUrl = pageUrl(lang, `/team/${slug}`);
  const image = safeMediaUrl(
    member.profilePhoto?.formats?.large?.url ??
      member.profilePhoto?.formats?.medium?.url ??
      member.profilePhoto?.formats?.small?.url ??
      member.profilePhoto?.url ??
      null,
  );
  const sameAs = member.socials
    ?.map((item) => item.href)
    .filter((item): item is string => Boolean(item));

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "ProfilePage",
      name: member.name,
      url: canonicalUrl,
      inLanguage: lang,
      mainEntity: {
        "@type": "Person",
        name: member.name,
        jobTitle: member.occupation,
        description: member.extendedBio ?? member.description ?? member.philosophy,
        image: image ?? undefined,
        url: canonicalUrl,
        sameAs,
        knowsAbout: member.specializations?.map((item) => item.title),
        knowsLanguage: member.languages?.map((item) => item.label),
      },
    },
  ];

  return (
    <>
      <JsonLd data={jsonLd} />
      <TeamDetails lang={lang} member={member} />
    </>
  );
}
