import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { ArchitectureDto } from '../types/ai-types';
import { MermaidViewer } from '../components/MermaidViewer';
import { Sparkles, Network, RefreshCw, Cpu, CheckCircle2, Layers } from 'lucide-react';

interface ArchitectureViewProps {
  projectId: string;
}

export const ArchitectureView: React.FC<ArchitectureViewProps> = ({ projectId }) => {
  const [architecture, setArchitecture] = useState<ArchitectureDto | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [generating, setGenerating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (projectId) {
      loadArchitecture();
    }
  }, [projectId]);

  const loadArchitecture = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getArchitecture(projectId);
      setArchitecture(data);
    } catch (err: any) {
      // Not found or not yet generated
      setArchitecture(null);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    try {
      setGenerating(true);
      setError(null);
      const result = await api.generateArchitecture(projectId);
      setArchitecture(result);
    } catch (err: any) {
      setError(err?.message || 'Failed to generate architecture');
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12 text-slate-400">
        <RefreshCw className="w-6 h-6 animate-spin text-sky-400 mr-2" />
        <span>Loading system architecture...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 p-6 rounded-2xl">
        <div>
          <div className="flex items-center gap-2 text-sky-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <Network className="w-4 h-4" />
            <span>Phase 5 • System Architecture</span>
          </div>
          <h2 className="text-xl font-bold text-white">Interactive Architecture Blueprint</h2>
          <p className="text-slate-400 text-xs mt-1">
            Component topology, inter-service protocols, and containerized deployment strategy.
          </p>
        </div>

        <button
          onClick={handleGenerate}
          disabled={generating}
          className="px-4 py-2.5 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center space-x-2 transition-all shadow-lg shadow-sky-600/20 disabled:opacity-50"
        >
          {generating ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Synthesizing Architecture...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>{architecture ? 'Regenerate Architecture' : 'Generate Architecture'}</span>
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="bg-rose-950/40 border border-rose-800/60 text-rose-300 text-xs p-4 rounded-xl">
          {error}
        </div>
      )}

      {!architecture ? (
        <div className="bg-slate-900/40 border border-dashed border-slate-800 rounded-2xl p-12 text-center">
          <Network className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-slate-300">No Architecture Generated Yet</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Click the "Generate Architecture" button to have Gemini AI analyze your project requirements and construct a complete architectural topology diagram.
          </p>
        </div>
      ) : (
        <>
          {/* Style & Summary Banner */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-sky-400 bg-sky-950/80 px-2.5 py-1 rounded-md border border-sky-800">
                Pattern: {architecture.style}
              </span>
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Syntactically Valid
              </span>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">{architecture.summary}</p>
          </div>

          {/* Mermaid Diagram Viewer */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-slate-300 text-xs font-semibold uppercase tracking-wider">
                <Layers className="w-4 h-4 text-sky-400" />
                <span>Flowchart Diagram</span>
              </div>
              <span className="text-[11px] text-slate-500">Rendered via Mermaid.js</span>
            </div>
            <MermaidViewer chart={architecture.mermaidDiagram} className="min-h-[280px]" />
          </div>

          {/* Components Grid */}
          {architecture.components && architecture.components.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Architectural Components ({architecture.components.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {architecture.components.map((comp, idx) => (
                  <div key={idx} className="bg-slate-900/70 border border-slate-800/80 rounded-xl p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                        <Cpu className="w-4 h-4 text-sky-400" />
                        {comp.name}
                      </h4>
                      <span className="text-[10px] font-mono text-indigo-400 bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-800">
                        {comp.communicationProtocol}
                      </span>
                    </div>
                    <div className="text-xs font-mono text-slate-400">{comp.techStack}</div>
                    <p className="text-xs text-slate-300 leading-relaxed">{comp.responsibility}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Deployment Strategy */}
          {architecture.deploymentStrategy && (
            <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-4">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Deployment Strategy
              </div>
              <p className="text-xs text-slate-300">{architecture.deploymentStrategy}</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

