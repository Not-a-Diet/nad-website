'use strict';

// Reviews home-page section (sections.reviews), watermark variant.
//
// ⚠️  PLACEHOLDER CONTENT — the names/comments below come from the Claude Design
// mock, NOT from real customers. EU/IT/PT consumer law forbids publishing
// invented reviews. Before going live, replace every entry with a real quote
// and set `sourceUrl` to the original Google/Trustpilot/etc. review.
//
// Idempotent across en/it/pt via mode: 'append-section'. No avatar media is
// seeded — the card falls back to initials. Add photos later in the admin.

// Shared, locale-independent fields per review (name/date/rating/platform).
// Comments are translated per locale below and merged in by index.
const meta = [
  { authorName: 'Giulia Rinaldi',   date: '2026-03-14', rating: 5, platform: 'google' },
  { authorName: 'Marco Bellini',    date: '2026-02-28', rating: 5, platform: 'trustpilot' },
  { authorName: 'Sofia Conte',      date: '2026-02-11', rating: 5, platform: 'instagram' },
  { authorName: 'Davide Marchetti', date: '2026-01-22', rating: 5, platform: 'google' },
  { authorName: 'Anna Ferrari',     date: '2026-01-09', rating: 4, platform: 'facebook' },
  { authorName: 'Elena Russo',      date: '2025-12-18', rating: 5, platform: 'trustpilot' },
  { authorName: 'Pietro Greco',     date: '2025-12-02', rating: 5, platform: 'google' },
  { authorName: 'Chiara Romano',    date: '2025-11-14', rating: 5, platform: 'instagram' },
];

// Merge shared meta with the locale's comment array (same order as `meta`).
const withComments = (comments) =>
  meta.map((m, i) => ({ ...m, comment: comments[i] }));

const base = {
  __component: 'sections.reviews',
  variant: 'watermark',
  showSummary: true,
  summaryAverage: 4.9,
  summaryCount: 240,
  autoplay: true,
  autoplayInterval: 5,
};

const en = {
  ...base,
  eyebrow: 'Real stories',
  title: 'What it feels like to [eat freely]',
  description:
    'No before-and-after photos. No scales. Just people learning to trust their plates again.',
  summaryLabel: 'reviews across Google, Trustpilot & Instagram',
  reviews: withComments([
    'I came in expecting another meal plan. I left with the first eating routine that actually fits my life — pregnancy, work, the occasional pizza. Vanessa never made me feel guilty for anything.',
    'After two years of yo-yo diets I finally understand what "balance" actually means. Six months in, the changes have stuck because I chose them.',
    'The BIA session was a revelation. Seeing the data without a single comment about weight loss reframed my whole approach. Highly recommend.',
    'Larissa is patient, precise and refreshingly free of food rules. My gut issues have improved more in three months than the past five years of trying things on my own.',
    "Practical advice I can actually follow on a busy week. The follow-ups are short, focused and never make me feel I'm being graded.",
    'Menopause turned my relationship with food upside down. I needed someone who would listen first. Vanessa did, and the plan we built together respects that.',
    'Honest, kind, and clearly competent. The online sessions feel as warm as the in-person ones in Padova.',
    'I now think about food without the constant noise of a calorie counter in my head. That alone has been worth everything.',
  ]),
};

const it = {
  ...base,
  eyebrow: 'Storie vere',
  title: 'Cosa significa [mangiare liberi]',
  description:
    'Niente foto prima-e-dopo. Niente bilancia. Solo persone che imparano di nuovo a fidarsi del proprio piatto.',
  summaryLabel: 'recensioni tra Google, Trustpilot e Instagram',
  reviews: withComments([
    'Mi aspettavo l’ennesima dieta. Sono uscita con la prima routine alimentare che si adatta davvero alla mia vita — gravidanza, lavoro, la pizza ogni tanto. Vanessa non mi ha mai fatto sentire in colpa per nulla.',
    'Dopo due anni di diete yo-yo ho finalmente capito cosa significa davvero "equilibrio". Dopo sei mesi i cambiamenti sono rimasti perché li ho scelti io.',
    'La seduta BIA è stata una rivelazione. Vedere i dati senza un solo commento sul dimagrimento ha cambiato tutto il mio approccio. Consigliatissima.',
    'Larissa è paziente, precisa e piacevolmente priva di regole alimentari. I miei problemi intestinali sono migliorati più in tre mesi che nei cinque anni in cui ho provato da sola.',
    'Consigli pratici che riesco davvero a seguire in una settimana piena. Gli incontri di proseguimento sono brevi, mirati e non mi fanno mai sentire giudicata.',
    'La menopausa ha stravolto il mio rapporto con il cibo. Avevo bisogno di qualcuno che prima ascoltasse. Vanessa lo ha fatto, e il piano che abbiamo costruito insieme lo rispetta.',
    'Onesti, gentili e chiaramente competenti. Le sedute online sono calorose quanto quelle in presenza a Padova.',
    'Ora penso al cibo senza il rumore costante di un contacalorie in testa. Solo questo è valso tutto.',
  ]),
};

const pt = {
  ...base,
  eyebrow: 'Histórias reais',
  title: 'O que é [comer com liberdade]',
  description:
    'Sem fotos de antes-e-depois. Sem balanças. Apenas pessoas a reaprender a confiar no próprio prato.',
  summaryLabel: 'avaliações no Google, Trustpilot e Instagram',
  reviews: withComments([
    'Esperava mais um plano alimentar. Saí com a primeira rotina alimentar que se adapta mesmo à minha vida — gravidez, trabalho, a pizza de vez em quando. A Vanessa nunca me fez sentir culpada por nada.',
    'Depois de dois anos de dietas ioiô finalmente percebo o que significa "equilíbrio". Seis meses depois, as mudanças ficaram porque fui eu que as escolhi.',
    'A sessão de BIA foi uma revelação. Ver os dados sem um único comentário sobre perda de peso mudou toda a minha abordagem. Recomendo muito.',
    'A Larissa é paciente, precisa e felizmente livre de regras alimentares. Os meus problemas intestinais melhoraram mais em três meses do que nos cinco anos a tentar sozinha.',
    'Conselhos práticos que consigo mesmo seguir numa semana cheia. Os acompanhamentos são curtos, focados e nunca me fazem sentir avaliada.',
    'A menopausa virou a minha relação com a comida do avesso. Precisava de alguém que ouvisse primeiro. A Vanessa ouviu, e o plano que construímos juntas respeita isso.',
    'Honestos, gentis e claramente competentes. As sessões online são tão acolhedoras como as presenciais em Pádua.',
    'Agora penso na comida sem o ruído constante de um contador de calorias na cabeça. Só isso já valeu tudo.',
  ]),
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
