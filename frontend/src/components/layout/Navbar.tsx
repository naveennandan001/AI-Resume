import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Sparkles, LogOut, User as UserIcon, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Navbar: React.FC = () => {
  const { user, logout, demoLogin } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="h-16 border-b border-slate-800 bg-slate-900/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-40">
      <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/dashboard')}>
        <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
          <Sparkles className="w-5 h-5" />
        </div>
        <div>
          <span className="font-bold text-lg text-white tracking-tight">CareerAI</span>
          <span className="hidden sm:inline-block ml-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
            Coach PRO
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {user ? (
          <>
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/80 border border-slate-700 text-xs text-slate-300">
              <Award className="w-4 h-4 text-emerald-400" />
              <span>Career Score: <strong className="text-emerald-400 font-semibold">78/100</strong></span>
            </div>

            <div className="flex items-center gap-3 border-l border-slate-800 pl-4">
              <div className="w-8 h-8 rounded-full bg-slate-700 text-white flex items-center justify-center font-medium text-xs border border-slate-600">
                {user.name.charAt(0)}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-medium text-white">{user.name}</p>
                <p className="text-[10px] text-slate-400 truncate max-w-[120px]">{user.email}</p>
              </div>

              <button
                onClick={logout}
                title="Log out"
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </>
        ) : (
          <div className="flex items-center gap-3">
            <button
              onClick={() => demoLogin().then(() => navigate('/dashboard'))}
              className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium text-xs hover:brightness-110 shadow-md shadow-cyan-500/20 transition-all flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Try Demo
            </button>
            <button
              onClick={() => navigate('/login')}
              className="px-3 py-1.5 rounded-lg border border-slate-700 text-slate-300 hover:text-white text-xs font-medium hover:bg-slate-800 transition-colors"
            >
              Sign In
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
