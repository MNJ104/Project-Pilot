import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
import { SourcesPage } from './SourcesPage';
import { CreateProjectModal } from '../components/CreateProjectModal';
import { useAuth } from '../context/AuthContext';
import { api, ProjectDto } from '../services/api';
import { Sparkles, CheckCircle2, Shield, Activity, Layers, Server, Terminal, FolderGit2, Plus } from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'sources'>('overview');
  const [projects, setProjects] = useState<ProjectDto[]>([]);
  const [activeProjectId, setActiveProjectId] = useState<string>('');
  const [isCreateProjectOpen, setIsCreateProjectOpen] = useState<boolean>(false);

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
      // Fallback
    }
  };

  const activeProject = projects.find(p => p.id === activeProjectId) || projects[0];

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <Navbar />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          activeTab={activeTab}
          onTabChange={(tab) => setActiveTab(tab)}
          projects={projects}
          activeProjectId={activeProjectId}
          onProjectChange={(id) => setActiveProjectId(id)}
          onOpenCreateProject={() => setIsCreateProjectOpen(true)}
        />

        <main className="flex-1 p-8 overflow-y-auto bg-slate-950">
          <div className="max-w-6xl mx-auto space-y-8">
            {activeTab === 'sources' ? (
              <SourcesPage activeProjectId={activeProjectId} />
            ) : (
              /* Overview Tab */
              <div className="space-y-8">
                {/* Header Banner */}
                <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-sky-950/40 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none"></div>

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
                        {activeProject?.description || 'Phase 3 Multi-Project & Sources Ingestion Engine is active.'}
                      </p>
                    </div>

                    <div className="flex items-center space-x-3 bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 shrink-0">
                      <div className="w-3 h-3 rounded-full bg-emerald-400 animate-ping"></div>
                      <div>
                        <div className="text-xs font-medium text-slate-400">Workspace Status</div>
                        <div className="text-xs font-bold text-emerald-400">Phase 3 Operational</div>
                      </div>
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
                      <CheckCircle2 className="w-3.5 h-3.5" /> `/api/v1/sources` & `/projects`
                    </div>
                  </div>

                  <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-lg">
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Database Engine</span>
                      <Activity className="w-5 h-5 text-indigo-400" />
                    </div>
                    <div className="text-xl font-bold text-white">PostgreSQL 16</div>
                    <div className="text-xs text-emerald-400 mt-1 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Flyway V2 Sources Schema
                    </div>
                  </div>

                  <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-lg">
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Extension Bridge</span>
                      <FolderGit2 className="w-5 h-5 text-purple-400" />
                    </div>
                    <div className="text-xl font-bold text-white">Manifest V3</div>
                    <div className="text-xs text-emerald-400 mt-1 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Direct Ingestion Active
                    </div>
                  </div>

                  <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-lg">
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Auth & Workspace</span>
                      <Shield className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div className="text-xl font-bold text-white">Stateless JWT</div>
                    <div className="text-xs text-slate-400 mt-1 truncate">
                      User ID: <span className="font-mono text-slate-300">{user?.id?.substring(0, 8)}...</span>
                    </div>
                  </div>
                </div>

                {/* Quick Action Navigation Grid */}
                <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-white">Project Workspaces & Input Engine</h3>
                      <p className="text-slate-400 text-xs mt-0.5">Manage software planning projects and captured sources</p>
                    </div>

                    <button
                      onClick={() => setActiveTab('sources')}
                      className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-all shadow-md shadow-sky-600/20"
                    >
                      <FolderGit2 className="w-4 h-4" />
                      <span>View Captured Sources</span>
                    </button>
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
    </div>
  );
};
