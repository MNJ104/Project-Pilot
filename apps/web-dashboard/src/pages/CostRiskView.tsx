import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { CostEstimateDto, RiskItemDto } from '../types/ai-types';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Sparkles, DollarSign, AlertTriangle, RefreshCw, ShieldAlert, TrendingUp, CheckCircle2 } from 'lucide-react';

interface CostRiskViewProps {
  projectId: string;
}

export const CostRiskView: React.FC<CostRiskViewProps> = ({ projectId }) => {
  const [cost, setCost] = useState<CostEstimateDto | null>(null);
  const [risks, setRisks] = useState<RiskItemDto[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [generating, setGenerating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (projectId) {
      loadCostRisk();
    }
  }, [projectId]);

  const loadCostRisk = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getCostRisk(projectId);
      setCost(data.cost_estimate || null);
      setRisks(data.risks || []);
    } catch {
      setCost(null);
      setRisks([]);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    try {
      setGenerating(true);
      setError(null);
      const result = await api.generateCostRisk(projectId);
      setCost(result.cost_estimate || null);
      setRisks(result.risks || []);
    } catch (err: any) {
      setError(err?.message || 'Failed to estimate cost and predict risks');
    } finally {
      setGenerating(false);
    }
  };

  const chartData = cost
    ? [
        { name: 'Compute', cost: Number(cost.computeUsd || 0), fill: '#0284c7' },
        { name: 'Database', cost: Number(cost.databaseUsd || 0), fill: '#6366f1' },
        { name: 'Storage', cost: Number(cost.storageUsd || 0), fill: '#a855f7' },
        { name: 'AI Models', cost: Number(cost.aiInferenceUsd || 0), fill: '#10b981' },
      ]
    : [];

  const getSeverityBadge = (score: number) => {
    if (score >= 50) return 'bg-rose-950/80 text-rose-400 border-rose-800';
    if (score >= 30) return 'bg-amber-950/80 text-amber-400 border-amber-800';
    return 'bg-emerald-950/80 text-emerald-400 border-emerald-800';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12 text-slate-400">
        <RefreshCw className="w-6 h-6 animate-spin text-sky-400 mr-2" />
        <span>Loading cost model & risk analysis...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 p-6 rounded-2xl">
        <div>
          <div className="flex items-center gap-2 text-rose-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <DollarSign className="w-4 h-4" />
            <span>Phase 7 • Cloud FinOps & Risk Matrix</span>
          </div>
          <h2 className="text-xl font-bold text-white">Infrastructure Cost Model & Mitigation</h2>
          <p className="text-slate-400 text-xs mt-1">
            Multi-tier cloud expenses and severity-scored architectural failure modes.
          </p>
        </div>

        <button
          onClick={handleGenerate}
          disabled={generating}
          className="px-4 py-2.5 bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white rounded-xl text-xs font-semibold flex items-center space-x-2 transition-all shadow-lg shadow-rose-600/20 disabled:opacity-50"
        >
          {generating ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Analyzing FinOps & Risks...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>{cost ? 'Recalculate Cost & Risks' : 'Analyze Cost & Risks'}</span>
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="bg-rose-950/40 border border-rose-800/60 text-rose-300 text-xs p-4 rounded-xl">
          {error}
        </div>
      )}

      {!cost && risks.length === 0 ? (
        <div className="bg-slate-900/40 border border-dashed border-slate-800 rounded-2xl p-12 text-center">
          <TrendingUp className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-slate-300">No Cost or Risk Model Generated</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Click "Analyze Cost & Risks" to generate a realistic monthly cloud infrastructure budget breakdown and scored risk matrix with mitigation strategies.
          </p>
        </div>
      ) : (
        <>
          {/* Top Metrics Cards */}
          {cost && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg">
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Total Monthly Cost
                </div>
                <div className="text-2xl font-bold text-white mt-1">
                  ${Number(cost.totalMonthlyUsd || 0).toFixed(2)}
                  <span className="text-xs font-normal text-slate-400"> /mo</span>
                </div>
                <div className="text-xs text-emerald-400 mt-1 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Railway / Render Starter
                </div>
              </div>

              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg">
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Compute (Java + Python)
                </div>
                <div className="text-2xl font-bold text-sky-400 mt-1">
                  ${Number(cost.computeUsd || 0).toFixed(2)}
                </div>
                <div className="text-xs text-slate-400 mt-1">Dual container services</div>
              </div>

              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg">
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  PostgreSQL Managed
                </div>
                <div className="text-2xl font-bold text-indigo-400 mt-1">
                  ${Number(cost.databaseUsd || 0).toFixed(2)}
                </div>
                <div className="text-xs text-slate-400 mt-1">Daily snapshot backups</div>
              </div>

              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg">
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  AI Model Inference
                </div>
                <div className="text-2xl font-bold text-emerald-400 mt-1">
                  ${Number(cost.aiInferenceUsd || 0).toFixed(2)}
                </div>
                <div className="text-xs text-slate-400 mt-1">Google Gemini Flash tokens</div>
              </div>
            </div>
          )}

          {/* Cost Bar Chart & Breakdown Notes */}
          {cost && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
                <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Monthly Expense Breakdown ($ USD)
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                      <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                      <YAxis stroke="#64748b" fontSize={11} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#0f172a',
                          borderColor: '#334155',
                          borderRadius: '0.75rem',
                          fontSize: '12px',
                        }}
                      />
                      <Bar dataKey="cost" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-3">
                <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  FinOps Architectural Notes
                </div>
                <div className="p-4 bg-slate-950 rounded-xl text-xs text-slate-300 leading-relaxed border border-slate-850 whitespace-pre-line">
                  {cost.breakdownNotes}
                </div>
              </div>
            </div>
          )}

          {/* Risk Severity Matrix */}
          {risks.length > 0 && (
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-xl space-y-0">
              <div className="p-4 border-b border-slate-800 bg-slate-950/40 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-wider">
                  <ShieldAlert className="w-4 h-4 text-rose-400" />
                  <span>Identified Architectural Risks ({risks.length})</span>
                </div>
                <span className="text-[11px] text-slate-400">Scored (Probability × Impact)</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 bg-slate-900/50 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Risk Description</th>
                      <th className="py-3 px-4 text-center">Likelihood</th>
                      <th className="py-3 px-4 text-center">Impact</th>
                      <th className="py-3 px-4 text-center">Severity</th>
                      <th className="py-3 px-4">Mitigation Strategy</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-xs">
                    {risks.map((r, idx) => (
                      <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                        <td className="py-3.5 px-4 font-mono text-[10px] uppercase text-slate-400">
                          {r.category}
                        </td>
                        <td className="py-3.5 px-4 font-medium text-slate-200 max-w-xs">
                          {r.description}
                        </td>
                        <td className="py-3.5 px-4 text-center font-mono text-slate-300">
                          {r.probability}/10
                        </td>
                        <td className="py-3.5 px-4 text-center font-mono text-slate-300">
                          {r.impact}/10
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${getSeverityBadge(r.severityScore)}`}>
                            {r.severityScore}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-300 max-w-sm leading-relaxed">
                          {r.mitigationStrategy}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
