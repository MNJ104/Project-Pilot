import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { TechStackItemDto } from '../types/ai-types';
import { Sparkles, Layers, RefreshCw, LayoutTemplate, Cpu, Database, Server, Cloud, Bot } from 'lucide-react';

interface TechStackViewProps {
  projectId: string;
}

export const TechStackView: React.FC<TechStackViewProps> = ({ projectId }) => {
  const [techStack, setTechStack] = useState<TechStackItemDto[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [generating, setGenerating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (projectId) {
      loadTechStack();
    }
  }, [projectId]);

  const loadTechStack = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getTechStack(projectId);
      setTechStack(data || []);
    } catch {
      setTechStack([]);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    try {
      setGenerating(true);
      setError(null);
      const result = await api.generateTechStack(projectId);
      setTechStack(result || []);
    } catch (err: any) {
      setError(err?.message || 'Failed to recommend technology stack');
    } finally {
      setGenerating(false);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toUpperCase()) {
      case 'FRONTEND':
        return <LayoutTemplate className="w-5 h-5 text-sky-400" />;
      case 'BACKEND':
        return <Server className="w-5 h-5 text-indigo-400" />;
      case 'DATABASE':
        return <Database className="w-5 h-5 text-purple-400" />;
      case 'DEVOPS':
        return <Cloud className="w-5 h-5 text-amber-400" />;
      case 'AI_MODELS':
        return <Bot className="w-5 h-5 text-emerald-400" />;
      default:
        return <Cpu className="w-5 h-5 text-slate-400" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12 text-slate-400">
        <RefreshCw className="w-6 h-6 animate-spin text-sky-400 mr-2" />
        <span>Loading technology recommendations...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 p-6 rounded-2xl">
        <div>
          <div className="flex items-center gap-2 text-purple-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <Layers className="w-4 h-4" />
            <span>Phase 6 • Technology Evaluation</span>
          </div>
          <h2 className="text-xl font-bold text-white">Full-Stack Architecture Recommendations</h2>
          <p className="text-slate-400 text-xs mt-1">
            Production-grade technology selections paired with architectural trade-off justifications.
          </p>
        </div>

        <button
          onClick={handleGenerate}
          disabled={generating}
          className="px-4 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-xl text-xs font-semibold flex items-center space-x-2 transition-all shadow-lg shadow-purple-600/20 disabled:opacity-50"
        >
          {generating ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Analyzing Stacks...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>{techStack.length > 0 ? 'Re-evaluate Stack' : 'Recommend Tech Stack'}</span>
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="bg-rose-950/40 border border-rose-800/60 text-rose-300 text-xs p-4 rounded-xl">
          {error}
        </div>
      )}

      {techStack.length === 0 ? (
        <div className="bg-slate-900/40 border border-dashed border-slate-800 rounded-2xl p-12 text-center">
          <Layers className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-slate-300">No Tech Stack Recommendations Yet</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Click the "Recommend Tech Stack" button to have Gemini evaluate your requirements and suggest an optimal, battle-tested modern tech stack.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {techStack.map((item, idx) => (
            <div
              key={idx}
              className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3 hover:border-slate-700 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-slate-950 rounded-xl border border-slate-800">
                    {getCategoryIcon(item.category)}
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                      {item.category}
                    </span>
                    <h4 className="text-base font-bold text-white tracking-tight">
                      {item.technologyName}
                    </h4>
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/40 p-3 rounded-xl border border-slate-900">
                {item.justification}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

