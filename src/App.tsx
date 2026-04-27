import { useState, useEffect } from 'react';
import { auth, loginWithGoogle } from './lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { isUserAdmin, getMenuSelection } from './lib/firestore';
import { motion, AnimatePresence } from 'motion/react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import MenuForm from './components/MenuForm';
import SelectionSummary from './components/SelectionSummary';
import AdminDashboard from './components/AdminDashboard';
import { Loader2 } from 'lucide-react';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [userDataLoading, setUserDataLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [existingSelection, setExistingSelection] = useState<any>(null);
  const [showAdmin, setShowAdmin] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setLoading(true);
      setUser(user);
      if (user) {
        setUserDataLoading(true);
        try {
          const [adminStatus, selection] = await Promise.all([
            isUserAdmin(user.email, user.uid),
            getMenuSelection(user.uid)
          ]);
          setIsAdmin(adminStatus);
          setExistingSelection(selection);
          if (selection) setShowMenu(true);
        } catch (error) {
          console.error("Error loading user data:", error);
        } finally {
          setUserDataLoading(false);
        }
      } else {
        setIsAdmin(false);
        setExistingSelection(null);
        setShowMenu(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleConfirmAttendance = async () => {
    if (!user) {
      try {
        await loginWithGoogle();
      } catch (error) {
        console.error("Login failed:", error);
      }
    } else {
      setShowMenu(true);
      setTimeout(() => {
        document.getElementById('menu-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  if (loading && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F0F7FF]">
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-200">
            <span className="text-white text-2xl font-bold">L</span>
          </div>
          <Loader2 className="w-6 h-6 animate-spin text-blue-300" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F0F7FF] font-sans">
      <Navbar 
        user={user} 
        isAdmin={isAdmin} 
        onToggleAdmin={() => setShowAdmin(!showAdmin)} 
        showAdmin={showAdmin}
      />
      
      <main className="pb-20">
        <AnimatePresence mode="wait">
          {showAdmin && isAdmin ? (
            <motion.div
              key="admin"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <AdminDashboard />
            </motion.div>
          ) : (
            <motion.div
              key="guest"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Hero 
                onConfirm={handleConfirmAttendance} 
                isAuthenticated={!!user} 
              />
              
              <div id="menu-section" className="max-w-3xl mx-auto px-4 mt-12 scroll-mt-24">
                {(showMenu || existingSelection || userDataLoading) && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {userDataLoading ? (
                      <MenuSkeleton />
                    ) : !user ? (
                      <div className="text-center p-12 bg-white rounded-[32px] shadow-sm border border-blue-50">
                        <h2 className="text-2xl font-bold text-deep-blue mb-4">¡Genial que vengas!</h2>
                        <p className="text-gray-500 mb-8 font-sans">
                          Para poder organizar las mesas y el banquete, por favor termina de entrar y elige tu menú.
                        </p>
                      </div>
                    ) : existingSelection ? (
                      <SelectionSummary selection={existingSelection} />
                    ) : (
                      <MenuForm 
                        user={user} 
                        onSuccess={(selection) => setExistingSelection(selection)} 
                      />
                    )}
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="py-12 border-t border-blue-100/50 text-center text-blue-400 text-sm">
        <p className="font-medium">© 2026 Bautizo de Liam</p>
        <p className="text-[10px] uppercase tracking-widest mt-1 opacity-60 italic">"Prometo no llorar... mucho"</p>
      </footer>
    </div>
  );
}

function MenuSkeleton() {
  return (
    <div className="bg-white p-8 md:p-12 rounded-[32px] shadow-sm border border-blue-50 animate-pulse">
      <div className="h-8 bg-gray-100 rounded-full w-48 mx-auto mb-4"></div>
      <div className="h-4 bg-gray-50 rounded-full w-64 mx-auto mb-10"></div>
      <div className="space-y-4">
        <div className="h-24 bg-gray-50 rounded-2xl"></div>
        <div className="h-24 bg-gray-50 rounded-2xl"></div>
        <div className="h-24 bg-gray-50 rounded-2xl"></div>
      </div>
    </div>
  );
}
