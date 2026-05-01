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
    summaryTitle: '¡Nos vemos pronto!',
    summarySubtitle: 'Tu confirmación',
    guest: 'Invitado',
    selectedDish: 'Plato elegido',
    observations: 'Observaciones',
    none: 'Ninguna',
    eventDetails: 'Detalles del evento',
    date: 'Fecha',
    dateValue: '14 de Junio de 2026',
    time: 'Hora',
    timeValue: '12:00',
    location: 'Lugar',
    locationValue: 'Restaurante (ver invitación)',
    
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
    rapito: 'Rapito del Cantábrico',
    entrecot: 'Entrecot',
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
    summaryTitle: 'Ne vedem curând!',
    summarySubtitle: 'Confirmarea ta',
    guest: 'Invitat',
    selectedDish: 'Felul ales',
    observations: 'Observații',
    none: 'Niciuna',
    eventDetails: 'Detaliile evenimentului',
    date: 'Data',
    dateValue: '14 Iunie 2026',
    time: 'Ora',
    timeValue: '12:00',
    location: 'Locul',
    locationValue: 'Restaurant (vezi invitația)',
    
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
