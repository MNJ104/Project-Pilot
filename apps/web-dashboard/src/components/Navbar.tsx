import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, User as UserIcon, Shield, Sparkles } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <header className="h-16 bg-slate-900 border-b border-slate-800 px-6 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center space-x-3">
        <div className="w-9 h-9 bg-gradient-to-tr from-sky-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-sky-500/20">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-white tracking-wide">Project Pilot</h1>
          <span className="text-[10px] uppercase tracking-wider font-semibold text-sky-400 bg-sky-950/80 px-2 py-0.5 rounded border border-sky-800/50">
            Phase 1 Active
          </span>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        {user && (
          <div className="flex items-center space-x-3 bg-slate-800/80 border border-slate-700/60 px-3 py-1.5 rounded-lg">
            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-sky-400 font-semibold border border-slate-600">
              {user.fullName ? user.fullName.charAt(0).toUpperCase() : <UserIcon className="w-4 h-4" />}
            </div>
            <div className="text-left hidden md:block">
              <div className="text-sm font-medium text-slate-200">{user.fullName}</div>
              <div className="text-xs text-slate-400 flex items-center gap-1">
                <Shield className="w-3 h-3 text-emerald-400" />
                {user.roles && user.roles.length > 0 ? user.roles[0] : 'USER'}
              </div>
            </div>
          </div>
        )}

        <button
          onClick={logout}
          className="flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white px-3 py-2 rounded-lg text-sm transition-colors border border-slate-700"
          title="Sign Out"
        >
          <LogOut className="w-4 h-4 text-rose-400" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
};
