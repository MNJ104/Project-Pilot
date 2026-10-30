import React from 'react';
import { api } from '../services/api';
import { Download, FileText, Database, Code2, FolderArchive, CheckCircle2, Sparkles } from 'lucide-react';

interface ExportCenterViewProps {
  projectId: string;
}

export const ExportCenterView: React.FC<ExportCenterViewProps> = ({ projectId }) => {
  const exportCards = [
    {
      title: 'IEEE 830 SRS Document',
      description: 'Complete Software Requirements Specification formatted as professional Markdown, including functional requirements, FURPS+, architecture, and risk analysis.',
      format: '.MD (Markdown)',
      icon: FileText,
      iconColor: 'text-sky-400',
      bgColor: 'from-sky-950/40 to-slate-900',
      borderColor: 'border-sky-800/40',
      buttonColor: 'bg-sky-600 hover:bg-sky-500',
      url: api.exportMarkdown(projectId),
      filename: 'blueprint.md',
    },
    {
      title: 'PostgreSQL Migration DDL',
      description: 'Production-ready SQL migration script with UUID primary keys, foreign key constraints, indexes, and pgcrypto extensions, compatible with PostgreSQL 16 & Flyway.',
      format: '.SQL (DDL)',
      icon: Database,
      iconColor: 'text-indigo-400',
      bgColor: 'from-indigo-950/40 to-slate-900',
      borderColor: 'border-indigo-800/40',
      buttonColor: 'bg-indigo-600 hover:bg-indigo-500',
      url: api.exportSql(projectId),
      filename: 'schema.sql',
    },
    {
      title: 'OpenAPI 3.0 Specification',
      description: 'Machine-readable OpenAPI 3.0 JSON specification containing all REST routes, HTTP verbs, security definitions, and payload schemas for Swagger UI & Postman.',
      format: '.JSON (OpenAPI 3.0)',
      icon: Code2,
      iconColor: 'text-emerald-400',
      bgColor: 'from-emerald-950/40 to-slate-900',
      borderColor: 'border-emerald-800/40',
      buttonColor: 'bg-emerald-600 hover:bg-emerald-500',
      url: api.exportOpenApi(projectId),
      filename: 'openapi.json',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl">
        <div className="flex items-center gap-2 text-sky-400 text-xs font-semibold uppercase tracking-wider mb-1">
          <Download className="w-4 h-4" />
          <span>Phase 11 • Production Artifact Export Center</span>
        </div>
        <h2 className="text-xl font-bold text-white">Download Engineering Blueprints</h2>
        <p className="text-slate-400 text-xs mt-1">
          Export full IEEE 830 documentation, relational database schemas, and OpenAPI specifications.
        </p>
      </div>

      {/* Export Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {exportCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className={`bg-gradient-to-b ${card.bgColor} border ${card.borderColor} rounded-2xl p-6 shadow-xl flex flex-col justify-between space-y-5`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800/80">
                    <Icon className={`w-6 h-6 ${card.iconColor}`} />
                  </div>
                  <span className="text-[10px] font-mono font-bold bg-slate-950 px-2.5 py-1 rounded-md border border-slate-800 text-slate-300">
                    {card.format}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white tracking-tight">{card.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{card.description}</p>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-800/60">
                <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Real generated project artifacts</span>
                </div>

                <a
                  href={card.url}
                  download={card.filename}
                  target="_blank"
                  rel="noreferrer"
                  className={`w-full py-2.5 ${card.buttonColor} text-white rounded-xl text-xs font-semibold flex items-center justify-center space-x-2 transition-all shadow-md`}
                >
                  <Download className="w-4 h-4" />
                  <span>Download {card.format.split(' ')[0]}</span>
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

