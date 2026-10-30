import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { ApiEndpointDto } from '../types/ai-types';
import { Sparkles, Code2, RefreshCw, Lock, Globe, FileJson, Check, Copy } from 'lucide-react';

interface ApiDesignViewProps {
  projectId: string;
}

export const ApiDesignView: React.FC<ApiDesignViewProps> = ({ projectId }) => {
  const [endpoints, setEndpoints] = useState<ApiEndpointDto[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [generating, setGenerating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'endpoints' | 'openapi'>('endpoints');
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    if (projectId) {
      loadEndpoints();
    }
  }, [projectId]);

  const loadEndpoints = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getApiDesign(projectId);
      setEndpoints(data || []);
    } catch {
      setEndpoints([]);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    try {
      setGenerating(true);
      setError(null);
      const result = await api.generateApiDesign(projectId);
      setEndpoints(result || []);
    } catch (err: any) {
      setError(err?.message || 'Failed to generate API specification');
    } finally {
      setGenerating(false);
    }
  };

  const getMethodBadge = (method: string) => {
    switch (method.toUpperCase()) {
      case 'GET':
        return 'bg-sky-950/80 text-sky-400 border-sky-800';
      case 'POST':
        return 'bg-emerald-950/80 text-emerald-400 border-emerald-800';
      case 'PUT':
        return 'bg-amber-950/80 text-amber-400 border-amber-800';
      case 'DELETE':
        return 'bg-rose-950/80 text-rose-400 border-rose-800';
      case 'PATCH':
        return 'bg-purple-950/80 text-purple-400 border-purple-800';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12 text-slate-400">
        <RefreshCw className="w-6 h-6 animate-spin text-sky-400 mr-2" />
        <span>Loading API specification...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 p-6 rounded-2xl">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <Code2 className="w-4 h-4" />
            <span>Phase 5 • RESTful API Design</span>
          </div>
          <h2 className="text-xl font-bold text-white">OpenAPI 3.0 Contract Specification</h2>
          <p className="text-slate-400 text-xs mt-1">
            Resource paths, HTTP verbs, payload schemas, and Bearer JWT authorization.
          </p>
        </div>

        <button
          onClick={handleGenerate}
          disabled={generating}
          className="px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-semibold flex items-center space-x-2 transition-all shadow-lg shadow-emerald-600/20 disabled:opacity-50"
        >
          {generating ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Synthesizing API...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>{endpoints.length > 0 ? 'Regenerate API' : 'Generate API Design'}</span>
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="bg-rose-950/40 border border-rose-800/60 text-rose-300 text-xs p-4 rounded-xl">
          {error}
        </div>
      )}

      {endpoints.length === 0 ? (
        <div className="bg-slate-900/40 border border-dashed border-slate-800 rounded-2xl p-12 text-center">
          <Code2 className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-slate-300">No API Endpoints Generated</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Click the "Generate API Design" button to automatically synthesize complete RESTful endpoint contracts with authentication constraints and OpenAPI schemas.
          </p>
        </div>
      ) : (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          {/* Table Header Controls */}
          <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-950/40">
            <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Generated Endpoints ({endpoints.length})
            </div>
            <a
              href={api.exportOpenApi(projectId)}
              target="_blank"
              rel="noreferrer"
              className="text-xs text-sky-400 hover:text-sky-300 font-medium flex items-center gap-1.5 hover:underline"
            >
              <FileJson className="w-4 h-4" />
              <span>Download OpenAPI JSON</span>
            </a>
          </div>

          {/* Endpoints Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/50 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-4">Method</th>
                  <th className="py-3 px-4">Path</th>
                  <th className="py-3 px-4">Summary</th>
                  <th className="py-3 px-4">Authentication</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs">
                {endpoints.map((ep, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3.5 px-4">
                      <span className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-mono font-bold border ${getMethodBadge(ep.httpMethod)}`}>
                        {ep.httpMethod}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-medium text-slate-200">
                      {ep.endpointPath}
                    </td>
                    <td className="py-3.5 px-4 text-slate-300 max-w-md">
                      {ep.summary || '—'}
                    </td>
                    <td className="py-3.5 px-4">
                      {ep.authRequired ? (
                        <span className="inline-flex items-center gap-1 text-[11px] text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/80">
                          <Lock className="w-3 h-3" />
                          <span>JWT Required</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/80">
                          <Globe className="w-3 h-3" />
                          <span>Public</span>
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

