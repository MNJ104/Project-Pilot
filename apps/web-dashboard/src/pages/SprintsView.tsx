import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { SprintDto, SprintTaskDto } from '../types/ai-types';
import { Sparkles, Kanban, RefreshCw, CheckCircle2, Clock, AlertCircle, ArrowRight, Calendar } from 'lucide-react';

interface SprintsViewProps {
  projectId: string;
}

export const SprintsView: React.FC<SprintsViewProps> = ({ projectId }) => {
  const [sprints, setSprints] = useState<SprintDto[]>([]);
  const [activeSprintIndex, setActiveSprintIndex] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [generating, setGenerating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (projectId) {
      loadSprints();
    }
  }, [projectId]);

  const loadSprints = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getSprints(projectId);
      setSprints(data || []);
    } catch {
      setSprints([]);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    try {
      setGenerating(true);
      setError(null);
      const result = await api.generateSprints(projectId);
      setSprints(result || []);
      setActiveSprintIndex(0);
    } catch (err: any) {
      setError(err?.message || 'Failed to generate sprint plan');
    } finally {
      setGenerating(false);
    }
  };

  const handleCycleStatus = async (task: SprintTaskDto) => {
    if (!task.id) return;
    const statusCycle: Record<string, string> = {
      TODO: 'IN_PROGRESS',
      IN_PROGRESS: 'DONE',
      DONE: 'TODO',
      BLOCKED: 'TODO',
    };
    const nextStatus = statusCycle[task.status] || 'TODO';

    try {
      await api.updateTaskStatus(projectId, task.id, nextStatus);
      // Optimistic state update
      setSprints(prev =>
        prev.map(sprint => ({
          ...sprint,
          tasks: sprint.tasks?.map(t => (t.id === task.id ? { ...t, status: nextStatus } : t)),
        }))
      );
    } catch (err: any) {
      console.error('Failed to update task status:', err);
    }
  };

  const activeSprint = sprints[activeSprintIndex] || sprints[0];
  const totalPoints = sprints.reduce(
    (acc, s) => acc + (s.tasks?.reduce((tAcc, t) => tAcc + (t.storyPoints || 0), 0) || 0),
    0
  );

  const filterByStatus = (status: string) => {
    return activeSprint?.tasks?.filter(t => t.status === status) || [];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12 text-slate-400">
        <RefreshCw className="w-6 h-6 animate-spin text-sky-400 mr-2" />
        <span>Loading sprint plans...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 p-6 rounded-2xl">
        <div>
          <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <Kanban className="w-4 h-4" />
            <span>Phase 6 • Agile Sprint Planning & Kanban</span>
          </div>
          <h2 className="text-xl font-bold text-white">Interactive 3-Sprint Release Roadmap</h2>
          <p className="text-slate-400 text-xs mt-1">
            Fibonacci-estimated story points, task backlogs, and agile milestones.
          </p>
        </div>

        <button
          onClick={handleGenerate}
          disabled={generating}
          className="px-4 py-2.5 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white rounded-xl text-xs font-semibold flex items-center space-x-2 transition-all shadow-lg shadow-amber-600/20 disabled:opacity-50"
        >
          {generating ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Planning Sprints...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>{sprints.length > 0 ? 'Regenerate Sprints' : 'Generate Sprint Plan'}</span>
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="bg-rose-950/40 border border-rose-800/60 text-rose-300 text-xs p-4 rounded-xl">
          {error}
        </div>
      )}

      {sprints.length === 0 ? (
        <div className="bg-slate-900/40 border border-dashed border-slate-800 rounded-2xl p-12 text-center">
          <Kanban className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-slate-300">No Sprint Plan Generated</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Click "Generate Sprint Plan" to have Gemini create a realistic 6-week 3-sprint release schedule with Fibonacci story points.
          </p>
        </div>
      ) : (
        <>
          {/* Sprint Selector Tabs & Goal Banner */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2 overflow-x-auto">
                {sprints.map((s, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveSprintIndex(idx)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                      activeSprintIndex === idx
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    Sprint {s.sprintNumber || idx + 1}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-3 text-xs text-slate-400">
                <span className="bg-slate-950 px-3 py-1 rounded-lg border border-slate-800 font-mono text-amber-300">
                  Total Story Points: {totalPoints}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  6 Weeks Timeline
                </span>
              </div>
            </div>

            {activeSprint && (
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>{activeSprint.name}</span>
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  <span className="font-semibold text-slate-300">Goal:</span> {activeSprint.goal}
                </p>
              </div>
            )}
          </div>

          {/* Kanban Board Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Column 1: TODO */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-300 uppercase tracking-wider">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>To Do</span>
                </div>
                <span className="text-[10px] font-mono bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full">
                  {filterByStatus('TODO').length}
                </span>
              </div>

              <div className="space-y-2.5">
                {filterByStatus('TODO').map((task, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleCycleStatus(task)}
                    className="p-3 bg-slate-950/80 border border-slate-850 rounded-xl space-y-2 hover:border-sky-500/50 cursor-pointer transition-all shadow-sm group"
                    title="Click to advance status"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h5 className="text-xs font-semibold text-white group-hover:text-sky-300 transition-colors">
                        {task.title}
                      </h5>
                      <span className="text-[10px] font-mono font-bold bg-amber-950/80 text-amber-400 px-1.5 py-0.5 rounded border border-amber-800/60 shrink-0">
                        {task.storyPoints} pts
                      </span>
                    </div>
                    {task.description && (
                      <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                        {task.description}
                      </p>
                    )}
                    <div className="flex items-center justify-between pt-1 text-[10px] text-slate-500">
                      <span className="uppercase text-slate-400 font-semibold">{task.priority}</span>
                      <span className="flex items-center gap-0.5 text-sky-400 group-hover:translate-x-0.5 transition-transform">
                        Move <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Column 2: IN PROGRESS */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center gap-2 text-xs font-bold text-sky-400 uppercase tracking-wider">
                  <RefreshCw className="w-3.5 h-3.5 text-sky-400 animate-spin" />
                  <span>In Progress</span>
                </div>
                <span className="text-[10px] font-mono bg-sky-950 text-sky-400 px-2 py-0.5 rounded-full border border-sky-800">
                  {filterByStatus('IN_PROGRESS').length}
                </span>
              </div>

              <div className="space-y-2.5">
                {filterByStatus('IN_PROGRESS').map((task, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleCycleStatus(task)}
                    className="p-3 bg-slate-950/80 border border-sky-900/40 rounded-xl space-y-2 hover:border-emerald-500/50 cursor-pointer transition-all shadow-sm group"
                    title="Click to mark Done"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h5 className="text-xs font-semibold text-white group-hover:text-emerald-300 transition-colors">
                        {task.title}
                      </h5>
                      <span className="text-[10px] font-mono font-bold bg-amber-950/80 text-amber-400 px-1.5 py-0.5 rounded border border-amber-800/60 shrink-0">
                        {task.storyPoints} pts
                      </span>
                    </div>
                    {task.description && (
                      <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                        {task.description}
                      </p>
                    )}
                    <div className="flex items-center justify-between pt-1 text-[10px] text-slate-500">
                      <span className="uppercase text-sky-400 font-semibold">{task.priority}</span>
                      <span className="flex items-center gap-0.5 text-emerald-400 group-hover:translate-x-0.5 transition-transform">
                        Complete <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Column 3: DONE */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Done</span>
                </div>
                <span className="text-[10px] font-mono bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-800">
                  {filterByStatus('DONE').length}
                </span>
              </div>

              <div className="space-y-2.5">
                {filterByStatus('DONE').map((task, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleCycleStatus(task)}
                    className="p-3 bg-slate-950/80 border border-emerald-900/40 rounded-xl space-y-2 hover:border-slate-700 cursor-pointer transition-all shadow-sm group opacity-80"
                    title="Click to reset to To Do"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h5 className="text-xs font-semibold text-slate-300 line-through">
                        {task.title}
                      </h5>
                      <span className="text-[10px] font-mono font-bold bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded shrink-0">
                        {task.storyPoints} pts
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

