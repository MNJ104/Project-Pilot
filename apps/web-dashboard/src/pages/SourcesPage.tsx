import React, { useState, useEffect } from 'react';
import { api, SourceResponseDto } from '../services/api';
import { SourceInspectorModal } from '../components/SourceInspectorModal';
import { ManualSourceModal } from '../components/ManualSourceModal';
import {
  FolderGit2,
  Plus,
  Search,
  Filter,
  ExternalLink,
  Eye,
  Trash2,
  Globe,
  FileText,
  Code2,
  Clock,
  Sparkles,
  Layers
} from 'lucide-react';

interface SourcesPageProps {
  activeProjectId: string;
}

export const SourcesPage: React.FC<SourcesPageProps> = ({ activeProjectId }) => {
  const [sources, setSources] = useState<SourceResponseDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterType, setFilterType] = useState<string>('ALL');

  const [inspectSourceId, setInspectSourceId] = useState<string | null>(null);
  const [isManualModalOpen, setIsManualModalOpen] = useState<boolean>(false);

  useEffect(() => {
    if (activeProjectId) {
      fetchSources(activeProjectId);
    }
  }, [activeProjectId]);

  const fetchSources = async (projectId: string) => {
    setLoading(true);
    try {
      const data = await api.getProjectSources(projectId);
      setSources(data);
    } catch {
      // Error handling
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSource = async (sourceId: string) => {
    if (window.confirm('Are you sure you want to remove this source from your workspace?')) {
      try {
        await api.deleteSource(sourceId);
        setSources(prev => prev.filter(s => s.id !== sourceId));
      } catch {
        alert('Failed to delete source.');
      }
    }
  };

  const filteredSources = sources.filter(s => {
    const matchesFilter = filterType === 'ALL' || s.sourceType === filterType;
    const matchesSearch =
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.url && s.url.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (s.summaryPreview && s.summaryPreview.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div>
          <div className="flex items-center space-x-2 text-sky-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <FolderGit2 className="w-4 h-4" />
            <span>Captured Project Input Engine</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Project Sources & Ingested Content</h2>
          <p className="text-slate-400 text-xs mt-1 max-w-2xl">
            Inspect captured web pages, GitHub repository structures, technical documentation, and manual text prompts associated with this project.
          </p>
        </div>

        <button
          onClick={() => setIsManualModalOpen(true)}
          className="px-4 py-2.5 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-semibold rounded-xl text-xs flex items-center space-x-2 shadow-lg shadow-sky-500/25 shrink-0 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add Manual Source</span>
        </button>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="flex flex-col sm:flex-row justify-between gap-3 bg-slate-900/60 p-3 border border-slate-800 rounded-xl">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search captured sources by title, URL, or content..."
            className="w-full bg-slate-950 border border-slate-800 focus:border-sky-500 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 outline-none"
          />
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="bg-slate-950 border border-slate-800 focus:border-sky-500 rounded-lg px-3 py-1.5 text-xs text-slate-200 outline-none"
          >
            <option value="ALL">All Source Types ({sources.length})</option>
            <option value="WEBSITE">Websites</option>
            <option value="GITHUB">GitHub Repos</option>
            <option value="DOCUMENTATION">Docs</option>
            <option value="FIGMA">Figma Designs</option>
            <option value="BLOG_ARTICLE">Blog Articles</option>
            <option value="MANUAL">Manual Text</option>
          </select>
        </div>
      </div>

      {/* Sources Grid */}
      {loading ? (
        <div className="p-12 text-center bg-slate-900/40 border border-slate-800 rounded-2xl">
          <div className="w-8 h-8 border-3 border-sky-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <span className="text-xs text-slate-400">Loading project input sources...</span>
        </div>
      ) : filteredSources.length === 0 ? (
        <div className="p-12 text-center bg-slate-900/40 border border-slate-800 rounded-2xl space-y-3">
          <FolderGit2 className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-base font-semibold text-white">No Input Sources Found</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            No input sources match your filter. Capture web pages using the Project Pilot Chrome Extension or click "Add Manual Source".
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSources.map((source) => (
            <div
              key={source.id}
              className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 shadow-lg flex flex-col justify-between space-y-4 transition-all"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] font-mono font-semibold bg-sky-950 text-sky-400 px-2 py-0.5 rounded border border-sky-800">
                    {source.sourceType}
                  </span>
                  <span className="text-[10px] text-slate-500 flex items-center gap-1 font-mono">
                    <Clock className="w-3 h-3" />
                    {source.createdAt ? source.createdAt.substring(0, 10) : 'Recent'}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-white line-clamp-1">{source.title}</h3>

                {source.url && (
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] text-slate-400 hover:text-sky-400 font-mono truncate block mt-1 flex items-center gap-1"
                  >
                    <span className="truncate">{source.url}</span>
                    <ExternalLink className="w-3 h-3 shrink-0" />
                  </a>
                )}

                <p className="text-xs text-slate-400 mt-2.5 line-clamp-3 bg-slate-950 p-2.5 rounded-xl border border-slate-800/80 font-mono text-[11px]">
                  {source.summaryPreview || 'Captured text snapshot...'}
                </p>
              </div>

              {/* Card Footer Actions */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <button
                  onClick={() => setInspectSourceId(source.id)}
                  className="text-xs font-semibold text-sky-400 hover:text-sky-300 flex items-center space-x-1 transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Inspect Source</span>
                </button>

                <button
                  onClick={() => handleDeleteSource(source.id)}
                  className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition-colors"
                  title="Remove Source"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      <SourceInspectorModal
        sourceId={inspectSourceId}
        onClose={() => setInspectSourceId(null)}
      />

      <ManualSourceModal
        isOpen={isManualModalOpen}
        projectId={activeProjectId}
        onClose={() => setIsManualModalOpen(false)}
        onSourceAdded={() => fetchSources(activeProjectId)}
      />
    </div>
  );
};
