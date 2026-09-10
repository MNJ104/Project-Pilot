import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sparkles, ArrowRight, AlertCircle } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.message || 'Login failed. Please verify your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-6 relative overflow-hidden">
      {/* Dynamic Background Accents */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-tr from-sky-500 to-blue-600 rounded-2xl shadow-xl shadow-sky-500/20 mb-4">
            <Sparkles className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Welcome Back</h1>
          <p className="text-slate-400 text-sm mt-1">Sign in to your Project Pilot software planning workspace</p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-8 shadow-2xl backdrop-blur-xl">
          {error && (
            <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-start space-x-3 text-rose-300 text-xs">
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full bg-slate-950/80 border border-slate-800 focus:border-sky-500 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition-all"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Password
                </label>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-950/80 border border-slate-800 focus:border-sky-500 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-semibold py-3 px-4 rounded-xl shadow-lg shadow-sky-500/25 flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
            >
              <span>{isSubmitting ? 'Authenticating...' : 'Sign In to Workspace'}</span>
              {!isSubmitting && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-800 text-center text-xs text-slate-400">
            Don't have an account?{' '}
            <Link to="/register" className="text-sky-400 font-semibold hover:underline">
              Create Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
