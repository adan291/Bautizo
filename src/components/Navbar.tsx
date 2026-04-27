import { User } from 'firebase/auth';
import { loginWithGoogle, logout } from '../lib/firebase';
import { LogIn, LogOut, Settings, User as UserIcon } from 'lucide-react';

interface NavbarProps {
  user: User | null;
  isAdmin: boolean;
  onToggleAdmin: () => void;
  showAdmin: boolean;
}

export default function Navbar({ user, isAdmin, onToggleAdmin, showAdmin }: NavbarProps) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#f5f5f0]/80 backdrop-blur-sm border-bottom border-[#e5e5d1]">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
            <span className="text-white text-xs font-bold">L</span>
          </div>
          <span className="font-bold text-lg text-deep-blue hidden sm:block">Bautizo de Liam</span>
        </div>

        <div className="flex items-center gap-4">
          {isAdmin && (
            <button
              onClick={onToggleAdmin}
              className={`p-2 rounded-full transition-colors ${
                showAdmin ? 'bg-[#5A5A40] text-white' : 'text-[#5A5A40] hover:bg-[#e5e5d1]'
              }`}
              title="Admin Panel"
            >
              <Settings size={20} />
            </button>
          )}

          {user ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1 bg-white rounded-full border border-[#e5e5d1]">
                {user.photoURL ? (
                  <img src={user.photoURL} alt={user.displayName || ''} className="w-6 h-6 rounded-full" referrerPolicy="no-referrer" />
                ) : (
                  <UserIcon size={16} />
                )}
                <span className="text-sm font-sans text-gray-700 hidden md:block">{user.displayName}</span>
              </div>
              <button
                onClick={logout}
                className="text-[#5A5A40]/60 hover:text-[#5A5A40] transition-colors p-2"
                title="Cerrar sesión"
              >
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <button
              onClick={loginWithGoogle}
              className="flex items-center gap-2 bg-[#5A5A40] text-white px-5 py-2 rounded-full hover:bg-[#4a4a35] transition-all font-sans text-sm shadow-sm"
            >
              <LogIn size={18} />
              <span>Entrar</span>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
