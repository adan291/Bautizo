import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Mail, Calendar, MapPin, UtensilsCrossed, Heart } from 'lucide-react';
import Scene from './Scene';

interface HeroProps {
  onConfirm: () => void;
  isAuthenticated: boolean;
}

gsap.registerPlugin(useGSAP);

export default function Hero({ onConfirm, isAuthenticated }: HeroProps) {
  const containerRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const bg1Ref = useRef<HTMLDivElement>(null);
  const bg2Ref = useRef<HTMLDivElement>(null);
  const bearRef = useRef<HTMLDivElement>(null);
  const wings1Ref = useRef<HTMLImageElement>(null);
  const wings2Ref = useRef<HTMLImageElement>(null);

  useGSAP(() => {
    // Background gradient animation
    gsap.to(bg1Ref.current, {
      x: '10%',
      y: '5%',
      scale: 1.1,
      duration: 10,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });
    
    gsap.to(bg2Ref.current, {
      x: '-10%',
      y: '-5%',
      scale: 1.2,
      duration: 12,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });

    // Decorative Bear hover
    gsap.to(bearRef.current, {
      y: -15,
      rotation: 2,
      duration: 4,
      repeat: -1,
      yoyo: true,
      ease: 'power1.inOut'
    });

    // Wings gentle flapping
    gsap.to(wings1Ref.current, {
      rotation: 10,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: 'power1.inOut'
    });
    
    gsap.to(wings2Ref.current, {
      rotation: -10,
      duration: 2,
      delay: 0.2, // slight offset
      repeat: -1,
      yoyo: true,
      ease: 'power1.inOut'
    });

    // Entrance Timeline
    const tl = gsap.timeline();

    tl.from(bg1Ref.current, { opacity: 0, duration: 1 })
      .from(bg2Ref.current, { opacity: 0, duration: 1 }, "-=0.5")
      .from(cardRef.current, { 
        y: 40, 
        opacity: 0, 
        duration: 1, 
        ease: 'back.out(1.2)' 
      }, "-=0.5")
      .from('.gsap-reveal', {
        y: 20,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power2.out'
      }, "-=0.2");

  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="relative min-h-screen flex items-center justify-center overflow-hidden py-12 px-4 bg-[#F0F7FF]">
      {/* Dynamic Celestial Background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div ref={bg1Ref} className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-100 rounded-full blur-[120px] opacity-60"></div>
        <div ref={bg2Ref} className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-200/40 rounded-full blur-[120px] opacity-60"></div>
      </div>

      {/* 3D Scene overlay */}
      <Scene />

      <div 
        ref={cardRef}
        className="relative z-10 w-full max-w-[500px] bg-white/90 backdrop-blur-md rounded-[24px] shadow-[0_20px_50px_rgba(147,197,253,0.3)] border border-blue-50 overflow-hidden"
      >
        {/* Invitation Inner Frame */}
        <div className="absolute inset-0 border-[12px] border-blue-50/50 pointer-events-none rounded-[24px]"></div>
        
        <div className="p-8 md:p-12 flex flex-col items-center text-center">
          {/* Header Icons */}
          <div className="flex items-center gap-4 mb-6 gsap-reveal">
            <div>
              <img ref={wings1Ref} src="https://cdn-icons-png.flaticon.com/512/9133/9133514.png" alt="Angel Wings" className="w-12 h-12 opacity-80" />
            </div>
            <div className="w-1 px-4 text-blue-300 font-serif text-4xl leading-none">†</div>
            <div>
              <img ref={wings2Ref} src="https://cdn-icons-png.flaticon.com/512/9133/9133514.png" alt="Angel Wings" className="w-12 h-12 opacity-80 flip-x" style={{ transform: 'scaleX(-1)' }} />
            </div>
          </div>

          <h2 className="text-3xl font-serif text-deep-blue mb-2 tracking-wide italic gsap-reveal">Mi Bautizo</h2>
          
          <div className="w-16 h-px bg-blue-200 mb-6 gsap-reveal"></div>

          <p className="text-gray-500 font-sans text-sm italic leading-relaxed mb-8 px-4 gsap-reveal">
            "Entre sonrisas, abrazos y mucha ternura, celebramos mi bautizo con amor y dulzura."
            <br />
            <span className="text-blue-500 font-bold mt-2 inline-block">¡Me encantaría que nos acompañes!</span>
          </p>

          <h1 className="text-7xl md:text-8xl font-serif text-blue-500 mb-8 tracking-tight drop-shadow-sm gsap-reveal">
            Liam
          </h1>

          <div className="space-y-6 w-full max-w-[300px] mx-auto mb-10">
            <div className="flex items-center gap-4 text-left gsap-reveal">
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-400 shrink-0 shadow-inner">
                <Calendar size={18} />
              </div>
              <div className="border-b border-blue-50 pb-1 flex-1">
                <p className="text-[10px] uppercase font-bold text-gray-400 tracking-tighter">Fecha</p>
                <p className="text-sm font-bold text-deep-blue">Domingo, 14 de Junio de 2026</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 text-left gsap-reveal">
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-400 shrink-0 shadow-inner">
                <MapPin size={18} />
              </div>
              <div className="border-b border-blue-50 pb-1 flex-1">
                <p className="text-[10px] uppercase font-bold text-gray-400 tracking-tighter">Parroquia</p>
                <p className="text-sm font-bold text-deep-blue">El Salvador · 13:00 PM</p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-left gsap-reveal">
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-400 shrink-0 shadow-inner">
                <UtensilsCrossed size={18} />
              </div>
              <div className="border-b border-blue-50 pb-1 flex-1">
                <p className="text-[10px] uppercase font-bold text-gray-400 tracking-tighter">Recepción</p>
                <p className="text-sm font-bold text-deep-blue">Restaurante Marcela Brasa · 14:30 PM</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-[10px] text-blue-400 uppercase tracking-widest mb-8 font-bold gsap-reveal">
            <Heart size={10} fill="currentColor" />
            <span>Prometo no llorar... mucho</span>
            <Heart size={10} fill="currentColor" />
          </div>

          <div className="w-full gsap-reveal">
            <button
              onClick={onConfirm}
              className="group relative w-full py-4 rounded-full font-bold text-sm bg-blue-600 text-white shadow-lg hover:bg-blue-700 active:scale-[0.98] transition-all"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                Confirma tu asistencia aquí
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Decorative Bear */}
      <div 
        ref={bearRef}
        className="absolute bottom-10 left-[10%] opacity-20 pointer-events-none hidden lg:block"
      >
        <img src="https://cdn-icons-png.flaticon.com/512/3663/3663414.png" alt="Teddy bear" className="w-32 h-32" />
      </div>
    </section>
  );
}
