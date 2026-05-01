export type Locale = 'es' | 'ro';

export const translations = {
  es: {
    // Hero
    confirmAttendance: '🎉 Confirmar Asistencia',
    alreadyConfirmed: '✓ ¡Genial! Baja para elegir tu menú',
    
    // MenuForm
    whatDishPrefer: '🍽️ ¿Qué plato prefieres?',
    rapito: 'Rapito del Cantábrico',
    entrecot: 'Entrecot',
    yourName: 'Tu nombre',
    namePlaceholder: 'Ej: Gabriela López',
    allergies: 'Alergias o intolerancias',
    optional: '(opcional)',
    allergiesPlaceholder: 'Ej: Sin gluten, alergia al marisco...',
    confirmButton: 'Confirmar Asistencia',
    sending: 'Enviando...',
    errorMessage: 'Hubo un problema al enviar. Por favor, inténtalo de nuevo.',
    thankYou: '¡Gracias,',
    selectionSaved: 'Tu selección ha sido guardada. ¡Te esperamos!',
    
    // SelectionSummary
    summaryConfirmed: '¡Asistencia Confirmada!',
    summaryThanks: 'Gracias,',
    summaryWaiting: '¡Te esperamos!',
    summaryGuest: 'Invitado',
    summaryYourDish: 'Tu plato',
    summaryObservations: 'Observaciones',
    summaryRemember: 'Recuerda',
    summaryDate: 'Domingo, 14 de Junio de 2026',
    summaryLocation: 'Parroquia El Salvador · 13:00',
    summaryAddCalendar: 'Añadir al Calendario',
    summarySeeYou: 'Nos vemos pronto',
    summaryChangeSelection: 'Cambiar selección',
    
    // Footer
    footerTitle: 'Bautizo de Liam',
    footerDate: '14 de Junio de 2026 · Parroquia El Salvador',
    footerPromise: 'Prometo no llorar... mucho',
    footerMadeWith: 'Hecho con amor para Liam',
  },
  ro: {
    // Hero
    confirmAttendance: '🎉 Confirmă Participarea',
    alreadyConfirmed: '✓ Grozav! Derulează în jos pentru a alege meniul',
    
    // MenuForm
    whatDishPrefer: '🍽️ Ce fel de mâncare preferi?',
    rapito: 'Pește Rapito din Cantabria',
    entrecot: 'Antricot',
    yourName: 'Numele tău',
    namePlaceholder: 'Ex: Gabriela López',
    allergies: 'Alergii sau intoleranțe',
    optional: '(opțional)',
    allergiesPlaceholder: 'Ex: Fără gluten, alergie la fructe de mare...',
    confirmButton: 'Confirmă Participarea',
    sending: 'Se trimite...',
    errorMessage: 'A apărut o problemă la trimitere. Te rugăm să încerci din nou.',
    thankYou: 'Mulțumim,',
    selectionSaved: 'Selecția ta a fost salvată. Te așteptăm!',
    
    // SelectionSummary
    summaryConfirmed: 'Participare Confirmată!',
    summaryThanks: 'Mulțumim,',
    summaryWaiting: 'Te așteptăm!',
    summaryGuest: 'Invitat',
    summaryYourDish: 'Felul tău',
    summaryObservations: 'Observații',
    summaryRemember: 'Nu uita',
    summaryDate: 'Duminică, 14 Iunie 2026',
    summaryLocation: 'Parroquia El Salvador · 13:00',
    summaryAddCalendar: 'Adaugă în Calendar',
    summarySeeYou: 'Ne vedem curând',
    summaryChangeSelection: 'Schimbă selecția',
    
    // Footer
    footerTitle: 'Botezul lui Liam',
    footerDate: '14 Iunie 2026 · Parroquia El Salvador',
    footerPromise: 'Promit să nu plâng... prea mult',
    footerMadeWith: 'Făcut cu dragoste pentru Liam',
  }
};

export function t(locale: Locale, key: keyof typeof translations.es): string {
  return translations[locale][key];
}
