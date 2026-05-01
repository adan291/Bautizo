import { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import Scene from './Scene';
import { Locale, t } from '../i18n';

interface HeroProps {
  onConfirm: () => void;
  isAuthenticated: boolean;
  locale: Locale;
}

export default function Hero({ onConfirm, isAuthenticated, locale }: HeroProps) {
  const [showScene, setShowScene] = useState(false);

  // Lazy load 3D scene for better performance
  useEffect(() => {
    const timer = setTimeout(() => setShowScene(true), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative h-screen w-full">
      {/* Background Image - tu invitación, ocupa toda la pantalla */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img 
          src={locale === 'ro' ? '/img/invRu.jpeg' : '/img/inv.jpeg'}
          alt="Invitación Bautizo de Liam" 
          className="w-full h-full object-cover"
          loading="eager"
        />
      </div>

      {/* 3D Scene */}
      {showScene && <Scene />}

      {/* Botón fijo en la parte inferior */}
      <div className="absolute bottom-8 left-0 right-0 z-20 px-4">
        <div className="max-w-md mx-auto">
          <button
            onClick={onConfirm}
            disabled={isAuthenticated}
            className={`group w-full py-4 px-8 rounded-full font-bold text-lg transition-all duration-300 ${
              isAuthenticated
                ? 'bg-green-500 text-white'
                : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-2xl shadow-blue-500/50 hover:scale-[1.02] active:scale-[0.98]'
            }`}
          >
            <span className="flex items-center justify-center gap-2">
              {isAuthenticated ? (
                <>
                  <span>{t(locale, 'alreadyConfirmed')}</span>
                  <ChevronDown size={20} className="animate-bounce" />
                </>
              ) : (
                <>
                  <span>{t(locale, 'confirmAttendance')}</span>
                  <ChevronDown size={20} className="group-hover:translate-y-1 transition-transform" />
                </>
              )}
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}
