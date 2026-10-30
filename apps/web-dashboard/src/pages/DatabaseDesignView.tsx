import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { DatabaseDesignDto } from '../types/ai-types';
import { MermaidViewer } from '../components/MermaidViewer';
import { Sparkles, Database, RefreshCw, Copy, Check, FileCode, CheckCircle2 } from 'lucide-react';

interface DatabaseDesignViewProps {
  projectId: string;
}

export const DatabaseDesignView: React.FC<DatabaseDesignViewProps> = ({ projectId }) => {
  const [databaseDesign, setDatabaseDesign] = useState<DatabaseDesignDto | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [generating, setGenerating] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (projectId) {
      loadDatabase();
    }
  }, [projectId]);

  const loadDatabase = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getDatabase(projectId);
      setDatabaseDesign(data);
    } catch {
      setDatabaseDesign(null);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    try {
      setGenerating(true);
      setError(null);
      const result = await api.generateDatabase(projectId);
      setDatabaseDesign(result);
    } catch (err: any) {
      setError(err?.message || 'Failed to generate database schema');
    } finally {
      setGenerating(false);
    }
  };

  const copySql = () => {
    if (databaseDesign?.migrationSql) {
      navigator.clipboard.writeText(databaseDesign.migrationSql);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12 text-slate-400">
        <RefreshCw className="w-6 h-6 animate-spin text-sky-400 mr-2" />
        <span>Loading database schema...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 p-6 rounded-2xl">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <Database className="w-4 h-4" />
            <span>Phase 5 • Relational Database Schema</span>
          </div>
          <h2 className="text-xl font-bold text-white">Entity-Relationship Model & DDL</h2>
          <p className="text-slate-400 text-xs mt-1">
            Normalized 3NF PostgreSQL DDL, foreign key constraints, and indexing strategy.
          </p>
        </div>

        <button
          onClick={handleGenerate}
          disabled={generating}
          className="px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl text-xs font-semibold flex items-center space-x-2 transition-all shadow-lg shadow-indigo-600/20 disabled:opacity-50"
        >
          {generating ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Synthesizing Schema...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>{databaseDesign ? 'Regenerate Schema' : 'Generate Database'}</span>
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="bg-rose-950/40 border border-rose-800/60 text-rose-300 text-xs p-4 rounded-xl">
          {error}
        </div>
      )}

      {!databaseDesign ? (
        <div className="bg-slate-900/40 border border-dashed border-slate-800 rounded-2xl p-12 text-center">
          <Database className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-slate-300">No Database Schema Generated</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Click the "Generate Database" button to synthesize a complete normalized PostgreSQL schema and interactive ER diagram.
          </p>
        </div>
      ) : (
        <>
          {/* Engine indicator */}
          <div className="flex items-center justify-between bg-slate-900/60 border border-slate-800 rounded-xl p-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
              <span className="text-xs font-mono text-white font-semibold">
                Target Engine: {databaseDesign.dbType} 16
              </span>
            </div>
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              UUID Primary Keys & Timestamps Included
            </span>
          </div>

          {/* ER Diagram */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-slate-300 text-xs font-semibold uppercase tracking-wider">
                <Database className="w-4 h-4 text-indigo-400" />
                <span>Entity-Relationship Diagram</span>
              </div>
              <span className="text-[11px] text-slate-500">Mermaid erDiagram</span>
            </div>
            <MermaidViewer chart={databaseDesign.mermaidErDiagram} className="min-h-[260px]" />
          </div>

          {/* Migration SQL Panel */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-300 text-xs font-semibold uppercase tracking-wider">
                <FileCode className="w-4 h-4 text-purple-400" />
                <span>Flyway-Ready PostgreSQL DDL Migration</span>
              </div>
              <button
                onClick={copySql}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy SQL</span>
                  </>
                )}
              </button>
            </div>

            <pre className="p-4 bg-slate-950 rounded-xl text-xs font-mono text-emerald-300/90 overflow-x-auto border border-slate-800/80 max-h-[380px] leading-relaxed">
              {databaseDesign.migrationSql}
            </pre>
          </div>
        </>
      )}
    </div>
  );
};
