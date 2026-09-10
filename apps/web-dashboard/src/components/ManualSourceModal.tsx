import React, { useState } from 'react';
import { api } from '../services/api';
import { Sparkles, X, Plus, FileText, Globe } from 'lucide-react';

interface ManualSourceModalProps {
  isOpen: boolean;
  projectId: string;
  onClose: () => void;
  onSourceAdded: () => void;
}

export const ManualSourceModal: React.FC<ManualSourceModalProps> = ({
  isOpen,
  projectId,
  onClose,
  onSourceAdded,
}) => {
  const [sourceType, setSourceType] = useState<string>('MANUAL');
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [rawContent, setRawContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await api.ingestSource({
        projectId,
        sourceType,
        title,
        url: url.trim() || undefined,
        rawContent,
        normalizedContent: rawContent,
        metadata: { manualIngestion: true }
      });
      setTitle('');
      setUrl('');
      setRawContent('');
      onSourceAdded();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to ingest manual source.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-lg shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-2 text-sky-400 text-xs font-semibold uppercase tracking-wider mb-2">
          <Sparkles className="w-4 h-4" />
          <span>Manual Input Ingestion</span>
        </div>

        <h2 className="text-xl font-bold text-white mb-1">Add Input Source</h2>
        <p className="text-slate-400 text-xs mb-6">
          Paste project ideas, requirements text, technical documentation, or repository references directly into your workspace.
        </p>

        {error && (
          <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Source Type
              </label>
              <select
                value={sourceType}
                onChange={(e) => setSourceType(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-sky-500 rounded-xl px-3 py-2.5 text-xs text-white outline-none"
              >
                <option value="MANUAL">Manual Idea / Prompt</option>
                <option value="WEBSITE">Website Article</option>
                <option value="GITHUB">GitHub Repository</option>
                <option value="DOCUMENTATION">Technical Documentation</option>
                <option value="FIGMA">Figma Design</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Source Title
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Payment Gateway Requirements"
                className="w-full bg-slate-950 border border-slate-800 focus:border-sky-500 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Source URL (Optional)
            </label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://github.com/owner/repo or https://docs.example.com"
              className="w-full bg-slate-950 border border-slate-800 focus:border-sky-500 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Raw Source Text Content / Prompt
            </label>
            <textarea
              required
              rows={5}
              value={rawContent}
              onChange={(e) => setRawContent(e.target.value)}
              placeholder="Paste raw text, requirements list, system description, or software ideas here..."
              className="w-full bg-slate-950 border border-slate-800 focus:border-sky-500 rounded-xl px-4 py-2.5 text-xs text-white font-mono placeholder-slate-500 outline-none resize-none"
            />
          </div>

          <div className="pt-2 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white rounded-xl text-xs font-semibold flex items-center space-x-1.5 shadow-lg shadow-sky-500/25 transition-all disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
              <span>{isSubmitting ? 'Ingesting...' : 'Ingest Source'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
