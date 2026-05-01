import { Locale } from '../i18n';

interface LanguageSelectorProps {
  locale: Locale;
  onChange: (locale: Locale) => void;
}

export default function LanguageSelector({ locale, onChange }: LanguageSelectorProps) {
  return (
    <nav className="fixed top-4 right-4 z-[9999]" aria-label="Selector de idioma">
      <div className="flex bg-white/95 backdrop-blur-sm rounded-full shadow-lg border border-blue-200 p-1 gap-1" role="radiogroup" aria-label="Idioma">
        <button
          type="button"
          role="radio"
          aria-checked={locale === 'es'}
          aria-label="Español"
          onClick={() => onChange('es')}
          className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
            locale === 'es'
              ? 'bg-blue-500 text-white shadow'
              : 'text-slate-600 hover:bg-blue-50'
          }`}
        >
          ES
        </button>
        <button
          type="button"
          role="radio"
          aria-checked={locale === 'ro'}
          aria-label="Română"
          onClick={() => onChange('ro')}
          className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
            locale === 'ro'
              ? 'bg-blue-500 text-white shadow'
              : 'text-slate-600 hover:bg-blue-50'
          }`}
        >
          RO
        </button>
      </div>
    </nav>
  );
}
