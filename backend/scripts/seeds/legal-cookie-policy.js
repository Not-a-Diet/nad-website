'use strict';

const content = {
  it: `## Informativa sui Cookie

**Ultimo aggiornamento: maggio 2025**

### Cosa sono i cookie
I cookie sono piccoli file di testo salvati nel tuo browser quando visiti un sito web. Vengono usati per far funzionare il sito correttamente e per raccogliere informazioni anonime sull'utilizzo.

### Cookie che utilizziamo

#### Cookie strettamente necessari
Indispensabili per il funzionamento del sito, non possono essere disattivati e non raccolgono dati personali.

| Cookie | Finalità | Durata |
|--------|----------|--------|
| cc_cookie | Salva le preferenze sui cookie | 6 mesi |

#### Cookie analitici (Google Analytics)
Utilizzati, previo consenso, per analizzare come i visitatori usano il sito. I dati sono anonimizzati.

| Cookie | Finalità | Durata |
|--------|----------|--------|
| _ga | Identifica utenti unici | 2 anni |
| _gid | Distingue le sessioni | 24 ore |

### Come gestire i cookie
Puoi modificare le preferenze in qualsiasi momento cliccando l'icona cookie in basso a destra della pagina, oppure disabilitare i cookie nelle impostazioni del tuo browser.

Per maggiori informazioni consulta la nostra [Informativa sulla Privacy](/it/privacy-policy).`,

  en: `## Cookie Policy

**Last updated: May 2025**

### What are cookies
Cookies are small text files saved in your browser when you visit a website. They are used to make the site work correctly and to collect anonymous usage information.

### Cookies we use

#### Strictly necessary cookies
Essential for the site to function, these cannot be disabled and do not collect personal data.

| Cookie | Purpose | Duration |
|--------|---------|----------|
| cc_cookie | Saves cookie preferences | 6 months |

#### Analytics cookies (Google Analytics)
Used, with your consent, to analyse how visitors use the site. Data is anonymised.

| Cookie | Purpose | Duration |
|--------|---------|----------|
| _ga | Identifies unique users | 2 years |
| _gid | Distinguishes sessions | 24 hours |

### Managing cookies
You can change your preferences at any time by clicking the cookie icon in the bottom right of the page, or by disabling cookies in your browser settings.

For more information see our [Privacy Policy](/en/privacy-policy).`,

  pt: `## Política de Cookies

**Última atualização: maio de 2025**

### O que são cookies
Os cookies são pequenos ficheiros de texto guardados no seu browser quando visita um site. São usados para fazer o site funcionar corretamente e para recolher informações anónimas sobre a utilização.

### Cookies que utilizamos

#### Cookies estritamente necessários
Essenciais para o funcionamento do site, não podem ser desativados e não recolhem dados pessoais.

| Cookie | Finalidade | Duração |
|--------|------------|---------|
| cc_cookie | Guarda as preferências de cookies | 6 meses |

#### Cookies analíticos (Google Analytics)
Utilizados, com o seu consentimento, para analisar como os visitantes usam o site. Os dados são anonimizados.

| Cookie | Finalidade | Duração |
|--------|------------|---------|
| _ga | Identifica utilizadores únicos | 2 anos |
| _gid | Distingue as sessões | 24 horas |

### Gestão de cookies
Pode alterar as suas preferências a qualquer momento clicando no ícone de cookie no canto inferior direito da página, ou desativando os cookies nas definições do browser.

Para mais informações consulte a nossa [Política de Privacidade](/pt/privacy-policy).`,
};

const richText = (locale) => ({
  __component: 'sections.rich-text',
  content: content[locale],
});

module.exports = {
  contentType: 'api::page.page',
  uniqueBy: { slug: 'cookie-policy' },
  entries: [
    {
      locale: 'it',
      data: { slug: 'cookie-policy', locale: 'it', shortName: 'Cookie Policy', heading: 'Informativa sui Cookie', contentSections: [richText('it')] },
    },
    {
      locale: 'en',
      data: { slug: 'cookie-policy', locale: 'en', shortName: 'Cookie Policy', heading: 'Cookie Policy', contentSections: [richText('en')] },
    },
    {
      locale: 'pt',
      data: { slug: 'cookie-policy', locale: 'pt', shortName: 'Política de Cookies', heading: 'Política de Cookies', contentSections: [richText('pt')] },
    },
  ],
};
