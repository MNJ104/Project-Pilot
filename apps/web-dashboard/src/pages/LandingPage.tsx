import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  Network,
  Database,
  Code2,
  Kanban,
  DollarSign,
  Shield,
  Bot,
  Layers,
  ChevronRight,
  CheckCircle2,
  Terminal,
  Cpu,
  Github,
  Play
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Network,
      title: 'Interactive System Architecture',
      description: 'Generate production-grade component topologies, communication protocol specs, and Mermaid.js flowcharts automatically.',
      badge: 'Phase 5',
    },
    {
      icon: Database,
      title: 'PostgreSQL 3NF Schemas & ERD',
      description: 'Synthesize normalized relational schemas with UUID primary keys, foreign key constraints, indexes, and Mermaid ER diagrams.',
      badge: 'Phase 5',
    },
    {
      icon: Code2,
      title: 'OpenAPI 3.0 REST Contracts',
      description: 'Full REST endpoint specifications with HTTP verbs, JSON request/response schemas, and JWT authorization rules.',
      badge: 'Phase 5',
    },
    {
      icon: Kanban,
      title: 'Agile Release Roadmaps & Sprints',
      description: 'Break high-level goals into 3 actionable 2-week sprints with Fibonacci-estimated story points and interactive Kanban tracking.',
      badge: 'Phase 6',
    },
    {
      icon: DollarSign,
      title: 'Cloud FinOps & Infrastructure Cost',
      description: 'Precise multi-tier cloud expense projections for compute, managed DB, storage, and AI inference with optimization recommendations.',
      badge: 'Phase 7',
    },
    {
      icon: Shield,
      title: 'Severity-Scored Risk Mitigation',
      description: 'Identify critical architectural vulnerabilities, calculate likelihood × impact severity scores, and receive concrete engineering mitigations.',
      badge: 'Phase 7',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-sky-500 selection:text-white">
      {/* Top Navigation */}
      <header className="border-b border-slate-850/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-sky-500/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-extrabold text-lg text-white tracking-tight">ProjectPilot</span>
              <span className="text-xs font-mono text-sky-400 font-bold ml-1.5 px-1.5 py-0.5 rounded bg-sky-950/80 border border-sky-800">
                AI 2.0
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate('/login')}
              className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate('/register')}
              className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-all shadow-md shadow-sky-600/20"
            >
              <span>Get Started</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-24 overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-sky-500/15 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/3 left-1/3 w-[400px] h-[300px] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-5xl mx-auto px-6 text-center relative z-10 space-y-6">
          <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-sky-400 text-xs font-medium">
            <Sparkles className="w-3.5 h-3.5 text-sky-400" />
            <span>Autonomous Software Planning & Architecture Engine</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-[1.15]">
            Transform Ideas & Repos into{' '}
            <span className="bg-gradient-to-r from-sky-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Production Architecture
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            ProjectPilot AI converts plain-text requirements and GitHub repositories into complete system diagrams, PostgreSQL schemas, OpenAPI specs, sprint backlogs, and IEEE 830 documentation in seconds.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <button
              onClick={() => navigate('/register')}
              className="w-full sm:w-auto px-6 py-3.5 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white rounded-xl text-sm font-bold flex items-center justify-center space-x-2 transition-all shadow-xl shadow-sky-500/25 cursor-pointer"
            >
              <span>Launch Workspace Free</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigate('/login')}
              className="w-full sm:w-auto px-6 py-3.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white rounded-xl text-sm font-semibold transition-all cursor-pointer"
            >
              Explore Existing Projects
            </button>
          </div>

          <div className="pt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400 font-mono">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Spring Boot 3.2 Backend
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> FastAPI AI Microservice
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Google Gemini 1.5 Flash
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> PostgreSQL 16 + Flyway
            </span>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-20 border-t border-slate-900 bg-slate-950/60">
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Enterprise Engineering Blueprints on Demand
            </h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              Every phase of software planning synthesized with precision. Zero generic mockups, only valid code and diagrams.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div
                  key={idx}
                  className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 space-y-4 hover:border-slate-700 transition-all shadow-lg"
                >
                  <div className="flex items-center justify-between">
                    <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                      <Icon className="w-5 h-5 text-sky-400" />
                    </div>
                    <span className="text-[10px] font-mono font-bold bg-slate-950 text-indigo-300 px-2.5 py-1 rounded-md border border-slate-800">
                      {feat.badge}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white tracking-tight">{feat.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{feat.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Technology Architecture Section */}
      <section className="py-20 border-t border-slate-900 bg-slate-900/30">
        <div className="max-w-5xl mx-auto px-6 space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs font-mono uppercase text-sky-400 font-semibold tracking-wider">
              Architecture Overview
            </span>
            <h2 className="text-2xl font-bold text-white">Modular Monorepo & Multi-Tier Runtime</h2>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 font-mono text-xs text-slate-300 space-y-4 shadow-2xl">
            <div className="text-slate-400 text-[11px] pb-2 border-b border-slate-850">
              System Topology Diagram:
            </div>
            <pre className="text-sky-300 leading-relaxed overflow-x-auto">
{`┌────────────────────────────────────────────────────────┐
│               React 18 + Vite Web Client               │
│          TypeScript • Tailwind CSS • Mermaid.js        │
└───────────────────────────┬────────────────────────────┘
                            │ HTTPS / JWT
┌───────────────────────────▼────────────────────────────┐
│         Spring Boot 3.2 Enterprise Core Backend        │
│       Spring Security 6 • Flyway • Spring Data JPA     │
└───────────────┬────────────────────────────┬───────────┘
                │ JDBC                       │ HTTP/REST
┌───────────────▼───────────┐    ┌───────────▼───────────┐
│       PostgreSQL 16       │    │ FastAPI AI Microservice│
│    Relational Artifacts   │    │  Python 3.13 Pydantic  │
└───────────────────────────┘    └───────────┬───────────┘
                                             │ HTTPS
                                 ┌───────────▼───────────┐
                                 │ Google Gemini 1.5 LLM │
                                 └───────────────────────┘`}
            </pre>
          </div>
        </div>
      </section>

      {/* Call to action */}
      <section className="py-20 border-t border-slate-900 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-6 relative z-10">
          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            Ready to Plan Your Next Software Architecture?
          </h2>
          <p className="text-sm text-slate-400 max-w-lg mx-auto">
            Join thousands of developers turning project requirements into complete blueprints with ProjectPilot AI.
          </p>
          <button
            onClick={() => navigate('/register')}
            className="px-6 py-3.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-sm font-bold inline-flex items-center space-x-2 transition-all shadow-xl shadow-sky-600/30"
          >
            <span>Create Your First Project</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-900 py-8 bg-slate-950 mt-auto">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © 2026 ProjectPilot AI. Built for Software Engineering Excellence.
          </div>
          <div className="flex items-center space-x-4">
            <span>Spring Boot 3.2</span>
            <span>•</span>
            <span>FastAPI Python</span>
            <span>•</span>
            <span>React 18</span>
            <span>•</span>
            <span>PostgreSQL 16</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
