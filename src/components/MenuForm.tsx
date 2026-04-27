import { useState } from 'react';
import { User } from 'firebase/auth';
import { saveMenuSelection } from '../lib/firestore';
import { generateThankYouMessage } from '../lib/gemini';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { Check, Loader2, Info, AlertCircle, Sparkles } from 'lucide-react';

interface MenuFormProps {
  user: User;
  onSuccess: (selection: any) => void;
}

const MENU_OPTIONS = [
  {
    id: 'adult_standard',
    name: 'Menú Adulto Clásico',
    description: 'Solomillo de ternera en su jugo.',
    ingredients: 'Entrante: Tabla de ibéricos. Principal: Solomillo con patatas panaderas. Postre: Tarta de queso.',
    allergens: 'Lacteos, Gluten (postre)',
    icon: '🥩'
  },
  {
    id: 'adult_vegan',
    name: 'Menú Adulto Vegano',
    description: 'Moussaka de berenjenas y soja.',
    ingredients: 'Entrante: Ensalada de brotes verdes. Principal: Moussaka vegetal. Postre: Fruta de temporada.',
    allergens: 'Ninguno reportado',
    icon: '🥦'
  },
  {
    id: 'kids',
    name: 'Menú Infantil',
    description: 'Favoritos de los más pequeños.',
    ingredients: 'Entrante: Croquetas. Principal: Escalope de pollo. Postre: Helado de vainilla.',
    allergens: 'Lacteos, Huevo',
    icon: '🎈'
  }
];

export default function MenuForm({ user, onSuccess }: MenuFormProps) {
  const [selectedMenu, setSelectedMenu] = useState('');
  const [observations, setObservations] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const charLimit = 1000;

  const handleSubmit = async () => {
    if (!selectedMenu) return;

    setSubmitting(true);
    setErrorMsg('');
    try {
      const selectedOption = MENU_OPTIONS.find(o => o.id === selectedMenu);
      
      const aiMessage = await generateThankYouMessage(
        user.displayName || 'Invitado', 
        selectedOption?.name || selectedMenu, 
        observations
      );

      const data = {
        userName: user.displayName || 'Invitado',
        userEmail: user.email || '',
        selectedMenu,
        observations,
        aiMessage
      };
      await saveMenuSelection(user.uid, data);
      
      // Manejar la animación de éxito antes de pasar el control
      setIsSuccess(true);
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#3b82f6', '#93c5fd', '#ffffff']
      });
      setTimeout(() => {
        onSuccess({ ...data, userId: user.uid, submittedAt: new Date() });
      }, 2500); // Dar tiempo para ver la animación

    } catch (error: any) {
      console.error(error);
      if (error?.message?.includes('offline') || !navigator.onLine) {
        setErrorMsg("Error de conexión. Por favor, revisa tu conexión a internet e inténtalo de nuevo.");
      } else if (error?.message?.includes('permissions')) {
        setErrorMsg("No tienes permisos para realizar esta acción. Inicia sesión correctamente.");
      } else {
        setErrorMsg("Hubo un problema al procesar tu solicitud. Por favor, inténtalo más tarde.");
      }
      setShowConfirm(false);
    } finally {
      setSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white p-12 rounded-[24px] shadow-sm border border-blue-100 flex flex-col items-center justify-center min-h-[400px]"
      >
        <motion.div 
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", damping: 15, stiffness: 200 }}
          className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-6 relative"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="absolute inset-0 bg-blue-500 rounded-full mix-blend-multiply opacity-20 blur-xl animate-pulse"
          />
          <Check size={48} className="text-blue-600 z-10" />
        </motion.div>
        
        <motion.h3 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-2xl font-bold text-deep-blue mb-2 text-center"
        >
          ¡Gracias!
        </motion.h3>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-gray-500 font-sans text-center max-w-xs"
        >
          Menu guardado correctamente, preparando tu invitación...
        </motion.p>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-6 md:p-10 rounded-[24px] shadow-sm border border-blue-100"
    >
      <h2 className="text-3xl font-bold text-deep-blue mb-2 text-center">Elección del Menú</h2>
      <p className="text-center text-gray-400 font-sans text-sm mb-10">
        Personaliza tu experiencia culinaria para el bautizo de Liam.
      </p>

      {errorMsg && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3"
        >
          <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={20} />
          <p className="text-sm font-medium text-red-800">{errorMsg}</p>
        </motion.div>
      )}

      {!showConfirm ? (
        <form onSubmit={(e) => { e.preventDefault(); setShowConfirm(true); }} className="space-y-8">
          <div className="grid grid-cols-1 gap-4">
            {MENU_OPTIONS.map((option, index) => (
              <motion.div 
                key={option.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, ease: "easeOut" }}
                onClick={() => setSelectedMenu(option.id)}
                className={`relative cursor-pointer p-5 rounded-2xl border-[3px] transition-all duration-300 flex flex-col md:flex-row gap-4 items-start md:items-center ${
                  selectedMenu === option.id 
                    ? 'border-blue-500 bg-blue-50/60 shadow-md transform scale-[1.02]' 
                    : 'border-transparent bg-gray-50 hover:border-blue-200 hover:bg-gray-100'
                }`}
              >
                <div className="text-4xl bg-white w-16 h-16 rounded-xl flex items-center justify-center shadow-sm shrink-0">
                  {option.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-deep-blue">{option.name}</h3>
                  <p className="text-sm text-gray-600 mb-1">{option.description}</p>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
                    <span className="text-[10px] text-gray-400"><strong className="text-gray-500 uppercase tracking-tighter">Detalle:</strong> {option.ingredients}</span>
                    <span className="text-[10px] text-gray-400"><strong className="text-red-300 uppercase tracking-tighter">Alérgenos:</strong> {option.allergens}</span>
                  </div>
                </div>
                
                {selectedMenu === option.id && (
                  <div className="absolute top-4 right-4 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center shadow-md">
                    <Check size={14} className="text-white" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          <div className="space-y-2">
            <label className="flex items-center justify-between text-sm font-semibold text-deep-blue px-1">
              <div className="flex items-center gap-2">
                <Info size={16} />
                <span>Observaciones o Intolerancias</span>
              </div>
              <span className={`text-[10px] ${observations.length > charLimit ? 'text-red-500' : 'text-gray-400'}`}>
                {observations.length} / {charLimit}
              </span>
            </label>
            <textarea
              value={observations}
              onChange={(e) => setObservations(e.target.value.slice(0, charLimit + 10))}
              placeholder="Ej: Sin lactosa, alergia al marisco..."
              className={`w-full h-28 p-4 rounded-xl border focus:ring-4 outline-none transition-all font-sans text-sm resize-none bg-gray-50/50 ${
                observations.length > charLimit ? 'border-red-500 focus:ring-red-500/10' : 'border-gray-200 focus:ring-blue-500/10 focus:border-blue-500'
              }`}
            />
            {observations.length > charLimit && (
              <p className="text-xs text-red-500 px-1">Superado el límite de 1000 caracteres.</p>
            )}
          </div>

          <button
            type="submit"
            disabled={!selectedMenu || observations.length > charLimit}
            className={`w-full py-4 rounded-full font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2 ${
              !selectedMenu || observations.length > charLimit
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700 active:scale-[0.98]'
            }`}
          >
            <span>Continuar</span>
          </button>
        </form>
      ) : (
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-center py-4"
        >
          <div className="bg-blue-50 p-6 rounded-2xl mb-8 border border-blue-100">
            <h4 className="text-deep-blue font-bold mb-4">¿Confirmar Selección?</h4>
            <div className="text-left space-y-4 max-w-sm mx-auto">
              <div className="flex justify-between border-b border-blue-200 pb-2">
                <span className="text-xs text-gray-500 uppercase tracking-wider">Tu elección</span>
                <span className="text-sm font-bold text-deep-blue">
                  {MENU_OPTIONS.find(o => o.id === selectedMenu)?.name}
                </span>
              </div>
              <div>
                <span className="text-xs text-gray-500 uppercase tracking-wider block mb-1">Tus observaciones</span>
                <p className="text-sm text-gray-700 italic bg-white p-3 rounded-lg border border-blue-100">
                  {observations || "Ninguna especificada"}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-3">
            <button
              onClick={() => setShowConfirm(false)}
              className="flex-1 py-3 px-6 rounded-full font-bold text-sm text-gray-500 hover:bg-gray-50 border border-gray-200 transition-all"
            >
              Cerrar y Editar
            </button>
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="flex-1 py-3 px-6 rounded-full font-bold text-sm bg-blue-600 text-white hover:bg-blue-700 shadow-lg flex items-center justify-center gap-2 transition-all"
            >
              {submitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Enviando...</span>
                </>
              ) : (
                <span>Confirmar y Enviar</span>
              )}
            </button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
