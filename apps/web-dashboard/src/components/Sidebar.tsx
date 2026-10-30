import React from 'react';
import {
  LayoutDashboard,
  FileText,
  Boxes,
  Network,
  Database,
  Code2,
  Layers,
  Kanban,
  DollarSign,
  AlertTriangle,
  FolderGit2,
  Download,
  Plus,
  Bot
} from 'lucide-react';
import { ProjectDto } from '../services/api';

export type WorkspaceTab =
  | 'overview'
  | 'sources'
  | 'architecture'
  | 'erd'
  | 'api'
  | 'techstack'
  | 'sprints'
  | 'cost'
  | 'export';

interface SidebarProps {
  activeTab: WorkspaceTab;
  onTabChange: (tab: WorkspaceTab) => void;
  projects: ProjectDto[];
  activeProjectId: string;
  onProjectChange: (projectId: string) => void;
  onOpenCreateProject: () => void;
  onOpenAiChat: () => void;
}

interface SidebarItem {
  id: WorkspaceTab;
  name: string;
  icon: React.ElementType;
  implementedInPhase: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  projects,
  activeProjectId,
  onProjectChange,
  onOpenCreateProject,
  onOpenAiChat,
}) => {
  const menuItems: SidebarItem[] = [
    { id: 'overview', name: 'Overview', icon: LayoutDashboard, implementedInPhase: 1 },
    { id: 'sources', name: 'Sources & Content', icon: FolderGit2, implementedInPhase: 3 },
    { id: 'architecture', name: 'Architecture', icon: Network, implementedInPhase: 5 },
    { id: 'erd', name: 'Database ERD', icon: Database, implementedInPhase: 5 },
    { id: 'api', name: 'API Specification', icon: Code2, implementedInPhase: 5 },
    { id: 'techstack', name: 'Tech Stack', icon: Layers, implementedInPhase: 6 },
    { id: 'sprints', name: 'Sprint Planner', icon: Kanban, implementedInPhase: 6 },
    { id: 'cost', name: 'Cost & Risk Model', icon: DollarSign, implementedInPhase: 7 },
    { id: 'export', name: 'Export Center', icon: Download, implementedInPhase: 11 },
  ];

  return (
    <aside className="w-64 bg-slate-900/95 border-r border-slate-800 flex flex-col shrink-0 min-h-[calc(100vh-4rem)]">
      {/* Active Workspace Selector */}
      <div className="p-4 border-b border-slate-800/80 space-y-2">
        <div className="flex items-center justify-between">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Active Workspace</div>
          <button
            onClick={onOpenCreateProject}
            className="text-[11px] font-semibold text-sky-400 hover:text-sky-300 flex items-center gap-1 hover:underline"
            title="Create New Project"
          >
            <Plus className="w-3 h-3" />
            <span>New</span>
          </button>
        </div>

        <select
          value={activeProjectId}
          onChange={(e) => onProjectChange(e.target.value)}
          className="w-full bg-slate-950 border border-slate-800 focus:border-sky-500 rounded-lg p-2 text-xs font-semibold text-sky-400 outline-none truncate"
        >
          {projects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.title}
            </option>
          ))}
        </select>
      </div>

      {/* AI Copilot Quick Launch Pill */}
      <div className="px-3 pt-3">
        <button
          onClick={onOpenAiChat}
          className="w-full py-2 px-3 bg-gradient-to-r from-sky-600/30 to-indigo-600/30 border border-sky-500/40 hover:border-sky-400 text-sky-300 hover:text-white rounded-xl text-xs font-bold flex items-center justify-between transition-all shadow-sm group"
        >
          <div className="flex items-center space-x-2">
            <Bot className="w-4 h-4 text-sky-400 group-hover:scale-110 transition-transform" />
            <span>AI Copilot</span>
          </div>
          <span className="text-[9px] bg-sky-950 text-sky-300 px-1.5 py-0.5 rounded border border-sky-800 font-mono">
            RAG
          </span>
        </button>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isSelected = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all text-left ${
                isSelected
                  ? 'bg-sky-600/20 text-sky-300 border border-sky-500/40 shadow-sm'
                  : 'text-slate-300 hover:bg-slate-800/60 hover:text-white cursor-pointer'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon className={`w-4 h-4 ${isSelected ? 'text-sky-400' : 'text-slate-400'}`} />
                <span>{item.name}</span>
              </div>

              {isSelected ? (
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              ) : (
                <span className="text-[9px] bg-slate-950 text-emerald-400 px-1.5 py-0.5 rounded border border-slate-800 font-mono">
                  P{item.implementedInPhase}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Connectivity Status Footer */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-950/40 space-y-1">
        <div className="text-[11px] text-slate-400">
          Backend API: <span className="text-emerald-400 font-mono">Connected</span>
        </div>
        <div className="text-[11px] text-slate-400">
          AI Microservice: <span className="text-emerald-400 font-mono">Connected</span>
        </div>
      </div>
    </aside>
  );
};
