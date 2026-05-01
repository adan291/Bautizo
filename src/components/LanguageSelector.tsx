import { Locale } from '../i18n';

interface LanguageSelectorProps {
  locale: Locale;
  onChange: (locale: Locale) => void;
}

export default function LanguageSelector({ locale, onChange }: LanguageSelectorProps) {
  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="flex bg-white/90 backdrop-blur-sm rounded-full shadow-lg border border-blue-100 p-1">
        <button
          onClick={() => onChange('es')}
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
            locale === 'es'
              ? 'bg-blue-500 text-white shadow'
              : 'text-slate-600 hover:bg-blue-50'
          }`}
        >
          🇪🇸 ES
        </button>
        <button
          onClick={() => onChange('ro')}
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
            locale === 'ro'
              ? 'bg-blue-500 text-white shadow'
              : 'text-slate-600 hover:bg-blue-50'
          }`}
        >
          🇷🇴 RO
        </button>
      </div>
    </div>
  );
}
