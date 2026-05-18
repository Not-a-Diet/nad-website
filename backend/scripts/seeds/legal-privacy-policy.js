'use strict';

const content = {
  it: `## Informativa sulla Privacy

**Ultimo aggiornamento: maggio 2025**

### 1. Titolare del trattamento
Not a Diet – Nutrizionista
Email: info@notadiet.life

### 2. Dati raccolti
Raccogliamo dati di navigazione anonimi tramite Google Analytics (indirizzo IP, pagine visitate, durata della sessione) e i dati che fornisci volontariamente tramite il modulo di contatto (nome, email, messaggio).

### 3. Finalità del trattamento
- Fornire e migliorare i servizi del sito
- Rispondere alle richieste di contatto
- Analizzare l'utilizzo del sito (solo con il tuo consenso)

### 4. Base giuridica
Il trattamento si basa sul tuo consenso (art. 6 par. 1 lett. a GDPR) per i cookie analitici, e sull'esecuzione di un contratto (art. 6 par. 1 lett. b GDPR) per i dati di contatto.

### 5. Conservazione dei dati
I dati di contatto sono conservati per il tempo necessario a rispondere alla tua richiesta, salvo obblighi di legge. I dati analitici sono conservati secondo le impostazioni di Google Analytics (massimo 14 mesi).

### 6. Diritti dell'interessato
Hai il diritto di accedere, rettificare, cancellare i tuoi dati, e di opporti al trattamento. Puoi esercitare questi diritti scrivendo a info@notadiet.life.

### 7. Cookie
Per i dettagli sull'uso dei cookie, consulta la nostra [Informativa sui Cookie](/it/cookie-policy).`,

  en: `## Privacy Policy

**Last updated: May 2025**

### 1. Data Controller
Not a Diet – Nutritionist
Email: info@notadiet.life

### 2. Data Collected
We collect anonymous browsing data via Google Analytics (IP address, pages visited, session duration) and the information you voluntarily provide through the contact form (name, email, message).

### 3. Purposes of Processing
- Provide and improve site services
- Respond to your contact requests
- Analyse site usage (only with your consent)

### 4. Legal Basis
Processing is based on your consent (Art. 6(1)(a) GDPR) for analytics cookies, and on the performance of a contract (Art. 6(1)(b) GDPR) for contact data.

### 5. Data Retention
Contact data is retained for the time necessary to respond to your request, unless required by law. Analytics data is retained according to Google Analytics settings (maximum 14 months).

### 6. Your Rights
You have the right to access, rectify, or erase your data, and to object to processing. You may exercise these rights by writing to info@notadiet.life.

### 7. Cookies
For details on our use of cookies, see our [Cookie Policy](/en/cookie-policy).`,

  pt: `## Política de Privacidade

**Última atualização: maio de 2025**

### 1. Responsável pelo Tratamento
Not a Diet – Nutricionista
E-mail: info@notadiet.life

### 2. Dados Recolhidos
Recolhemos dados de navegação anónimos através do Google Analytics (endereço IP, páginas visitadas, duração da sessão) e as informações que fornece voluntariamente através do formulário de contacto (nome, e-mail, mensagem).

### 3. Finalidades do Tratamento
- Fornecer e melhorar os serviços do site
- Responder aos seus pedidos de contacto
- Analisar a utilização do site (apenas com o seu consentimento)

### 4. Base Jurídica
O tratamento baseia-se no seu consentimento (art. 6.º, n.º 1, al. a) RGPD) para cookies analíticos, e na execução de um contrato (art. 6.º, n.º 1, al. b) RGPD) para dados de contacto.

### 5. Conservação dos Dados
Os dados de contacto são conservados pelo tempo necessário para responder ao seu pedido, salvo obrigações legais. Os dados analíticos são conservados de acordo com as definições do Google Analytics (máximo 14 meses).

### 6. Direitos do Titular
Tem direito a aceder, retificar ou apagar os seus dados, e a opor-se ao tratamento. Pode exercer esses direitos escrevendo para info@notadiet.life.

### 7. Cookies
Para mais detalhes sobre o uso de cookies, consulte a nossa [Política de Cookies](/pt/cookie-policy).`,
};

const richText = (locale) => ({
  __component: 'sections.rich-text',
  content: content[locale],
});

module.exports = {
  contentType: 'api::page.page',
  uniqueBy: { slug: 'privacy-policy' },
  entries: [
    {
      locale: 'it',
      data: { slug: 'privacy-policy', locale: 'it', shortName: 'Privacy Policy', heading: 'Informativa sulla Privacy', contentSections: [richText('it')] },
    },
    {
      locale: 'en',
      data: { slug: 'privacy-policy', locale: 'en', shortName: 'Privacy Policy', heading: 'Privacy Policy', contentSections: [richText('en')] },
    },
    {
      locale: 'pt',
      data: { slug: 'privacy-policy', locale: 'pt', shortName: 'Política de Privacidade', heading: 'Política de Privacidade', contentSections: [richText('pt')] },
    },
  ],
};
