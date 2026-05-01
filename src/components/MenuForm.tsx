import { useState } from 'react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import { Check, Loader2, AlertCircle, User } from 'lucide-react';

interface MenuFormProps {
  onSuccess: (selection: any) => void;
}

const PLATO_OPTIONS = [
  {
    id: 'rapito',
    name: 'Rapito del Cantábrico',
    emoji: '🐟',
    color: 'bg-blue-500',
  },
  {
    id: 'entrecot',
    name: 'Entrecot',
    emoji: '🥩',
    color: 'bg-amber-500',
  }
];

export default function MenuForm({ onSuccess }: MenuFormProps) {
  const [name, setName] = useState('');
  const [selectedPlato, setSelectedPlato] = useState('');
  const [observations, setObservations] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const isFormValid = name.trim().length >= 2 && selectedPlato !== '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    setSubmitting(true);
    setErrorMsg('');
    
    try {
      const data = {
        name: name.trim(),
        selectedPlato,
        platoName: PLATO_OPTIONS.find(o => o.id === selectedPlato)?.name || selectedPlato,
        observations,
        submittedAt: new Date().toISOString()
      };

      // Guardar en localStorage
      const existing = JSON.parse(localStorage.getItem('bautizo_responses') || '[]');
      existing.push(data);
      localStorage.setItem('bautizo_responses', JSON.stringify(existing));

      // Enviar a Google Sheets (si está configurado)
      const GOOGLE_SCRIPT_URL = import.meta.env.VITE_GOOGLE_SCRIPT_URL;
      console.log('URL Google Script:', GOOGLE_SCRIPT_URL);
      console.log('Datos a enviar:', data);
      
      if (GOOGLE_SCRIPT_URL) {
        try {
          await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
          });
          console.log('Enviado a Google Sheets');
        } catch (err) {
          console.error('Error enviando a Google Sheets:', err);
        }
      } else {
        console.log('No hay URL de Google Script configurada');
      }

      setIsSuccess(true);
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#3b82f6', '#93c5fd', '#fcd34d', '#ffffff']
      });
      
      setTimeout(() => {
        onSuccess(data);
      }, 2000);

    } catch (error: any) {
      console.error(error);
      setErrorMsg("Hubo un problema al enviar. Por favor, inténtalo de nuevo.");
    } finally {
      setSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white p-12 rounded-[32px] shadow-xl border border-blue-100 flex flex-col items-center justify-center min-h-[300px]"
      >
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", damping: 12 }}
          className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mb-6 shadow-lg"
        >
          <Check size={40} className="text-white" strokeWidth={3} />
        </motion.div>
        
        <h3 className="text-2xl font-serif font-semibold text-slate-800 mb-2">
          ¡Gracias, {name}!
        </h3>
        <p className="text-slate-500 text-center">
          Tu selección ha sido guardada. ¡Te esperamos!
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-[32px] shadow-xl border border-blue-100 overflow-hidden"
    >
      {/* Imagen del menú */}
      <div className="relative">
        <img 
          src="/img/comida.jpeg" 
          alt="Menú del Bautizo" 
          className="w-full h-auto"
        />
      </div>

      {/* Selector de plato - fuera de la imagen para mejor visibilidad */}
      <div className="p-6 bg-gradient-to-b from-blue-50 to-white border-b border-blue-100">
        <p className="text-center text-slate-700 font-semibold mb-4 text-lg">
          🍽️ ¿Qué plato prefieres?
        </p>
        <div className="grid grid-cols-2 gap-4">
          {PLATO_OPTIONS.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => setSelectedPlato(option.id)}
              className={`relative py-5 px-4 rounded-2xl font-bold text-base transition-all flex flex-col items-center justify-center gap-2 border-3 ${
                selectedPlato === option.id
                  ? `${option.color} text-white shadow-lg scale-105 border-transparent`
                  : 'bg-white text-slate-700 hover:bg-gray-50 border-gray-200 hover:border-blue-300'
              }`}
            >
              <span className="text-4xl">{option.emoji}</span>
              <span className="text-center leading-tight">{option.name}</span>
              {selectedPlato === option.id && (
                <div className="absolute -top-2 -right-2 w-7 h-7 bg-green-500 rounded-full flex items-center justify-center shadow-md">
                  <Check size={16} className="text-white" />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="p-6 space-y-5">
        {errorMsg && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
            <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={20} />
            <p className="text-sm font-medium text-red-800">{errorMsg}</p>
          </div>
        )}

        {/* Nombre */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <User size={16} className="text-blue-500" />
            <span>Tu nombre</span>
            <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ej: Gabriela López"
            required
            className="w-full p-4 rounded-xl border-2 border-gray-100 focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-sm"
          />
        </div>

        {/* Observaciones */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700">
            Alergias o intolerancias <span className="text-gray-400 font-normal">(opcional)</span>
          </label>
          <textarea
            value={observations}
            onChange={(e) => setObservations(e.target.value)}
            placeholder="Ej: Sin gluten, alergia al marisco..."
            className="w-full h-20 p-4 rounded-xl border-2 border-gray-100 focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-sm resize-none"
          />
        </div>

        {/* Botón enviar */}
        <button
          type="submit"
          disabled={!isFormValid || submitting}
          className={`w-full py-4 rounded-full font-bold text-base transition-all flex items-center justify-center gap-2 ${
            !isFormValid || submitting
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg hover:shadow-xl active:scale-[0.98]'
          }`}
        >
          {submitting ? (
            <>
              <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} />
              <span>Enviando...</span>
            </>
          ) : (
            <>
              <Check size={20} />
              <span>Confirmar Asistencia</span>
            </>
          )}
        </button>
      </form>
    </motion.div>
  );
}
