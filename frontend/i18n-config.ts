export const i18n = {
    defaultLocale: 'en',
    locales: ['en', 'it', 'pt'],
} as const;

export type Locale = typeof i18n['locales'][number];

export const languages: { code: Locale; label: string; flag: string }[] = [
    { code: i18n.locales[1], label: "Italiano", flag: "🇮🇹" },
    { code: i18n.locales[0], label: "English", flag: "🇬🇧" },
    { code: i18n.locales[2], label: "Português", flag: "🇧🇷" },
  ];