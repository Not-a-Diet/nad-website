"use client"
import { useEffect, useRef } from "react";
import "vanilla-cookieconsent/dist/cookieconsent.css";
import * as CookieConsent from "vanilla-cookieconsent";
import Script from "next/script";
import { useParams } from "next/navigation";

interface GA4ProviderProps {
  measurementId: string;
}

type Locale = "en" | "it" | "pt";

const isLocale = (value: string): value is Locale =>
  value === "en" || value === "it" || value === "pt";

const ariaLabels: Record<Locale, string> = {
  en: "Cookie preferences",
  it: "Preferenze cookie",
  pt: "Preferências de cookies",
};

const buildTranslations = (locale: Locale): CookieConsent.CookieConsentConfig["language"]["translations"] => {
  const footer = `
    <a href="/${locale}/privacy-policy" target="_blank" rel="noopener noreferrer">${{
      en: "Privacy Policy",
      it: "Informativa sulla privacy",
      pt: "Política de Privacidade",
    }[locale]}</a>
    <a href="/${locale}/cookie-policy" target="_blank" rel="noopener noreferrer">${{
      en: "Cookie Policy",
      it: "Informativa sui cookie",
      pt: "Política de Cookies",
    }[locale]}</a>
    <a href="/${locale}/terms" target="_blank" rel="noopener noreferrer">${{
      en: "Terms and conditions",
      it: "Termini e condizioni",
      pt: "Termos e Condições",
    }[locale]}</a>
  `;

  return {
    en: {
      consentModal: {
        title: "Balance includes cookies 🍪",
        description:
          "We use cookies to improve your experience on notadiet.life. Essential cookies are always on. We also use analytics cookies (via Google Analytics) to understand site usage. For details, see our Cookie Policy and Privacy Policy",
        acceptAllBtn: "Yum 😋",
        acceptNecessaryBtn: "Hold the sugar",
        showPreferencesBtn: "Manage individual preferences",
        footer,
      },
      preferencesModal: {
        title: "Manage cookie preferences",
        acceptAllBtn: "Accept all",
        acceptNecessaryBtn: "Reject all",
        savePreferencesBtn: "Accept current selection",
        closeIconLabel: "Close modal",
        serviceCounterLabel: "Service|Services",
        sections: [
          {
            title: "Your Privacy Choices",
            description:
              "In this panel you can express some preferences related to the processing of your personal information. You may review and change expressed choices at any time by resurfacing this panel via the provided link. To deny your consent to the specific processing activities described below, switch the toggles to off or use the “Reject all” button and confirm you want to save your choices.",
          },
          {
            title: "Strictly Necessary",
            description:
              "These cookies are essential for the proper functioning of the website and cannot be disabled.",
            linkedCategory: "necessary",
          },
          {
            title: "Performance and Analytics",
            description:
              "These cookies collect information about how you use our website. All of the data is anonymized and cannot be used to identify you.",
            linkedCategory: "analytics",
            cookieTable: {
              caption: "Cookie table",
              headers: { name: "Cookie", domain: "Domain", desc: "Description" },
              body: [
                { name: "_ga", domain: location.hostname, desc: "Google Analytics" },
                { name: "_gid", domain: location.hostname, desc: "Google Analytics" },
              ],
            },
          },
          {
            title: "More information",
            description:
              'For any queries in relation to my policy on cookies and your choices, please <a href="#contact">contact us</a>',
          },
        ],
      },
    },
    it: {
      consentModal: {
        title: "L'equilibrio include i cookie 🍪",
        description:
          "Utilizziamo i cookie per migliorare la tua esperienza su notadiet.life. I cookie essenziali sono sempre attivi. Utilizziamo anche cookie analitici (tramite Google Analytics) per comprendere l'utilizzo del sito. Per maggiori dettagli, consulta la nostra Cookie Policy e l'Informativa sulla privacy.",
        acceptAllBtn: "Buono 😋",
        acceptNecessaryBtn: "Niente zucchero",
        showPreferencesBtn: "Gestisci le preferenze",
        footer,
      },
      preferencesModal: {
        title: "Gestisci le preferenze sui cookie",
        acceptAllBtn: "Accetta tutto",
        acceptNecessaryBtn: "Rifiuta tutto",
        savePreferencesBtn: "Accetta la selezione attuale",
        closeIconLabel: "Chiudi finestra",
        serviceCounterLabel: "Servizio|Servizi",
        sections: [
          {
            title: "Le tue scelte sulla privacy",
            description:
              "In questo pannello puoi esprimere alcune preferenze relative al trattamento dei tuoi dati personali. Puoi rivedere e modificare le scelte espresse in qualsiasi momento riaprendo questo pannello dal link dedicato. Per negare il consenso alle attività di trattamento descritte qui sotto, disattiva le levette o utilizza il pulsante “Rifiuta tutto” e conferma il salvataggio.",
          },
          {
            title: "Strettamente necessari",
            description:
              "Questi cookie sono essenziali per il corretto funzionamento del sito e non possono essere disattivati.",
            linkedCategory: "necessary",
          },
          {
            title: "Prestazioni e analisi",
            description:
              "Questi cookie raccolgono informazioni su come utilizzi il nostro sito. Tutti i dati sono anonimizzati e non possono essere utilizzati per identificarti.",
            linkedCategory: "analytics",
            cookieTable: {
              caption: "Tabella dei cookie",
              headers: { name: "Cookie", domain: "Dominio", desc: "Descrizione" },
              body: [
                { name: "_ga", domain: location.hostname, desc: "Google Analytics" },
                { name: "_gid", domain: location.hostname, desc: "Google Analytics" },
              ],
            },
          },
          {
            title: "Maggiori informazioni",
            description:
              'Per qualsiasi domanda sulla nostra policy sui cookie e sulle tue scelte, <a href="#contact">contattaci</a>.',
          },
        ],
      },
    },
    pt: {
      consentModal: {
        title: "O equilíbrio inclui cookies 🍪",
        description:
          "Usamos cookies para melhorar a sua experiência em notadiet.life. Os cookies essenciais estão sempre ativos. Também usamos cookies de análise (através do Google Analytics) para entender como o site é utilizado. Para mais detalhes, consulte nossa Política de Cookies e Política de Privacidade.",
        acceptAllBtn: "Delícia 😋",
        acceptNecessaryBtn: "Sem açúcar",
        showPreferencesBtn: "Gerenciar preferências",
        footer,
      },
      preferencesModal: {
        title: "Gerenciar preferências de cookies",
        acceptAllBtn: "Aceitar tudo",
        acceptNecessaryBtn: "Rejeitar tudo",
        savePreferencesBtn: "Aceitar seleção atual",
        closeIconLabel: "Fechar janela",
        serviceCounterLabel: "Serviço|Serviços",
        sections: [
          {
            title: "Suas escolhas de privacidade",
            description:
              "Neste painel você pode expressar algumas preferências relacionadas ao tratamento dos seus dados pessoais. Você pode revisar e alterar as escolhas a qualquer momento reabrindo este painel pelo link disponibilizado. Para negar o consentimento às atividades de tratamento descritas abaixo, desative as opções ou use o botão “Rejeitar tudo” e confirme o salvamento.",
          },
          {
            title: "Estritamente necessários",
            description:
              "Estes cookies são essenciais para o funcionamento correto do site e não podem ser desativados.",
            linkedCategory: "necessary",
          },
          {
            title: "Desempenho e análise",
            description:
              "Estes cookies coletam informações sobre como você usa nosso site. Todos os dados são anonimizados e não podem ser usados para identificá-lo.",
            linkedCategory: "analytics",
            cookieTable: {
              caption: "Tabela de cookies",
              headers: { name: "Cookie", domain: "Domínio", desc: "Descrição" },
              body: [
                { name: "_ga", domain: location.hostname, desc: "Google Analytics" },
                { name: "_gid", domain: location.hostname, desc: "Google Analytics" },
              ],
            },
          },
          {
            title: "Mais informações",
            description:
              'Para qualquer dúvida sobre nossa política de cookies e suas escolhas, <a href="#contact">entre em contato</a>.',
          },
        ],
      },
    },
  };
};

export default function GA4CookieConsentBanner({ measurementId }: GA4ProviderProps) {
  const param = useParams();
  const rawLocale = (param?.lang as string) || "en";
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "en";
  const hasInitialized = useRef(false);

  useEffect(() => {
    // NOTE: the Consent Mode `default` is set inline in the `gtag-init` <Script>
    // below, as the first command before `config`, so it is guaranteed to run
    // before the first page_view. This effect only wires up the consent UI and
    // emits `update` when the user makes (or has already saved) a choice.
    function updateConsent(cookie: CookieConsent.CookieValue) {
      const analyticsEnabled = cookie.categories?.includes("analytics");
      // @ts-expect-error gtag is a global injected by GA4 Script
      gtag("consent", "update", {
        analytics_storage: analyticsEnabled ? "granted" : "denied",
      });
    }

    const cookieConfig: CookieConsent.CookieConsentConfig = {
      cookie: { name: "cc_cookie" },
      guiOptions: {
        consentModal: {
          layout: "cloud inline",
          position: "bottom center",
          equalWeightButtons: true,
          flipButtons: false,
        },
        preferencesModal: {
          layout: "box",
          equalWeightButtons: true,
          flipButtons: false,
        },
      },
      onFirstConsent: ({ cookie }) => updateConsent(cookie),
      onConsent: ({ cookie }) => updateConsent(cookie),
      onChange: ({ cookie }) => updateConsent(cookie),
      categories: {
        necessary: { enabled: true, readOnly: true },
        analytics: {
          autoClear: {
            cookies: [{ name: /^_ga/ }, { name: "_gid" }],
          },
          services: {
            ga: {
              label: "Google Analytics",
              onAccept: () => {},
              onReject: () => {},
            },
          },
        },
      },
      language: {
        default: locale,
        translations: buildTranslations(locale),
      },
    };

    if (!hasInitialized.current) {
      CookieConsent.run(cookieConfig);
      hasInitialized.current = true;
    } else {
      // Locale changed after first mount — swap language without resetting saved consent,
      // and re-show the consent modal if the user hasn't chosen yet (setLanguage alone
      // updates copy but does not re-display a previously-hidden modal).
      void (async () => {
        await CookieConsent.setLanguage(locale, true);
        if (!CookieConsent.validConsent()) {
          CookieConsent.show();
        }
      })();
    }
  }, [locale]);

  return (
    <>
      <style>
        {`
#cc-main {
--cc-btn-primary-bg: #B8CE12;
--cc-btn-primary-color: #1c1917;
--cc-btn-primary-hover-bg: #16a34a;
--cc-btn-primary-hover-color: #1c1917;
--cc-btn-primary-hover-border-color: #444444;
--cc-toggle-on-bg: var(--cc-btn-primary-bg);
}
`}
      </style>

      {/* GA4 library — deferred to idle because analytics is consent-gated anyway */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="lazyOnload"
      />

      {/* GA4 init. Consent Mode v2 `default` (all denied) MUST be the first
          command — before `config` fires the first page_view — so tracking is
          gated until the user accepts. Includes the v2-required ad_user_data /
          ad_personalization signals. The update is emitted from the effect above.
          Stays `afterInteractive` (not lazyOnload) so the tiny `window.gtag`
          dataLayer-queue shim exists before the consent effect runs; commands
          buffer until the lazyOnload library above loads and replays them. */}
      <Script id="gtag-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || []; window.gtag = window.gtag || function(){window.dataLayer.push(arguments);}; gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'denied',wait_for_update:500}); gtag('js', new Date()); gtag('config', '${measurementId}', { debug_mode: false });`}
      </Script>

      <div className="overflow-auto drop-shadow-lg fixed z-[9999] bottom-4 right-6 w-fit bg-gray-200 rounded-full">
        <button
          type="button"
          data-cc="show-preferencesModal"
          aria-label={ariaLabels[locale]}
          className="w-full h-full p-4"
        >
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f" aria-hidden="true"><path d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-75 29-147t81-128.5q52-56.5 125-91T475-881q21 0 43 2t45 7q-9 45 6 85t45 66.5q30 26.5 71.5 36.5t85.5-5q-26 59 7.5 113t99.5 56q1 11 1.5 20.5t.5 20.5q0 82-31.5 154.5t-85.5 127q-54 54.5-127 86T480-80Zm-60-480q25 0 42.5-17.5T480-620q0-25-17.5-42.5T420-680q-25 0-42.5 17.5T360-620q0 25 17.5 42.5T420-560Zm-80 200q25 0 42.5-17.5T400-420q0-25-17.5-42.5T340-480q-25 0-42.5 17.5T280-420q0 25 17.5 42.5T340-360Zm260 40q17 0 28.5-11.5T640-360q0-17-11.5-28.5T600-400q-17 0-28.5 11.5T560-360q0 17 11.5 28.5T600-320ZM480-160q122 0 216.5-84T800-458q-50-22-78.5-60T683-603q-77-11-132-66t-68-132q-80-2-140.5 29t-101 79.5Q201-644 180.5-587T160-480q0 133 93.5 226.5T480-160Zm0-324Z" /></svg>
        </button>
      </div>
    </>
  );
}
