import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { Sidebar, WorkspaceTab } from '../components/Sidebar';
import { SourcesPage } from './SourcesPage';
import { ArchitectureView } from './ArchitectureView';
import { DatabaseDesignView } from './DatabaseDesignView';
import { ApiDesignView } from './ApiDesignView';
import { TechStackView } from './TechStackView';
import { SprintsView } from './SprintsView';
import { CostRiskView } from './CostRiskView';
import { ExportCenterView } from './ExportCenterView';
import { AiChatDrawer } from '../components/AiChatDrawer';
import { CreateProjectModal } from '../components/CreateProjectModal';
import { useAuth } from '../context/AuthContext';
import { api, ProjectDto } from '../services/api';
import {
  Sparkles,
  CheckCircle2,
  Shield,
  Activity,
  Server,
  FolderGit2,
  Bot,
  Zap,
  ArrowRight,
  Layers,
  FileCode,
  Download
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<WorkspaceTab>('overview');
  const [projects, setProjects] = useState<ProjectDto[]>([]);
  const [activeProjectId, setActiveProjectId] = useState<string>('');
  const [isCreateProjectOpen, setIsCreateProjectOpen] = useState<boolean>(false);
  const [isAiChatOpen, setIsAiChatOpen] = useState<boolean>(false);
  const [generatingAll, setGeneratingAll] = useState<boolean>(false);
  const [generateAllSuccess, setGenerateAllSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const data = await api.getProjects();
      setProjects(data);
      if (data.length > 0 && !activeProjectId) {
        setActiveProjectId(data[0].id);
      }
    } catch {
      // Handled
    }
  };

  const handleGenerateAll = async () => {
    if (!activeProjectId) return;
    try {
      setGeneratingAll(true);
      setGenerateAllSuccess(null);
      await api.generateFullBlueprint(activeProjectId);
      setGenerateAllSuccess('Complete project blueprint generated! Explore the tabs below to view artifacts.');
      setTimeout(() => setGenerateAllSuccess(null), 6000);
    } catch (err: any) {
      console.error('Failed to generate full blueprint:', err);
    } finally {
      setGeneratingAll(false);
    }
  };

  const activeProject = projects.find((p) => p.id === activeProjectId) || projects[0];

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col selection:bg-sky-500 selection:text-white">
      <Navbar />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          activeTab={activeTab}
          onTabChange={(tab) => setActiveTab(tab)}
          projects={projects}
          activeProjectId={activeProjectId}
          onProjectChange={(id) => setActiveProjectId(id)}
          onOpenCreateProject={() => setIsCreateProjectOpen(true)}
          onOpenAiChat={() => setIsAiChatOpen(true)}
        />

        <main className="flex-1 p-8 overflow-y-auto bg-slate-950">
          <div className="max-w-6xl mx-auto space-y-8">
            {generateAllSuccess && (
              <div className="bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs p-4 rounded-xl flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  {generateAllSuccess}
                </span>
                <button
                  onClick={() => setActiveTab('architecture')}
                  className="font-semibold underline hover:text-white"
                >
                  View Architecture →
                </button>
              </div>
            )}

            {/* View Switching */}
            {activeTab === 'sources' && <SourcesPage activeProjectId={activeProjectId} />}
            {activeTab === 'architecture' && <ArchitectureView projectId={activeProjectId} />}
            {activeTab === 'erd' && <DatabaseDesignView projectId={activeProjectId} />}
            {activeTab === 'api' && <ApiDesignView projectId={activeProjectId} />}
            {activeTab === 'techstack' && <TechStackView projectId={activeProjectId} />}
            {activeTab === 'sprints' && <SprintsView projectId={activeProjectId} />}
            {activeTab === 'cost' && <CostRiskView projectId={activeProjectId} />}
            {activeTab === 'export' && <ExportCenterView projectId={activeProjectId} />}

            {activeTab === 'overview' && (
              <div className="space-y-8">
                {/* Header Banner */}
                <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-sky-950/40 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
                    <div>
                      <div className="flex items-center space-x-2 text-sky-400 text-xs font-semibold uppercase tracking-wider mb-1">
                        <Sparkles className="w-4 h-4" />
                        <span>Project Workspace Active</span>
                      </div>
                      <h2 className="text-2xl font-bold text-white tracking-tight">
                        {activeProject ? activeProject.title : `Welcome back, ${user?.fullName || 'Architect'}`}
                      </h2>
                      <p className="text-slate-400 text-sm mt-1 max-w-xl">
                        {activeProject?.description || 'Autonomous Software Planning & Architecture Engine is online.'}
                      </p>
                    </div>

                    <div className="flex items-center space-x-3">
                      <button
                        onClick={handleGenerateAll}
                        disabled={generatingAll || !activeProjectId}
                        className="px-4 py-2.5 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white rounded-xl text-xs font-bold flex items-center space-x-2 transition-all shadow-lg shadow-sky-600/25 disabled:opacity-50"
                      >
                        <Zap className={`w-4 h-4 ${generatingAll ? 'animate-bounce' : ''}`} />
                        <span>{generatingAll ? 'Synthesizing Full Blueprint...' : 'Generate Full Blueprint'}</span>
                      </button>

                      <button
                        onClick={() => setIsAiChatOpen(true)}
                        className="px-3.5 py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-all"
                      >
                        <Bot className="w-4 h-4 text-sky-400" />
                        <span>Copilot</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Architecture Metrics Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-lg">
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Backend Service</span>
                      <Server className="w-5 h-5 text-sky-400" />
                    </div>
                    <div className="text-xl font-bold text-white">Spring Boot 3.2</div>
                    <div className="text-xs text-emerald-400 mt-1 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Java 17 + Virtual Threads
                    </div>
                  </div>

                  <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-lg">
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Database Engine</span>
                      <Activity className="w-5 h-5 text-indigo-400" />
                    </div>
                    <div className="text-xl font-bold text-white">PostgreSQL 16</div>
                    <div className="text-xs text-emerald-400 mt-1 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Flyway V3 Artifacts Schema
                    </div>
                  </div>

                  <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-lg">
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">AI Microservice</span>
                      <Bot className="w-5 h-5 text-purple-400" />
                    </div>
                    <div className="text-xl font-bold text-white">FastAPI 0.110</div>
                    <div className="text-xs text-emerald-400 mt-1 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> 8 Dual-Mode Generators
                    </div>
                  </div>

                  <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-lg">
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">LLM Model Tier</span>
                      <Shield className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div className="text-xl font-bold text-white">Gemini 1.5 Flash</div>
                    <div className="text-xs text-slate-400 mt-1">
                      Fallback: <span className="text-emerald-400 font-mono">Deterministic Active</span>
                    </div>
                  </div>
                </div>

                {/* Quick Navigation Cards */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-white">Engineering Workspace Modules</h3>
                      <p className="text-slate-400 text-xs mt-0.5">
                        Select any module below to inspect or generate artifacts
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div
                      onClick={() => setActiveTab('architecture')}
                      className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-3 hover:border-sky-500/50 cursor-pointer transition-all shadow-md group"
                    >
                      <div className="flex items-center justify-between">
                        <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-sky-400">
                          <Layers className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
                          Phase 5
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-white group-hover:text-sky-300 transition-colors">
                        System Architecture
                      </h4>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        Interactive Mermaid flowchart diagrams, component topologies, and containerized deployment blueprints.
                      </p>
                      <div className="flex items-center gap-1 text-xs text-sky-400 font-semibold pt-1">
                        <span>View Diagram</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>

                    <div
                      onClick={() => setActiveTab('erd')}
                      className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-3 hover:border-indigo-500/50 cursor-pointer transition-all shadow-md group"
                    >
                      <div className="flex items-center justify-between">
                        <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-indigo-400">
                          <Activity className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
                          Phase 5
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">
                        Database ERD & DDL
                      </h4>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        PostgreSQL 3NF entity-relationship models, foreign keys, UUID primary keys, and copyable Flyway migrations.
                      </p>
                      <div className="flex items-center gap-1 text-xs text-indigo-400 font-semibold pt-1">
                        <span>Inspect Schema</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>

                    <div
                      onClick={() => setActiveTab('sprints')}
                      className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-3 hover:border-amber-500/50 cursor-pointer transition-all shadow-md group"
                    >
                      <div className="flex items-center justify-between">
                        <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-amber-400">
                          <Zap className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
                          Phase 6
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                        Sprint Planner & Kanban
                      </h4>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        3-sprint release schedule with Fibonacci story points, task backlogs, and interactive status progression.
                      </p>
                      <div className="flex items-center gap-1 text-xs text-amber-400 font-semibold pt-1">
                        <span>Open Kanban</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      <CreateProjectModal
        isOpen={isCreateProjectOpen}
        onClose={() => setIsCreateProjectOpen(false)}
        onProjectCreated={() => fetchProjects()}
      />

      <AiChatDrawer
        isOpen={isAiChatOpen}
        onClose={() => setIsAiChatOpen(false)}
        projectId={activeProjectId}
        projectTitle={activeProject?.title || 'Active Project'}
      />
    </div>
  );
};
