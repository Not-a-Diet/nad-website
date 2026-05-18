'use strict';

const content = {
  it: `## Termini e Condizioni

**Ultimo aggiornamento: maggio 2025**

### 1. Accettazione dei termini
Utilizzando il sito notadiet.life accetti i presenti Termini e Condizioni. Se non li accetti, ti preghiamo di non utilizzare il sito.

### 2. Servizi offerti
Not a Diet offre consulenze nutrizionali professionali erogate da nutrizionisti qualificati. I contenuti del sito hanno scopo puramente informativo e non sostituiscono una consulenza medica professionale.

### 3. Proprietà intellettuale
Tutti i contenuti del sito (testi, immagini, grafica, loghi) sono di proprietà di Not a Diet o dei rispettivi titolari e sono protetti dalle leggi sul diritto d'autore. Non è consentita la riproduzione senza autorizzazione scritta.

### 4. Limitazione di responsabilità
Not a Diet non è responsabile per eventuali danni derivanti dall'uso o dall'impossibilità di uso del sito, né per l'accuratezza delle informazioni pubblicate a scopo informativo.

### 5. Prenotazioni e cancellazioni
Le prenotazioni sono soggette alle condizioni specificate al momento della prenotazione. Le cancellazioni devono essere effettuate almeno 24 ore prima dell'appuntamento.

### 6. Privacy
Il trattamento dei dati personali è descritto nella nostra [Informativa sulla Privacy](/it/privacy-policy).

### 7. Legge applicabile
I presenti Termini sono regolati dalla legge italiana. Qualsiasi controversia sarà devoluta alla giurisdizione esclusiva del Tribunale competente.

### 8. Modifiche
Ci riserviamo il diritto di modificare i presenti Termini in qualsiasi momento. Le modifiche saranno pubblicate su questa pagina.

Per domande: info@notadiet.life`,

  en: `## Terms and Conditions

**Last updated: May 2025**

### 1. Acceptance of Terms
By using notadiet.life you agree to these Terms and Conditions. If you do not agree, please do not use the site.

### 2. Services Offered
Not a Diet offers professional nutritional consultations provided by qualified nutritionists. Site content is for informational purposes only and does not replace professional medical advice.

### 3. Intellectual Property
All site content (text, images, graphics, logos) is owned by Not a Diet or its respective rights holders and is protected by copyright law. Reproduction without written authorisation is not permitted.

### 4. Limitation of Liability
Not a Diet is not liable for any damages arising from the use or inability to use the site, nor for the accuracy of information published for informational purposes.

### 5. Bookings and Cancellations
Bookings are subject to the conditions specified at the time of booking. Cancellations must be made at least 24 hours before the appointment.

### 6. Privacy
The processing of your personal data is described in our [Privacy Policy](/en/privacy-policy).

### 7. Applicable Law
These Terms are governed by Italian law. Any dispute shall be subject to the exclusive jurisdiction of the competent court.

### 8. Changes
We reserve the right to modify these Terms at any time. Changes will be published on this page.

For enquiries: info@notadiet.life`,

  pt: `## Termos e Condições

**Última atualização: maio de 2025**

### 1. Aceitação dos Termos
Ao utilizar notadiet.life, aceita estes Termos e Condições. Se não concordar, por favor não utilize o site.

### 2. Serviços Oferecidos
A Not a Diet oferece consultas nutricionais profissionais prestadas por nutricionistas qualificados. O conteúdo do site tem fins meramente informativos e não substitui aconselhamento médico profissional.

### 3. Propriedade Intelectual
Todo o conteúdo do site (textos, imagens, gráficos, logótipos) é propriedade da Not a Diet ou dos respetivos titulares e está protegido pela legislação de direitos de autor. A reprodução sem autorização escrita não é permitida.

### 4. Limitação de Responsabilidade
A Not a Diet não é responsável por quaisquer danos resultantes da utilização ou impossibilidade de utilização do site, nem pela exatidão das informações publicadas para fins informativos.

### 5. Reservas e Cancelamentos
As reservas estão sujeitas às condições especificadas no momento da reserva. Os cancelamentos devem ser efetuados com pelo menos 24 horas de antecedência.

### 6. Privacidade
O tratamento dos seus dados pessoais está descrito na nossa [Política de Privacidade](/pt/privacy-policy).

### 7. Lei Aplicável
Estes Termos são regidos pela lei italiana. Qualquer litígio ficará sujeito à jurisdição exclusiva do tribunal competente.

### 8. Alterações
Reservamo-nos o direito de modificar estes Termos a qualquer momento. As alterações serão publicadas nesta página.

Para questões: info@notadiet.life`,
};

const richText = (locale) => ({
  __component: 'sections.rich-text',
  content: content[locale],
});

module.exports = {
  contentType: 'api::page.page',
  uniqueBy: { slug: 'terms' },
  entries: [
    {
      locale: 'it',
      data: { slug: 'terms', locale: 'it', shortName: 'Termini', heading: 'Termini e Condizioni', contentSections: [richText('it')] },
    },
    {
      locale: 'en',
      data: { slug: 'terms', locale: 'en', shortName: 'Terms', heading: 'Terms and Conditions', contentSections: [richText('en')] },
    },
    {
      locale: 'pt',
      data: { slug: 'terms', locale: 'pt', shortName: 'Termos', heading: 'Termos e Condições', contentSections: [richText('pt')] },
    },
  ],
};
