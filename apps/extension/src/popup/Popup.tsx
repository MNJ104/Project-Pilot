import React, { useState, useEffect } from 'react';
import { storage } from '../utils/storage';
import { ExtensionProject, ExtractionPayload } from '../types/extension';
import {
  Sparkles,
  Search,
  Bookmark,
  MessageSquare,
  ExternalLink,
  Settings,
  AlertTriangle,
  CheckCircle2,
  Lock,
  Layers,
  ArrowRight,
  RefreshCw,
  FileText
} from 'lucide-react';

export const Popup: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [authLoading, setAuthLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);

  const [projects, setProjects] = useState<ExtensionProject[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [isRestrictedPage, setIsRestrictedPage] = useState<boolean>(false);
  const [currentUrl, setCurrentUrl] = useState<string>('');

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [extractedData, setExtractedData] = useState<ExtractionPayload | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [showAiModal, setShowAiModal] = useState<boolean>(false);

  useEffect(() => {
    checkInitialState();
  }, []);

  const checkInitialState = async () => {
    setAuthLoading(true);
    const token = await storage.getToken();
    setIsAuthenticated(!!token);

    // Check active tab URL for restricted pages
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (tab?.url) {
        setCurrentUrl(tab.url);
        if (
          tab.url.startsWith('chrome://') ||
          tab.url.startsWith('edge://') ||
          tab.url.startsWith('about:') ||
          tab.url.includes('chrome.google.com/webstore')
        ) {
          setIsRestrictedPage(true);
        }
      }
    } catch {
      // Ignored in non-extension browser preview
    }

    if (token) {
      await fetchProjects();
    }
    setAuthLoading(false);
  };

  const fetchProjects = async () => {
    const backendUrl = await storage.getBackendUrl();
    const token = await storage.getToken();

    try {
      const res = await fetch(`${backendUrl}/projects`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setProjects(data);
        const activeId = await storage.getActiveProjectId();
        if (activeId && data.some((p: ExtensionProject) => p.id === activeId)) {
          setSelectedProjectId(activeId);
        } else if (data.length > 0) {
          setSelectedProjectId(data[0].id);
          await storage.setActiveProjectId(data[0].id);
        }
      }
    } catch {
      const cached = await storage.getCachedProjects();
      setProjects(cached);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthLoading(true);

    const backendUrl = await storage.getBackendUrl();

    try {
      const res = await fetch(`${backendUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailInput, password: passwordInput })
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: 'Invalid credentials' }));
        throw new Error(err.detail || 'Login failed');
      }

      const data = await res.json();
      await storage.setToken(data.token);
      setIsAuthenticated(true);
      await fetchProjects();
    } catch (err: any) {
      setAuthError(err.message || 'Login failed.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleProjectChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    setSelectedProjectId(id);
    await storage.setActiveProjectId(id);
  };

  const handleAnalyzePage = async () => {
    if (isRestrictedPage) return;
    setIsLoading(true);
    setErrorMessage(null);
    setStatusMessage('Extracting webpage DOM & stripping noise...');

    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (!tab.id) throw new Error('No active browser tab found.');

      const response: any = await chrome.tabs.sendMessage(tab.id, { type: 'ANALYZE_PAGE' });
      if (!response?.success) {
        throw new Error(response?.error || 'Failed to extract DOM from active page.');
      }

      setExtractedData(response.data);
      setStatusMessage('Content extracted. Saving to active project...');

      // Save to backend via background worker
      const bgResponse: any = await chrome.runtime.sendMessage({
        type: 'SAVE_SOURCE_TO_BACKEND',
        payload: { projectId: selectedProjectId, extraction: response.data }
      });

      if (bgResponse?.success) {
        setSaveSuccess(true);
        setStatusMessage('Page captured & saved to project workspace!');
      } else {
        setErrorMessage(bgResponse?.error || 'Page extracted locally, but failed to persist to backend.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Analysis failed. Make sure page is loaded completely.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCaptureSelection = async () => {
    if (isRestrictedPage) return;
    setIsLoading(true);
    setErrorMessage(null);
    setStatusMessage('Capturing highlighted text...');

    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (!tab.id) throw new Error('No active browser tab found.');

      const response: any = await chrome.tabs.sendMessage(tab.id, { type: 'CAPTURE_SELECTION' });
      if (!response?.success) {
        throw new Error(response?.error || 'Please highlight text on the webpage first.');
      }

      setExtractedData(response.data);

      const bgResponse: any = await chrome.runtime.sendMessage({
        type: 'SAVE_SOURCE_TO_BACKEND',
        payload: { projectId: selectedProjectId, extraction: response.data }
      });

      if (bgResponse?.success) {
        setSaveSuccess(true);
        setStatusMessage('Selection saved to project!');
      } else {
        setErrorMessage(bgResponse?.error || 'Selection captured locally, but failed to persist.');
      }
    } catch (err: any) {
      setErrorMessage(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenDashboard = () => {
    chrome.tabs.create({ url: 'http://localhost:3000/dashboard' });
  };

  const handleOpenOptions = () => {
    chrome.runtime.openOptionsPage();
  };

  if (authLoading) {
    return (
      <div className="p-6 bg-slate-950 text-slate-100 flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-3 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
        <span className="text-xs text-slate-400 mt-3">Connecting to Project Pilot...</span>
      </div>
    );
  }

  return (
    <div className="p-4 bg-slate-950 text-slate-100 min-h-[500px] flex flex-col justify-between">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 bg-gradient-to-tr from-sky-500 to-blue-600 rounded-lg flex items-center justify-center shadow-md">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="text-sm font-bold text-white tracking-wide">Project Pilot</span>
              <span className="ml-1.5 text-[9px] bg-sky-950 text-sky-400 px-1.5 py-0.5 rounded border border-sky-800/60 uppercase font-semibold">
                MV3
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-1">
            <button
              onClick={handleOpenOptions}
              className="p-1.5 text-slate-400 hover:text-white rounded-md hover:bg-slate-800 transition-colors"
              title="Settings & Config"
            >
              <Settings className="w-4 h-4" />
            </button>
            <button
              onClick={handleOpenDashboard}
              className="p-1.5 text-slate-400 hover:text-sky-400 rounded-md hover:bg-slate-800 transition-colors"
              title="Open Web Dashboard"
            >
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Unauthenticated View */}
        {!isAuthenticated ? (
          <div className="mt-4 space-y-4">
            <div className="p-3 bg-slate-900/90 border border-slate-800 rounded-xl text-center">
              <Lock className="w-6 h-6 text-sky-400 mx-auto mb-1.5" />
              <h3 className="text-xs font-semibold text-white">Sign In Required</h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Sign in to sync captured web sources with your Project Pilot dashboard.
              </p>
            </div>

            {authError && (
              <div className="p-2.5 bg-rose-500/10 border border-rose-500/30 rounded-lg text-rose-300 text-xs flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-3">
              <div>
                <label className="block text-[10px] font-semibold uppercase text-slate-400 mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:border-sky-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold uppercase text-slate-400 mb-1">Password</label>
                <input
                  type="password"
                  required
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:border-sky-500 outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-sky-600 hover:bg-sky-500 text-white font-semibold py-2 rounded-lg text-xs transition-colors shadow-md shadow-sky-600/20"
              >
                Sign In to Extension
              </button>
            </form>

            <button
              onClick={handleOpenDashboard}
              className="w-full text-center text-xs text-slate-400 hover:text-sky-400 py-1 transition-colors"
            >
              Open Dashboard in Browser →
            </button>
          </div>
        ) : (
          /* Authenticated Active View */
          <div className="mt-3 space-y-3">
            {/* Restricted Page Warning */}
            {isRestrictedPage && (
              <div className="p-2.5 bg-amber-500/10 border border-amber-500/30 rounded-lg text-amber-300 text-xs flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold">Restricted Page</div>
                  <div className="text-[10px] text-amber-200/80">
                    Content scripts cannot run on browser system pages ({currentUrl.substring(0, 30)}...). Navigate to a regular website to capture content.
                  </div>
                </div>
              </div>
            )}

            {/* Active Project Dropdown Selector */}
            <div>
              <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1 flex justify-between">
                <span>Active Target Project</span>
                <span className="text-emerald-400 font-mono text-[9px]">JWT Active</span>
              </label>
              <select
                value={selectedProjectId}
                onChange={handleProjectChange}
                className="w-full bg-slate-900 border border-slate-800 focus:border-sky-500 rounded-lg px-3 py-2 text-xs text-slate-200 outline-none"
              >
                {projects.length === 0 ? (
                  <option value="">Default Planning Workspace</option>
                ) : (
                  projects.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.title}
                    </option>
                  ))
                )}
              </select>
            </div>

            {/* Status & Error Messages */}
            {statusMessage && (
              <div className="p-2 bg-sky-950/60 border border-sky-800/60 rounded-lg text-xs text-sky-300 flex items-center space-x-2">
                {isLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin text-sky-400" /> : <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                <span className="truncate">{statusMessage}</span>
              </div>
            )}

            {errorMessage && (
              <div className="p-2 bg-rose-500/10 border border-rose-500/30 rounded-lg text-xs text-rose-300 flex items-center space-x-2">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                <span className="truncate">{errorMessage}</span>
              </div>
            )}

            {/* Main Action Buttons Grid */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={handleAnalyzePage}
                disabled={isLoading || isRestrictedPage}
                className="flex items-center justify-center space-x-1.5 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-semibold py-2.5 px-3 rounded-lg text-xs shadow-md shadow-sky-500/20 disabled:opacity-50 transition-all"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Analyze Page</span>
              </button>

              <button
                onClick={handleCaptureSelection}
                disabled={isLoading || isRestrictedPage}
                className="flex items-center justify-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium py-2.5 px-3 rounded-lg text-xs disabled:opacity-50 transition-colors"
              >
                <Bookmark className="w-3.5 h-3.5 text-indigo-400" />
                <span>Capture Selection</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleAnalyzePage}
                disabled={isLoading || isRestrictedPage}
                className="flex items-center justify-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium py-2 px-3 rounded-lg text-xs disabled:opacity-50 transition-colors"
              >
                <FileText className="w-3.5 h-3.5 text-emerald-400" />
                <span>Save to Project</span>
              </button>

              <button
                onClick={() => setShowAiModal(true)}
                className="flex items-center justify-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-purple-300 border border-purple-900/60 font-medium py-2 px-3 rounded-lg text-xs transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5 text-purple-400" />
                <span>Ask AI (Phase 8)</span>
              </button>
            </div>

            {/* Analysis Summary Card */}
            {extractedData && (
              <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-2 text-xs animate-fade-in">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-white truncate max-w-[200px]">
                    {extractedData.pageTitle}
                  </span>
                  <span className="text-[9px] bg-sky-950 text-sky-300 px-2 py-0.5 rounded border border-sky-800 font-mono">
                    {extractedData.sourceType}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-800 text-[11px]">
                  <div>
                    <span className="text-slate-400">Headings Found:</span>
                    <span className="ml-1 text-slate-200 font-medium">{extractedData.headings.length}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Code Blocks:</span>
                    <span className="ml-1 text-slate-200 font-medium">{extractedData.codeBlocks.length}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Complexity:</span>
                    <span className="ml-1 text-emerald-400 font-medium">MEDIUM</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Feasibility:</span>
                    <span className="ml-1 text-emerald-400 font-medium">HIGH</span>
                  </div>
                </div>

                {saveSuccess && (
                  <button
                    onClick={handleOpenDashboard}
                    className="w-full mt-2 bg-slate-800 hover:bg-slate-700 text-sky-400 hover:text-sky-300 font-medium py-1.5 rounded-lg text-[11px] flex items-center justify-center space-x-1 border border-slate-700 transition-colors"
                  >
                    <span>View Full Analysis in Dashboard</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Ask AI Placeholder Modal */}
      {showAiModal && (
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 w-full max-w-xs space-y-3">
            <div className="flex items-center space-x-2 text-purple-400 text-xs font-semibold">
              <MessageSquare className="w-4 h-4" />
              <span>Project Pilot AI Copilot</span>
            </div>
            <h3 className="text-sm font-bold text-white">Ask AI Assistant</h3>
            <p className="text-xs text-slate-400">
              Interactive contextual AI Chat Assistant will be active in <strong>Phase 8</strong>. You will be able to query requirements, architecture diagrams, and cost models directly from this extension.
            </p>
            <div className="pt-2">
              <button
                onClick={() => setShowAiModal(false)}
                className="w-full bg-slate-800 hover:bg-slate-700 text-white font-medium py-2 rounded-lg text-xs border border-slate-700"
              >
                Close Placeholder
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer Navigation */}
      <div className="pt-3 border-t border-slate-800 flex justify-between items-center text-[10px] text-slate-400">
        <span>Project Pilot v1.0.0</span>
        <button onClick={handleOpenDashboard} className="hover:text-sky-400 transition-colors">
          Open Full SaaS App →
        </button>
      </div>
    </div>
  );
};
