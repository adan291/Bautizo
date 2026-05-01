import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav 
      aria-label="Navegación principal"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled 
          ? 'bg-white/95 backdrop-blur-lg shadow-lg shadow-blue-100/50' 
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className={`relative w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
            scrolled ? 'bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg' : 'bg-white/90 shadow-md'
          }`}>
            <span className={`text-lg font-serif font-bold transition-colors ${
              scrolled ? 'text-white' : 'text-blue-600'
            }`} aria-hidden="true">L</span>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-yellow-300 rounded-full flex items-center justify-center shadow-sm">
              <Heart size={8} className="text-yellow-600" fill="currentColor" aria-hidden="true" />
            </div>
          </div>
          <div className={`hidden sm:block transition-opacity ${scrolled ? 'opacity-100' : 'opacity-0'}`}>
            <p className="font-serif text-lg font-semibold text-slate-800">
              Bautizo de Liam
            </p>
          </div>
        </div>
      </div>
    </nav>
  );
}
