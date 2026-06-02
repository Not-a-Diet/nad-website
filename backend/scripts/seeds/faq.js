'use strict';

// FAQ home-page section (sections.faq). Classic minimal hairline-divided
// accordion; emits FAQPage JSON-LD for answer engines (AEO).
// English copy mirrors the approved Claude Design bundle; it/pt translated.

const base = {
  __component: 'sections.faq',
  openMode: 'single',
};

const en = {
  ...base,
  eyebrow: 'Frequently asked',
  title: 'Questions we hear [all the time]',
  subtitle:
    'Honest answers about how we work, what to expect from a session, and the philosophy behind it all.',
  ctaNote: 'Still wondering? Send us a note — we usually reply same day.',
  ctaText: 'Book a free intro call',
  ctaUrl: '/en#contact',
  items: [
    {
      question: 'What exactly is Not a Diet?',
      answer:
        "Not a Diet is a nutrition counseling practice run by two Registered Dietitians. We help you build a calm, sustainable relationship with food — without rules, restrictions, or shame.\n\nIt's the opposite of a fad diet: instead of a meal plan to follow for six weeks, you learn to eat with intention for the rest of your life.",
    },
    {
      question: 'How is this different from a regular diet?',
      answer:
        "Diets prescribe; we teach. There's no list of forbidden foods, no calorie counting, no good-vs-bad framing. We focus on food literacy, hunger cues, and the habits that actually shape long-term health.",
    },
    {
      question: 'What happens during a counseling session?',
      answer:
        "Your first session is a long conversation. We talk about your routine, your relationship with food, your goals, and anything you'd like to change. From there we agree on a few small, specific experiments to try before we meet again.\n\nFollow-ups are shorter and focused on what's working, what isn't, and what to adjust.",
    },
    {
      question: 'What is Bioelectrical Impedance Analysis (BIA)?',
      answer:
        'BIA is a quick, painless body-composition assessment. A low, harmless electrical signal passes through the body and we read back fat mass, lean mass, hydration, and basal metabolism — far more useful than what a bathroom scale can tell you.\n\nIt takes about ten minutes and gives us an objective starting point to track real change over time.',
    },
    {
      question: 'Do you offer online consultations?',
      answer:
        'Yes. We see clients in person at our clinics in Porcia, Padova, and Borgo Veneto, and online from anywhere in the world. Online sessions are conducted in English, Italian, or Portuguese.',
    },
    {
      question: 'How long does a typical journey last?',
      answer:
        "It varies. Most clients work with us for three to six months — long enough for new habits to settle. Some stay for a single block of sessions; others check in periodically once they've found their footing.\n\nThere's no fixed package. We agree on a cadence together at the first session.",
    },
    {
      question: 'Will I get a strict meal plan to follow?',
      answer:
        "No. A rigid meal plan stops working the moment life gets in the way — a wedding, a work trip, a kid's birthday. We give you principles and tools you can apply to whatever's actually on your plate that day.",
    },
    {
      question: 'How do I book my first session?',
      answer:
        'Pick a location and a time from the booking page, or send us a message at info@notadiet.life and we will find a slot together. Most new clients are seen within a week.',
    },
  ],
};

const it = {
  ...base,
  eyebrow: 'Domande frequenti',
  title: 'Le domande che ci fanno [più spesso]',
  subtitle:
    'Risposte oneste su come lavoriamo, cosa aspettarsi da una seduta e la filosofia che sta dietro a tutto.',
  ctaNote: 'Hai ancora dei dubbi? Scrivici — di solito rispondiamo in giornata.',
  ctaText: 'Prenota una chiamata conoscitiva',
  ctaUrl: '/it#contact',
  items: [
    {
      question: "Che cos'è esattamente Not a Diet?",
      answer:
        'Not a Diet è uno studio di consulenza nutrizionale gestito da due Dietisti. Ti aiutiamo a costruire un rapporto sereno e sostenibile con il cibo — senza regole, restrizioni o sensi di colpa.\n\nÈ il contrario di una dieta lampo: invece di un piano da seguire per sei settimane, impari a mangiare con consapevolezza per il resto della vita.',
    },
    {
      question: 'In cosa è diverso da una dieta normale?',
      answer:
        'Le diete prescrivono; noi insegniamo. Niente lista di cibi proibiti, niente conta delle calorie, niente etichette buono-cattivo. Ci concentriamo sull’educazione alimentare, sui segnali della fame e sulle abitudini che davvero plasmano la salute nel lungo periodo.',
    },
    {
      question: 'Cosa succede durante una seduta?',
      answer:
        'La prima seduta è una lunga conversazione. Parliamo della tua routine, del tuo rapporto con il cibo, dei tuoi obiettivi e di tutto ciò che vorresti cambiare. Da lì concordiamo alcuni piccoli esperimenti concreti da provare prima del prossimo incontro.\n\nGli incontri successivi sono più brevi e si concentrano su ciò che funziona, ciò che non funziona e cosa modificare.',
    },
    {
      question: "Che cos'è l'Analisi di Impedenza Bioelettrica (BIA)?",
      answer:
        'La BIA è una valutazione della composizione corporea rapida e indolore. Un segnale elettrico basso e innocuo attraversa il corpo e ci restituisce massa grassa, massa magra, idratazione e metabolismo basale — molto più utile di quanto possa dirti una bilancia da bagno.\n\nRichiede circa dieci minuti e ci dà un punto di partenza oggettivo per misurare i cambiamenti reali nel tempo.',
    },
    {
      question: 'Offrite consulenze online?',
      answer:
        'Sì. Riceviamo di persona nei nostri studi di Porcia, Padova e Borgo Veneto, e online da qualsiasi parte del mondo. Le sedute online si svolgono in italiano, inglese o portoghese.',
    },
    {
      question: 'Quanto dura un percorso tipico?',
      answer:
        'Dipende. La maggior parte delle persone lavora con noi per tre-sei mesi — abbastanza perché le nuove abitudini si consolidino. Alcuni fanno un solo ciclo di sedute; altri tornano periodicamente una volta trovato il proprio equilibrio.\n\nNon esiste un pacchetto fisso. Concordiamo insieme la cadenza alla prima seduta.',
    },
    {
      question: 'Riceverò un piano alimentare rigido da seguire?',
      answer:
        'No. Un piano rigido smette di funzionare nel momento in cui la vita ci si mette di mezzo — un matrimonio, una trasferta, il compleanno di un figlio. Ti diamo principi e strumenti da applicare a qualsiasi cosa tu abbia davvero nel piatto quel giorno.',
    },
    {
      question: 'Come prenoto la mia prima seduta?',
      answer:
        'Scegli una sede e un orario dalla pagina di prenotazione, oppure scrivici a info@notadiet.life e troveremo insieme uno slot. La maggior parte dei nuovi clienti viene ricevuta entro una settimana.',
    },
  ],
};

const pt = {
  ...base,
  eyebrow: 'Perguntas frequentes',
  title: 'As perguntas que mais [nos fazem]',
  subtitle:
    'Respostas honestas sobre como trabalhamos, o que esperar de uma sessão e a filosofia por trás de tudo.',
  ctaNote: 'Ainda com dúvidas? Escreva-nos — normalmente respondemos no mesmo dia.',
  ctaText: 'Marque uma chamada de apresentação',
  ctaUrl: '/pt#contact',
  items: [
    {
      question: 'O que é exatamente a Not a Diet?',
      answer:
        'A Not a Diet é um consultório de aconselhamento nutricional gerido por duas Nutricionistas. Ajudamos a construir uma relação calma e sustentável com a comida — sem regras, restrições ou culpa.\n\nÉ o oposto de uma dieta da moda: em vez de um plano para seguir durante seis semanas, aprende a comer com intenção para o resto da vida.',
    },
    {
      question: 'Em que é que isto é diferente de uma dieta normal?',
      answer:
        'As dietas prescrevem; nós ensinamos. Não há lista de alimentos proibidos, nem contagem de calorias, nem rótulos de bom-versus-mau. Focamo-nos na literacia alimentar, nos sinais de fome e nos hábitos que realmente moldam a saúde a longo prazo.',
    },
    {
      question: 'O que acontece durante uma sessão de aconselhamento?',
      answer:
        'A primeira sessão é uma longa conversa. Falamos sobre a sua rotina, a sua relação com a comida, os seus objetivos e tudo o que gostaria de mudar. A partir daí combinamos alguns pequenos experimentos concretos para testar antes do próximo encontro.\n\nOs acompanhamentos são mais curtos e centram-se no que está a funcionar, no que não está e no que ajustar.',
    },
    {
      question: 'O que é a Análise de Impedância Bioelétrica (BIA)?',
      answer:
        'A BIA é uma avaliação da composição corporal rápida e indolor. Um sinal elétrico baixo e inofensivo atravessa o corpo e devolve-nos massa gorda, massa magra, hidratação e metabolismo basal — muito mais útil do que uma balança de casa de banho consegue dizer.\n\nDemora cerca de dez minutos e dá-nos um ponto de partida objetivo para acompanhar a mudança real ao longo do tempo.',
    },
    {
      question: 'Oferecem consultas online?',
      answer:
        'Sim. Atendemos presencialmente nos nossos consultórios em Porcia, Padova e Borgo Veneto, e online a partir de qualquer lugar do mundo. As sessões online são realizadas em português, inglês ou italiano.',
    },
    {
      question: 'Quanto tempo dura um percurso típico?',
      answer:
        'Varia. A maioria dos clientes trabalha connosco entre três e seis meses — tempo suficiente para os novos hábitos se fixarem. Alguns fazem apenas um bloco de sessões; outros voltam periodicamente depois de encontrarem o seu equilíbrio.\n\nNão há pacote fixo. Combinamos juntos a cadência na primeira sessão.',
    },
    {
      question: 'Vou receber um plano alimentar rígido para seguir?',
      answer:
        'Não. Um plano rígido deixa de funcionar assim que a vida atravessa o caminho — um casamento, uma viagem de trabalho, o aniversário de um filho. Damos-lhe princípios e ferramentas que pode aplicar a tudo o que tiver realmente no prato nesse dia.',
    },
    {
      question: 'Como marco a minha primeira sessão?',
      answer:
        'Escolha um local e um horário na página de marcações, ou envie-nos uma mensagem para info@notadiet.life e encontramos juntos um horário. A maioria dos novos clientes é atendida no prazo de uma semana.',
    },
  ],
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
