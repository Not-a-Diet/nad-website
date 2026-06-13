import type { Metadata } from "next";
import { cache } from "react";
import "./globals.css";
import { getStrapiMedia, getStrapiURL } from "./utils/api-helpers";
import { fetchAPI } from "./utils/fetch-api";
import { i18n } from "../../../i18n-config";
import Banner from "./components/Banner";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import { FALLBACK_SEO, SITE_URL } from "@/app/[lang]/utils/constants";
import { ogLocale, safeMediaUrl } from "@/app/[lang]/utils/seo";
import { Inter } from "next/font/google"
import ErrorComponent from "./components/Error";
import GA4CookieConsentBanner from "./components/cookie-consent-banner";
import HashScroller from "./components/HashScroller";
import JsonLd from "./components/JsonLd";
import { resolveBusinessInfo } from "./utils/site-config";
import { localBusinessSchema, organizationSchema, websiteSchema } from "./utils/structured-data";

const GA_MEASUREMENT_ID = "G-223FTH8TYJ";

const getGlobal = cache(async (lang: string): Promise<any> => {
  const token = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;

  if (!token) throw new Error("The Strapi API Token environment variable is not set.");

  const path = `/global`;
  const options = { headers: { Authorization: `Bearer ${token}` } };

  const urlParamsObject = {
    populate: {
      metadata: { populate: "*" },
      favicon: true,
      notificationBanner: { populate: { link: true } },
      navbar: { populate: { links: true, navbarLogo: { populate: { logoImg: true } } } },
      footer: { populate: { footerLogo: { populate: { logoImg: true } }, menuLinks: true, legalLinks: true, socialLinks: true, categories: true } },
      businessInfo: true,
    },
    locale: lang,
  };
  return await fetchAPI(path, urlParamsObject, options);
});

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const meta = await getGlobal(lang);

  if (!meta.data) return FALLBACK_SEO;

  const metadata = meta.data.metadata;
  const faviconUrl = meta.data.favicon?.url;

  const title = metadata?.metaTitle ?? FALLBACK_SEO.title;
  const description = metadata?.metaDescription ?? FALLBACK_SEO.description;

  // Sitewide default share image: CMS `metadata.shareImage` when present and
  // absolute (prod CDN), otherwise the static /og-default.png resolved against
  // metadataBase. Never a localhost dev URL.
  const cmsShareImage = safeMediaUrl(metadata?.shareImage?.url);
  const ogImages = [cmsShareImage ?? "/og-default.png"];

  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    openGraph: {
      title,
      description,
      siteName: "Not a Diet",
      type: "website",
      locale: ogLocale(lang),
      url: `${SITE_URL}/${lang}`,
      images: ogImages,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ogImages,
    },
    ...(faviconUrl ? {
      icons: {
        icon: [new URL(faviconUrl, getStrapiURL())],
      },
    } : {}),
  };
}

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter", // optional: CSS variable
});


export default async function RootLayout({
  children,
  params,
}: {
  readonly children: React.ReactNode;
  readonly params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  const global = await getGlobal(lang);
  if (!global.data) return (<> <ErrorComponent /> </>);

  const { notificationBanner, navbar, footer } = global.data;

  const business = resolveBusinessInfo(global.data.businessInfo);

  const navbarLogoUrl = getStrapiMedia(
    navbar?.navbarLogo?.logoImg?.url ?? ''
  );

  const footerLogoUrl = getStrapiMedia(
    footer?.footerLogo?.logoImg?.url ?? ''
  );


  return (
    <html lang={lang} className={`${inter.variable} ${inter.className}`}>
      <body suppressHydrationWarning>
        <JsonLd data={organizationSchema(business)} />
        <JsonLd data={localBusinessSchema(business)} />
        <JsonLd data={websiteSchema(business, lang)} />
        <HashScroller />
        <Navbar
          links={navbar.links}
          logoUrl={navbarLogoUrl}
          logoText={navbar.navbarLogo.logoText}
          lang={lang}
        />

        <main className="bg-anti-flash_white text-black min-h-screen">
          {children}
        </main>

        <Banner data={notificationBanner} />
        <Footer
          logoUrl={footerLogoUrl}
          logoText={footer.footerLogo.logoText}
          description={footer.description}
          menuLinks={footer.menuLinks}
          categoryLinks={footer.categories}
          legalLinks={footer.legalLinks}
          socialLinks={footer.socialLinks}
          lang={lang}
        />
        <GA4CookieConsentBanner measurementId={GA_MEASUREMENT_ID} />
      </body>
    </html>
  );
}

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}
