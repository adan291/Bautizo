import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import MenuForm from './components/MenuForm';
import SelectionSummary from './components/SelectionSummary';
import LanguageSelector from './components/LanguageSelector';
import { Heart } from 'lucide-react';
import { Locale, t } from './i18n';

export default function App() {
  const [showMenu, setShowMenu] = useState(false);
  const [submittedSelection, setSubmittedSelection] = useState<any>(null);
  const [locale, setLocale] = useState<Locale>('es');
  const menuSectionRef = useRef<HTMLDivElement>(null);

  const handleConfirmAttendance = () => {
    setShowMenu(true);
    setTimeout(() => {
      menuSectionRef.current?.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }, 150);
  };

  const handleSuccess = (selection: any) => {
    setSubmittedSelection(selection);
    setTimeout(() => {
      menuSectionRef.current?.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }, 100);
  };

  const handleReset = () => {
    setSubmittedSelection(null);
  };

  return (
    <div className="min-h-screen bg-celestial-50 font-sans">
      <LanguageSelector locale={locale} onChange={setLocale} />
      <Navbar />
      
      <main className="pb-16 md:pb-24">
        <Hero 
          onConfirm={handleConfirmAttendance} 
          isAuthenticated={showMenu}
          locale={locale}
        />
        
        {/* Menu Section */}
        <section 
          ref={menuSectionRef}
          id="menu-section" 
          className="max-w-2xl mx-auto px-4 scroll-mt-24 relative z-10 bg-[#f0f7ff] py-8"
          aria-label={locale === 'ro' ? 'Selectare meniu' : 'Selección de menú'}
        >
          <AnimatePresence mode="wait">
            {showMenu && (
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                {submittedSelection ? (
                  <SelectionSummary 
                    selection={submittedSelection} 
                    locale={locale} 
                    onReset={handleReset}
                  />
                ) : (
                  <MenuForm onSuccess={handleSuccess} locale={locale} />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative py-12 md:py-16 border-t border-blue-100/50 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-blue-50/50 to-transparent pointer-events-none" aria-hidden="true" />
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          {/* Decorative element */}
          <div className="flex items-center justify-center gap-3 mb-6" aria-hidden="true">
            <div className="w-12 h-px bg-gradient-to-r from-transparent to-blue-200" />
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-lg">👼</span>
            </div>
            <div className="w-12 h-px bg-gradient-to-l from-transparent to-blue-200" />
          </div>
          
          <h3 className="font-serif text-xl text-slate-700 mb-2">
            {t(locale, 'footerTitle')}
          </h3>
          
          <p className="text-sm text-slate-500 mb-4">
            {t(locale, 'footerDate')}
          </p>
          
          <div className="flex items-center justify-center gap-2 text-blue-400 text-xs uppercase tracking-widest font-semibold mb-6">
            <Heart size={10} fill="currentColor" aria-hidden="true" />
            <span>{t(locale, 'footerPromise')}</span>
            <Heart size={10} fill="currentColor" aria-hidden="true" />
          </div>
          
          <p className="text-xs text-slate-400">
            © 2026 · {t(locale, 'footerMadeWith')}
          </p>
        </div>
      </footer>
    </div>
  );
}
