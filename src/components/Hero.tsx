import { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { lazy, Suspense } from 'react';
import { Locale, t } from '../i18n';

const Scene = lazy(() => import('./Scene'));

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
    <section className="relative h-screen w-full" aria-label={locale === 'ro' ? 'Invitație la botez' : 'Invitación al bautizo'}>
      {/* Background Image */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img 
          src={locale === 'ro' ? '/img/invRu.jpeg' : '/img/inv.jpeg'}
          alt={locale === 'ro' ? 'Invitație la Botezul lui Liam - Duminică 14 Iunie 2026' : 'Invitación al Bautizo de Liam - Domingo 14 de Junio de 2026'}
          className="w-full h-full object-cover"
          loading="eager"
          fetchPriority="high"
        />
      </div>

      {/* 3D Scene - decorative */}
      {showScene && (
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      )}

      {/* Botón fijo en la parte inferior */}
      <div className="absolute bottom-8 left-0 right-0 z-20 px-4">
        <div className="max-w-md mx-auto">
          <button
            onClick={onConfirm}
            disabled={isAuthenticated}
            aria-disabled={isAuthenticated}
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
                  <ChevronDown size={20} className="animate-bounce" aria-hidden="true" />
                </>
              ) : (
                <>
                  <span>{t(locale, 'confirmAttendance')}</span>
                  <ChevronDown size={20} className="group-hover:translate-y-1 transition-transform" aria-hidden="true" />
                </>
              )}
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}
