import { motion } from 'motion/react';
import { CheckCircle2, Utensils, AlertTriangle, Calendar, Sparkles } from 'lucide-react';

interface SelectionSummaryProps {
  selection: {
    selectedMenu: string;
    observations: string;
    submittedAt: any;
    aiMessage?: string;
  };
}

const MENU_NAMES: Record<string, string> = {
  'adult_standard': 'Menú Adulto Clásico',
  'adult_vegan': 'Menú Adulto Vegano',
  'kids': 'Menú Infantil'
};

export default function SelectionSummary({ selection }: SelectionSummaryProps) {
  const dateStr = selection.submittedAt?.toDate 
    ? selection.submittedAt.toDate().toLocaleDateString('es-ES', { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
      })
    : 'Recientemente';

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white p-8 md:p-12 rounded-[32px] shadow-[0_10px_40px_rgba(147,197,253,0.2)] border border-blue-50 text-center relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-200 via-blue-400 to-blue-200 opacity-50"></div>

      <div className="flex justify-center mb-6">
        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center shadow-inner">
          <CheckCircle2 size={32} className="text-blue-500" />
        </div>
      </div>

      <h2 className="text-3xl font-serif text-deep-blue mb-2">¡Asistencia Confirmada!</h2>
      <p className="text-gray-500 font-sans text-sm mb-8">
        Gracias por confirmar tu participación. Hemos guardado tu preferencia de menú.
      </p>

      {selection.aiMessage && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-br from-blue-50/50 to-white p-6 rounded-2xl border border-blue-100 max-w-xl mx-auto mb-10 shadow-sm relative"
        >
          <Sparkles className="absolute -top-3 -right-3 text-blue-300 w-8 h-8 opacity-50" />
          <p className="font-serif text-lg text-blue-800 leading-relaxed italic">
            "{selection.aiMessage}"
          </p>
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-xl mx-auto mb-10">
        <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 flex flex-col items-center">
          <Utensils size={20} className="text-gray-400 mb-3" />
          <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-1">Tu Menú</span>
          <p className="font-bold text-deep-blue">{MENU_NAMES[selection.selectedMenu] || 'Seleccionado'}</p>
        </div>

        <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 flex flex-col items-center">
          <Calendar size={20} className="text-gray-400 mb-3" />
          <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-1">Confirmado el</span>
          <p className="font-bold text-deep-blue">{dateStr}</p>
        </div>
      </div>

      {selection.observations && (
        <div className="p-6 bg-orange-50/50 rounded-2xl border border-orange-100 flex flex-col items-center max-w-xl mx-auto mb-10">
          <div className="flex items-center gap-2 mb-2 text-orange-500">
            <AlertTriangle size={16} />
            <span className="text-[10px] uppercase tracking-widest font-bold">Observaciones</span>
          </div>
          <p className="font-sans text-sm text-gray-600 italic">
            "{selection.observations}"
          </p>
        </div>
      )}

      <p className="text-xs text-gray-400 font-sans leading-relaxed max-w-md mx-auto">
        Si necesitas realizar algún cambio, por favor contacta directamente con los padres de Liam. 
        ¡Estamos deseando verte allí!
      </p>
    </motion.div>
  );
}
