import React, { useState, useEffect } from 'react';
import { storage } from '../utils/storage';
import { Sparkles, Settings, Save, CheckCircle2, Shield, Trash2, ArrowLeft } from 'lucide-react';

export const Options: React.FC = () => {
  const [backendUrl, setBackendUrl] = useState<string>('http://localhost:8080/api/v1');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isSaved, setIsSaved] = useState<boolean>(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const url = await storage.getBackendUrl();
    const token = await storage.getToken();
    setBackendUrl(url);
    setIsAuthenticated(!!token);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await storage.setBackendUrl(backendUrl.trim());
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleClearAuth = async () => {
    await storage.clearToken();
    setIsAuthenticated(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-6">
      <div className="w-full max-w-xl">
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-10 h-10 bg-gradient-to-tr from-sky-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-sky-500/20">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Extension Settings</h1>
            <p className="text-slate-400 text-xs mt-0.5">Configure Project Pilot Chrome Extension parameters</p>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6">
          {isSaved && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Settings saved successfully!</span>
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Backend REST API Endpoint Base URL
              </label>
              <input
                type="text"
                value={backendUrl}
                onChange={(e) => setBackendUrl(e.target.value)}
                placeholder="http://localhost:8080/api/v1"
                className="w-full bg-slate-950 border border-slate-800 focus:border-sky-500 rounded-xl px-4 py-3 text-sm text-white font-mono outline-none"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Default: <code className="text-slate-400">http://localhost:8080/api/v1</code>
              </p>
            </div>

            <button
              type="submit"
              className="bg-sky-600 hover:bg-sky-500 text-white font-semibold py-2.5 px-5 rounded-xl text-xs flex items-center space-x-2 transition-colors shadow-md shadow-sky-600/20"
            >
              <Save className="w-4 h-4" />
              <span>Save Configuration</span>
            </button>
          </form>

          <div className="pt-6 border-t border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold text-white">Authentication Session State</div>
                <div className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                  <Shield className={isAuthenticated ? "w-3.5 h-3.5 text-emerald-400" : "w-3.5 h-3.5 text-slate-500"} />
                  <span>Status: {isAuthenticated ? 'Active JWT Token Present' : 'No Token (Signed Out)'}</span>
                </div>
              </div>

              {isAuthenticated && (
                <button
                  onClick={handleClearAuth}
                  className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 px-3 py-1.5 rounded-lg text-xs flex items-center space-x-1.5 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                  <span>Clear Token</span>
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <a
            href="http://localhost:3000/dashboard"
            target="_blank"
            rel="noreferrer"
            className="text-xs text-slate-400 hover:text-sky-400 inline-flex items-center space-x-1 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Project Pilot Web Dashboard</span>
          </a>
        </div>
      </div>
    </div>
  );
};
