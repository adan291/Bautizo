import { motion } from 'motion/react';
import { CheckCircle2, User, Utensils, AlertTriangle, Calendar, MapPin, Heart } from 'lucide-react';

interface SelectionSummaryProps {
  selection: {
    name: string;
    selectedPlato: string;
    platoName: string;
    observations: string;
  };
}

export default function SelectionSummary({ selection }: SelectionSummaryProps) {
  const handleAddToCalendar = () => {
    const event = {
      title: 'Bautizo de Liam',
      start: '20260614T130000',
      end: '20260614T180000',
      location: 'Parroquia El Salvador',
      description: 'Ceremonia de bautizo seguida de recepción en Restaurante Marcela Brasa'
    };
    
    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${event.start}/${event.end}&location=${encodeURIComponent(event.location)}&details=${encodeURIComponent(event.description)}`;
    
    window.open(googleCalendarUrl, '_blank');
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-[32px] shadow-xl border border-blue-100 overflow-hidden"
    >
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-8 text-center text-white">
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", damping: 12, delay: 0.2 }}
          className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg"
        >
          <CheckCircle2 size={32} className="text-green-500" />
        </motion.div>
        
        <h2 className="text-2xl font-serif font-semibold mb-2">
          ¡Asistencia Confirmada!
        </h2>
        <p className="text-blue-100">
          Gracias, {selection.name}. ¡Te esperamos!
        </p>
      </div>

      {/* Detalles */}
      <div className="p-6 space-y-4">
        {/* Tu selección */}
        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
            <User size={20} className="text-blue-500" />
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Invitado</p>
            <p className="font-semibold text-slate-800">{selection.name}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
          <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
            <Utensils size={20} className="text-amber-500" />
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Tu plato</p>
            <p className="font-semibold text-slate-800">{selection.platoName}</p>
          </div>
        </div>

        {selection.observations && (
          <div className="flex items-start gap-4 p-4 bg-orange-50 rounded-2xl">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center shrink-0">
              <AlertTriangle size={20} className="text-orange-500" />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Observaciones</p>
              <p className="text-slate-700 italic">"{selection.observations}"</p>
            </div>
          </div>
        )}

        {/* Recordatorio */}
        <div className="p-4 bg-blue-50 rounded-2xl space-y-3">
          <p className="text-xs text-blue-500 uppercase tracking-wider font-semibold">Recuerda</p>
          <div className="flex items-center gap-3 text-sm text-slate-700">
            <Calendar size={16} className="text-blue-400" />
            <span>Domingo, 14 de Junio de 2026</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-slate-700">
            <MapPin size={16} className="text-blue-400" />
            <span>Parroquia El Salvador · 13:00</span>
          </div>
        </div>

        {/* Botón calendario */}
        <button
          onClick={handleAddToCalendar}
          className="w-full py-3 rounded-full font-semibold text-sm bg-blue-50 text-blue-600 hover:bg-blue-100 transition-all flex items-center justify-center gap-2"
        >
          <Calendar size={18} />
          <span>Añadir al Calendario</span>
        </button>

        {/* Footer */}
        <div className="text-center pt-4">
          <div className="flex items-center justify-center gap-2 text-blue-400 text-xs uppercase tracking-widest font-semibold">
            <Heart size={10} fill="currentColor" />
            <span>Nos vemos pronto</span>
            <Heart size={10} fill="currentColor" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
