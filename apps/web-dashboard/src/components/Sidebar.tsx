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
  Calendar,
  DollarSign,
  AlertTriangle,
  FolderGit2,
  BarChart3,
  Users,
  Plus
} from 'lucide-react';
import { ProjectDto } from '../services/api';

interface SidebarProps {
  activeTab: 'overview' | 'sources';
  onTabChange: (tab: 'overview' | 'sources') => void;
  projects: ProjectDto[];
  activeProjectId: string;
  onProjectChange: (projectId: string) => void;
  onOpenCreateProject: () => void;
}

interface SidebarItem {
  id: 'overview' | 'sources' | string;
  name: string;
  icon: React.ElementType;
  active?: boolean;
  implementedInPhase?: number;
  upcomingPhase?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  projects,
  activeProjectId,
  onProjectChange,
  onOpenCreateProject,
}) => {
  const menuItems: SidebarItem[] = [
    { id: 'overview', name: 'Overview', icon: LayoutDashboard, implementedInPhase: 1 },
    { id: 'sources', name: 'Sources & Content', icon: FolderGit2, implementedInPhase: 3 },
    { id: 'requirements', name: 'Requirements', icon: FileText, upcomingPhase: 'Phase 4' },
    { id: 'features', name: 'Features List', icon: Boxes, upcomingPhase: 'Phase 4' },
    { id: 'architecture', name: 'Architecture', icon: Network, upcomingPhase: 'Phase 5' },
    { id: 'erd', name: 'Database ERD', icon: Database, upcomingPhase: 'Phase 5' },
    { id: 'api', name: 'API Specification', icon: Code2, upcomingPhase: 'Phase 5' },
    { id: 'techstack', name: 'Tech Stack', icon: Layers, upcomingPhase: 'Phase 6' },
    { id: 'sprints', name: 'Sprint Planner', icon: Kanban, upcomingPhase: 'Phase 6' },
    { id: 'timeline', name: 'Gantt Timeline', icon: Calendar, upcomingPhase: 'Phase 6' },
    { id: 'cost', name: 'Cost Model', icon: DollarSign, upcomingPhase: 'Phase 7' },
    { id: 'risks', name: 'Risk Severity', icon: AlertTriangle, upcomingPhase: 'Phase 7' },
    { id: 'collaboration', name: 'Collaboration', icon: Users, upcomingPhase: 'Phase 9' },
    { id: 'analytics', name: 'Analytics', icon: BarChart3, upcomingPhase: 'Phase 12' },
  ];

  return (
    <aside className="w-64 bg-slate-900/95 border-r border-slate-800 flex flex-col shrink-0 min-h-[calc(100vh-4rem)]">
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

      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isImplemented = !!item.implementedInPhase;
          const isSelected = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => isImplemented && onTabChange(item.id as any)}
              disabled={!isImplemented}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all text-left ${
                isSelected
                  ? 'bg-sky-600/20 text-sky-300 border border-sky-500/40 shadow-sm'
                  : isImplemented
                  ? 'text-slate-300 hover:bg-slate-800/60 hover:text-white cursor-pointer'
                  : 'text-slate-500 cursor-not-allowed opacity-75'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon className={`w-4 h-4 ${isSelected ? 'text-sky-400' : isImplemented ? 'text-slate-400' : 'text-slate-600'}`} />
                <span>{item.name}</span>
              </div>

              {isSelected ? (
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              ) : isImplemented ? (
                <span className="text-[9px] bg-emerald-950 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-800 font-mono">
                  P{item.implementedInPhase}
                </span>
              ) : (
                <span className="text-[9px] bg-slate-800 text-slate-500 px-1.5 py-0.5 rounded border border-slate-700 font-mono">
                  {item.upcomingPhase}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800/80 bg-slate-950/40">
        <div className="text-[11px] text-slate-400">
          Backend API: <span className="text-emerald-400 font-mono">Connected</span>
        </div>
        <div className="text-[11px] text-slate-400 mt-1">
          Python AI Service: <span className="text-emerald-400 font-mono">Connected</span>
        </div>
      </div>
    </aside>
  );
};
