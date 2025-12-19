"use client"
import { useEffect } from "react";
import "vanilla-cookieconsent/dist/cookieconsent.css";
import * as CookieConsent from "vanilla-cookieconsent";
import Script from "next/script";
import { useParams } from "next/navigation";

interface GA4ProviderProps {
  measurementId: string;
}

export default function GA4CookieConsentBanner({ measurementId }: GA4ProviderProps) {
  const param = useParams();
  const locale = (param?.lang as string) || "en"
  useEffect(() => {
    // Helper to sync consent with GA4
    function updateConsent(cookie: any, changedCategories?: any, changedServices?: any) {
      const analyticsEnabled = cookie.categories.includes('analytics');
      //@ts-ignore
      gtag('consent', 'update', {
        analytics_storage: analyticsEnabled ? 'granted' : 'denied',
      });
    }
    /**
     * All config. options available here:
     * https://cookieconsent.orestbida.com/reference/configuration-reference.html
     */
    const cookieConfig: CookieConsent.CookieConsentConfig = {
      cookie: { name: 'cc_cookie' },
      // https://cookieconsent.orestbida.com/reference/configuration-reference.html#guioptions
      guiOptions: {
        consentModal: {
          layout: 'cloud inline',
          position: 'bottom center',
          equalWeightButtons: true,
          flipButtons: false
        },
        preferencesModal: {
          layout: 'box',
          equalWeightButtons: true,
          flipButtons: false
        }
      },

      onFirstConsent: ({ cookie }) => {
        updateConsent(cookie);
      },

      onConsent: ({ cookie }) => {
        updateConsent(cookie);
      },

      onChange: ({ cookie, changedCategories, changedServices }) => {
        updateConsent(cookie, changedCategories, changedServices);
      },

      onModalReady: ({ modalName }) => {
      },

      onModalShow: ({ modalName }) => {
      },

      onModalHide: ({ modalName }) => {
      },

      categories: {
        necessary: {
          enabled: true,  // this category is enabled by default
          readOnly: true  // this category cannot be disabled
        },
        analytics: {
          autoClear: {
            cookies: [
              {
                name: /^_ga/,   // regex: match all cookies starting with '_ga'
              },
              {
                name: '_gid',   // string: exact cookie name
              }
            ]
          },

          // https://cookieconsent.orestbida.com/reference/configuration-reference.html#category-services
          services: {
            ga: {
              label: 'Google Analytics',
              onAccept: () => {

              },
              onReject: () => {

              }
            },
          }
        },
      },
      language: {
        default: "en",
        translations: {
          en: {
            consentModal: {
              title: 'Balance includes cookies 🍪',
              description: 'We use cookies to improve your experience on notadiet.life. Essential cookies are always on. We also use analytics cookies (via Google Analytics) to understand site usage. For details, see our Cookie Policy and Privacy Policy',
              acceptAllBtn: 'Yum 😋',
              acceptNecessaryBtn: 'Hold the sugar',
              showPreferencesBtn: 'Manage Individual preferences',
              footer: `
                        <a href="/privacy-policy" target="_blank">Privacy Policy</a>
                        <a href="/cookie-policy" target="_blank">Cookie Policy</a>
                        <a href="/terms" target="_blank">Terms and conditions</a>
                    `,
            },
            preferencesModal: {
              title: 'Manage cookie preferences',
              acceptAllBtn: 'Accept all',
              acceptNecessaryBtn: 'Reject all',
              savePreferencesBtn: 'Accept current selection',
              closeIconLabel: 'Close modal',
              serviceCounterLabel: 'Service|Services',
              sections: [
                {
                  title: 'Your Privacy Choices',
                  description: `In this panel you can express some preferences related to the processing of your personal information. You may review and change expressed choices at any time by resurfacing this panel via the provided link. To deny your consent to the specific processing activities described below, switch the toggles to off or use the “Reject all” button and confirm you want to save your choices.`,
                },
                {
                  title: 'Strictly Necessary',
                  description: 'These cookies are essential for the proper functioning of the website and cannot be disabled.',

                  //this field will generate a toggle linked to the 'necessary' category
                  linkedCategory: 'necessary'
                },
                {
                  title: 'Performance and Analytics',
                  description: 'These cookies collect information about how you use our website. All of the data is anonymized and cannot be used to identify you.',
                  linkedCategory: 'analytics',
                  cookieTable: {
                    caption: 'Cookie table',
                    headers: {
                      name: 'Cookie',
                      domain: 'Domain',
                      desc: 'Description'
                    },
                    body: [
                      {
                        name: '_ga',
                        domain: location.hostname,
                        desc: 'Google Analytics',
                      },
                      {
                        name: '_gid',
                        domain: location.hostname,
                        desc: 'Google Analytics',
                      }
                    ]
                  }
                },
                {
                  title: 'More information',
                  description: 'For any queries in relation to my policy on cookies and your choices, please <a href="#contact">contact us</a>'
                }
              ]
            }
          }
        }
      }
    }
    if (!CookieConsent.validConsent()) {
      CookieConsent.reset();
      //console.log("CONSENT RESET", CookieConsent.validConsent(), CookieConsent.validCookie("cc_cookie"), CookieConsent.getCookie())
    }
    CookieConsent.run(cookieConfig);
  }, [locale]);

  return (
    <>
      <style>
        {`
#cc-main {

/** Change button primary color to black **/
--cc-btn-primary-bg: #B8CE12;
--cc-btn-primary-hover-bg: #16a34a;
--cc-btn-primary-hover-border-color: #444444;

/** Also make toggles the same color as the button **/
--cc-toggle-on-bg: var(--cc-btn-primary-bg);

}


`}

      </style>
      {/* PHASE 1: Set default consent to DENIED immediately */}
      <Script id="gtag-consent-default" strategy="beforeInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          gtag('consent', 'default', {
            'analytics_storage': 'denied',
            'ad_storage': 'denied',
            'wait_for_update': 500
          });
        `}
      </Script>

      {/* PHASE 2: Load the actual GA4 Library */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="afterInteractive"
      />

      {/* PHASE 3: Initialize GA4 Config */}
      <Script id="gtag-init" strategy="afterInteractive">
        {`
          window.gtag('js', new Date());
          window.gtag('config', '${measurementId}', {
            debug_mode: true
          });
        `}
      </Script>
      <div className="overflow-auto drop-shadow-lg fixed z-[9999] bottom-4 right-6 w-fit bg-gray-200 rounded-full">
        <button type="button" data-cc="show-preferencesModal" className="w-full h-full p-4" >
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-75 29-147t81-128.5q52-56.5 125-91T475-881q21 0 43 2t45 7q-9 45 6 85t45 66.5q30 26.5 71.5 36.5t85.5-5q-26 59 7.5 113t99.5 56q1 11 1.5 20.5t.5 20.5q0 82-31.5 154.5t-85.5 127q-54 54.5-127 86T480-80Zm-60-480q25 0 42.5-17.5T480-620q0-25-17.5-42.5T420-680q-25 0-42.5 17.5T360-620q0 25 17.5 42.5T420-560Zm-80 200q25 0 42.5-17.5T400-420q0-25-17.5-42.5T340-480q-25 0-42.5 17.5T280-420q0 25 17.5 42.5T340-360Zm260 40q17 0 28.5-11.5T640-360q0-17-11.5-28.5T600-400q-17 0-28.5 11.5T560-360q0 17 11.5 28.5T600-320ZM480-160q122 0 216.5-84T800-458q-50-22-78.5-60T683-603q-77-11-132-66t-68-132q-80-2-140.5 29t-101 79.5Q201-644 180.5-587T160-480q0 133 93.5 226.5T480-160Zm0-324Z" /></svg>
        </button>
      </div>
    </>
  );
}

