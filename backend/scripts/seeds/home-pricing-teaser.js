'use strict';

const base = {
  __component: 'sections.pricing-teaser',
  variant: 'card',
  ctaNewTab: false,
  showStudio: true,
  showOnline: true,
  firstVisitPrice: '€ 130',
  followUpPrice: '€ 60',
};

const en = {
  ...base,
  eyebrow: 'PRICING',
  headline: 'Sessions at [transparent] prices',
  lede: 'First visit and follow-ups, in studio or online.',
  ctaText: 'See full pricing',
  ctaUrl: '/en/pricing',
  secondaryLinkText: 'Book a call',
  secondaryLinkUrl: '/#contact',
  firstVisitLabel: 'First visit',
  firstVisitMeta: '~ 60 min',
  followUpLabel: 'Follow-up',
  followUpMeta: '~ 30 min',
  studioLabel: 'In studio',
  onlineLabel: 'Online',
};

const it = {
  ...base,
  eyebrow: 'PREZZI',
  headline: 'Visite a prezzi [trasparenti]',
  lede: 'Prima visita e visite di proseguimento, in studio o online.',
  ctaText: 'Scopri tutti i prezzi',
  ctaUrl: '/it/pricing',
  secondaryLinkText: 'Prenota una chiamata',
  secondaryLinkUrl: '/#contact',
  firstVisitLabel: 'Prima visita',
  firstVisitMeta: 'Circa 60 min',
  followUpLabel: 'Proseguimento',
  followUpMeta: 'Circa 30 min',
  studioLabel: 'In studio',
  onlineLabel: 'Online',
};

const pt = {
  ...base,
  eyebrow: 'PREÇOS',
  headline: 'Consultas a preços [transparentes]',
  lede: 'Primeira consulta e consultas de acompanhamento, no estúdio ou online.',
  ctaText: 'Ver todos os preços',
  ctaUrl: '/pt/pricing',
  secondaryLinkText: 'Marcar uma chamada',
  secondaryLinkUrl: '/#contact',
  firstVisitLabel: 'Primeira consulta',
  firstVisitMeta: 'Cerca de 60 min',
  followUpLabel: 'Acompanhamento',
  followUpMeta: 'Cerca de 30 min',
  studioLabel: 'No estúdio',
  onlineLabel: 'Online',
};

module.exports = {
  contentType: 'api::page.page',
  endpoint: 'pages',
  uniqueBy: { slug: 'home' },
  mode: 'append-section',
  entries: [
    { locale: 'en', section: en },
    { locale: 'it', section: it },
    { locale: 'pt', section: pt },
  ],
};
