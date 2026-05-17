'use strict';

const cardSection = {
  __component: 'sections.pricing-service-card',
  eyebrow: 'CONSULENZE NUTRIZIONALI',
  title: 'Percorsi [nutrizionali personalizzati]',
  description:
    'Per raggiungere i tuoi obiettivi di salute e benessere in modo sostenibile e duraturo.',
  cardTitle: 'Consulenze nutrizionali',
  cardSubtitle:
    'Un percorso costruito su di te: prima visita di valutazione e visite di proseguimento per il monitoraggio dei progressi.',
  showStudio: true,
  showOnline: true,
  studioLabel: 'In studio',
  onlineLabel: 'Online',
  firstVisitName: 'Prima Visita',
  firstVisitSub: 'Valutazione completa e definizione del piano d’azione.',
  firstVisitPrice: '€ 130',
  firstVisitMeta: 'Circa 60 minuti',
  followUpName: 'Visite di proseguimento',
  followUpSub: 'Supporto continuo e monitoraggio dei progressi.',
  followUpPrice: '€ 60',
  followUpMeta: 'Circa 30 minuti',
  cardNote:
    'I prezzi includono il piano nutrizionale personalizzato e il follow-up via email.',
  ctaText: 'Scopri di più e prenota',
  ctaUrl: 'https://notadiet.life/prenota',
  ctaNewTab: true,
  reassurances:
    'Piano personalizzato\nFollow-up via email\nDisdetta gratuita 24h prima',
};

const stepsSection = {
  __component: 'sections.pricing-steps',
  structureTitle: 'Com’è strutturato il tuo [percorso nutrizionale]',
  steps: [
    {
      stepNumber: '1',
      title: 'La Prima Visita',
      lede:
        'Dedicheremo questo tempo a conoscerti a fondo per costruire una strategia che funzioni davvero per te.',
      imagePlaceholder: 'Spazio per foto',
      stickerText: 'In studio o Online',
      durationLabel: 'Durata',
      durationValue: 'Circa 60 minuti',
      modeLabel: 'Modalità',
      modeValue: 'In studio o Online',
      priceLabel: 'Prezzo',
      priceValue: '€ 130',
      accent: 'primary',
      reverse: false,
      lists: [
        {
          heading: 'Cosa faremo',
          items:
            'Anamnesi alimentare e clinica\n' +
            'Analisi dello stile di vita e del livello di attività fisica\n' +
            'Indagine sul rapporto con il cibo e possibili false credenze\n' +
            'Valutazione antropometrica: storia del peso, rilevazioni, composizione corporea (opzionale)\n' +
            'Definizione degli obiettivi a breve e lungo termine',
        },
        {
          heading: 'Entro pochi giorni lavorativi riceverai',
          items:
            'Il tuo Piano Nutrizionale Personalizzato a sostituzioni\n' +
            'Un esempio di menù settimanale\n' +
            'Una lista di prodotti consigliati\n' +
            'Spunti per diversificare il menù\n' +
            'Altri strumenti per facilitare l’implementazione delle nuove abitudini',
        },
      ],
    },
    {
      stepNumber: '2',
      title: 'Le Visite di proseguimento',
      lede:
        'Il segreto del successo è la costanza. Le visite di proseguimento servono a capire cosa sta funzionando e cosa va corretto.',
      imagePlaceholder: 'Spazio per foto',
      stickerText: 'In studio o Online',
      durationLabel: 'Durata',
      durationValue: 'Circa 30 minuti',
      modeLabel: 'Modalità',
      modeValue: 'In studio o Online',
      priceLabel: 'Prezzo',
      priceValue: '€ 60',
      accent: 'secondary',
      reverse: true,
      lists: [
        {
          heading: 'Cosa faremo',
          items:
            'Monitoraggio dei risultati\n' +
            'Gestione delle difficoltà riscontrate\n' +
            'Aggiornamento del piano nutrizionale',
        },
      ],
      callout:
        'Frequenza: al termine di ogni visita concorderemo insieme quando effettuare la visita di proseguimento. Il periodo tra un controllo e l’altro dipende dalle tue necessità e dall’andamento del percorso.',
    },
  ],
};

module.exports = {
  contentType: 'api::page.page',
  uniqueBy: { slug: 'pricing' },
  data: {
    slug: 'pricing',
    shortName: 'Pricing',
    heading: 'Consulenze nutrizionali',
    description:
      'Percorsi nutrizionali personalizzati: prima visita e visite di proseguimento, in studio o online.',
    contentSections: [cardSection, stepsSection],
  },
};
