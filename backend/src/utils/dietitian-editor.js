'use strict';

const jsonHint = (description, example) => ({
  description: `${description} Esempio (da adattare): ${JSON.stringify(example)}. Usa le virgolette doppie. null significa non compilato; usa [] per una lista vuota.`,
});

// Content Manager metadata is stored separately from content-type schemas.
// Examples are editor guidance, never defaults saved into public profiles.
const dietitianFields = {
  name: { placeholder: 'Maria Rossi', description: 'Nome e cognome da mostrare sul sito. Esempio: Maria Rossi.' },
  slug: { placeholder: 'maria-rossi', description: 'Parte finale del link al profilo: /it/team/maria-rossi. Usa lettere minuscole e trattini; evita di cambiarlo dopo la pubblicazione.' },
  role: { placeholder: 'Dietista', description: 'Titolo professionale effettivo, nella lingua del profilo. Esempio: Dietista.' },
  shortBio: { placeholder: 'Ti accompagno verso un rapporto sereno con il cibo, con percorsi adatti alla tua quotidianità.', description: 'Una o due frasi brevi per la pagina del team, il riepilogo nella prenotazione e la presentazione dell’autore.' },
  bio: { placeholder: 'Racconta il tuo percorso, la tua esperienza e come accompagni le persone.', description: 'Biografia completa per il profilo. Scrivi brevi paragrafi sul percorso e sul metodo di lavoro; usa solo informazioni reali.' },
  philosophy: { placeholder: 'Credo in un’alimentazione flessibile, senza rinunce inutili.', description: 'Breve pensiero personale per la citazione nel profilo. Scrivi una o due frasi, senza aggiungere le virgolette.' },
  profilePhoto: { description: 'Carica o seleziona un ritratto dalla libreria media. Preferisci una foto quadrata con il viso ben visibile. Testo alternativo consigliato: nome e cognome. Se non presente, il sito mostra l’iniziale.' },
  education: jsonHint('Percorso di formazione. Inserisci una lista di voci.', [{ label: 'Formazione', value: 'Laurea in Dietistica — Università di [nome], [anno]' }]),
  degree: jsonHint('Titoli di studio e qualifiche effettivamente conseguiti.', ['Laurea in Dietistica', 'Master in [ambito]']),
  albo: jsonHint('Iscrizione professionale: ordine, provincia e numero reali.', [{ label: 'Albo professionale', value: 'Ordine TSRM e PSTRP di [provincia] — n. [numero]' }]),
  associations: jsonHint('Associazioni professionali di cui fai parte.', ['Nome dell’associazione']),
  languages: jsonHint('Lingue parlate; puoi indicare il livello nel testo.', ['Italiano (madrelingua)', 'Inglese (fluente)']),
  locations: jsonHint('Luoghi mostrati nel profilo. I calendari si configurano separatamente in bookingLocations.', ['Studio di Milano', 'Online']),
  specializations: jsonHint('Ambiti di attività: titolo breve e descrizione facoltativa. I primi tre titoli compaiono nel riepilogo della prenotazione.', [{ title: 'Nutrizione sportiva', description: 'Percorsi personalizzati per chi pratica attività fisica.' }]),
  contactLinks: { description: 'Aggiungi un link per ogni contatto pubblico: testo (es. Instagram), URL completo, tipo di social e apertura in nuova scheda.' },
  projects: { description: 'Link a progetti: testo (es. Il mio progetto), URL completo e apertura in nuova scheda. Campo conservato nel CMS; al momento non è mostrato nel profilo.' },
  bookingLocations: { description: 'Aggiungi una voce per ogni modalità di visita (es. Studio di Milano o Online), con il relativo URL di incorporamento del calendario.' },
  listed: { description: 'Attiva per mostrare questa persona nella pagina del team e, se abilitata, nella prenotazione. Disattivare non rende privato il link diretto al profilo.' },
  bookingEnabled: { description: 'Attiva per consentire la prenotazione. Servono anche listed attivo e almeno una voce completa in bookingLocations.' },
  email: { placeholder: 'nome@example.com', description: 'Email interna: questo campo è privato e non viene restituito dall’API pubblica. Per un contatto pubblico usa contactLinks con un URL mailto:.' },
  url: { placeholder: 'https://www.example.com', description: 'Sito personale facoltativo, conservato dai precedenti dati autore. Le firme degli articoli rimandano al profilo /team/slug.' },
  sameAs: jsonHint('URL completi dei profili professionali pubblici, usati nei dati strutturati degli articoli.', ['https://www.instagram.com/nomeprofilo/', 'https://www.linkedin.com/in/nomeprofilo/']),
  articles: { description: 'Articoli collegati a questa persona. Puoi selezionare la stessa Dietitian dal campo dietitian dell’articolo.' },
};

const componentFields = {
  'elements.booking-location': {
    name: { placeholder: 'Studio di Milano oppure Online', description: 'Nome della modalità di visita che comparirà nel selettore delle sedi.' },
    embedUrl: { placeholder: 'https://calendar.google.com/calendar/appointments/schedules/…?gv=true', description: 'In Google Calendar copia il valore src del codice di incorporamento della pagina appuntamenti. Incolla solo l’URL completo, non il codice <iframe>.' },
    isDefault: { description: 'Campo disponibile per compatibilità: al momento il sito richiede sempre la scelta della sede e non usa questo valore per preselezionarla.' },
  },
  'links.social-link': {
    text: { placeholder: 'Instagram', description: 'Testo visibile del collegamento. Esempi: Instagram, WhatsApp, Scrivimi.' },
    url: { placeholder: 'https://www.instagram.com/nomeprofilo/', description: 'Indirizzo completo. Esempi: https://wa.me/393331234567 oppure mailto:nome@example.com.' },
    social: { description: 'Scegli il tipo corrispondente al link: INSTAGRAM, WHATSAPP, EMAIL, WEBSITE, ecc.' },
    newTab: { description: 'Attiva per aprire il collegamento in una nuova scheda.' },
  },
  'links.link': {
    text: { placeholder: 'Scopri il progetto', description: 'Testo da mostrare sul collegamento.' },
    url: { placeholder: 'https://www.example.com/progetto', description: 'URL completo della pagina di destinazione, oppure percorso interno (es. /it/team).' },
    newTab: { description: 'Attiva per aprire il collegamento in una nuova scheda.' },
  },
};

function addMissingGuidance(configuration, fields) {
  const metadatas = { ...configuration.metadatas };
  let changed = false;
  for (const [field, guidance] of Object.entries(fields)) {
    if (!metadatas[field]) continue;
    const edit = { ...metadatas[field].edit };
    for (const [key, value] of Object.entries(guidance)) {
      // Preserve guidance customized by editors in Configure the view.
      if (!edit[key]) { edit[key] = value; changed = true; }
    }
    metadatas[field] = { ...metadatas[field], edit };
  }
  return changed ? { ...configuration, metadatas } : null;
}

async function configureDietitianEditor(strapi) {
  const manager = strapi.plugin('content-manager');
  const configure = async (serviceName, model, guidance) => {
    const service = manager.service(serviceName);
    const config = await service.findConfiguration(model);
    const updated = addMissingGuidance(config, guidance);
    if (updated) await service.updateConfiguration(model, updated);
  };
  await configure('content-types', strapi.contentTypes['api::dietitian.dietitian'], dietitianFields);
  for (const [uid, fields] of Object.entries(componentFields)) {
    await configure('components', strapi.components[uid], fields);
  }
}

module.exports = { configureDietitianEditor, addMissingGuidance, dietitianFields, componentFields };
