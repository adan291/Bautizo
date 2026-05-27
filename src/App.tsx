import { useState, useRef, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import MenuForm from './components/MenuForm';
import SelectionSummary from './components/SelectionSummary';
import PhotoGallery from './components/PhotoGallery';
import LanguageSelector from './components/LanguageSelector';
import { Heart, Camera, ArrowLeft } from 'lucide-react';
import { Locale, t } from './i18n';

const GalleryScene = lazy(() => import('./components/GalleryScene'));

type Page = 'home' | 'gallery';

export default function App() {
  const [page, setPage] = useState<Page>('home');
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

  if (page === 'gallery') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-celestial-50 font-sans"
      >
        <LanguageSelector locale={locale} onChange={setLocale} />

        {/* 3D Background */}
        <Suspense fallback={null}>
          <GalleryScene />
        </Suspense>
        
        {/* Back button */}
        <div className="fixed top-4 left-4 z-50">
          <button
            onClick={() => setPage('home')}
            className="flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg border border-blue-200 text-sm font-bold text-slate-700 hover:bg-blue-50 active:scale-95 transition-all"
          >
            <ArrowLeft size={16} />
            {t(locale, 'galleryBack')}
          </button>
        </div>

        {/* Gallery header */}
        <div className="relative pt-16 pb-4 overflow-hidden z-10">
          <div className="relative z-10 text-center px-4 pt-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', damping: 12, delay: 0.1 }}
              className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/20"
            >
              <Camera size={28} className="text-white" />
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-2xl sm:text-3xl font-serif font-semibold text-slate-800 mb-2"
            >
              {t(locale, 'galleryTitle')}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-slate-500 text-sm"
            >
              {t(locale, 'gallerySubtitle')}
            </motion.p>
          </div>
        </div>

        <div className="relative z-10">
          <PhotoGallery locale={locale} />
        </div>
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen bg-celestial-50 font-sans">
      <LanguageSelector locale={locale} onChange={setLocale} />
      <Navbar />

      {/* Camera floating button */}
      <motion.button
        onClick={() => setPage('gallery')}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', damping: 12, delay: 0.8 }}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-xl shadow-blue-500/30 hover:scale-110 active:scale-95 transition-transform"
        aria-label={t(locale, 'galleryTitle')}
      >
        <Camera size={24} className="text-white" />
        <span className="absolute inset-0 rounded-full bg-blue-400 animate-ping opacity-20" />
      </motion.button>
      
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
