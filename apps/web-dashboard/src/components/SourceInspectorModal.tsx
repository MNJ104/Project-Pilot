import React, { useState, useEffect } from 'react';
import { api, SourceDetailDto } from '../services/api';
import { X, ExternalLink, Hash, Code, Globe, Tag, Clock, Layers } from 'lucide-react';

interface SourceInspectorModalProps {
  sourceId: string | null;
  onClose: () => void;
}

export const SourceInspectorModal: React.FC<SourceInspectorModalProps> = ({
  sourceId,
  onClose,
}) => {
  const [sourceDetail, setSourceDetail] = useState<SourceDetailDto | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'content' | 'metadata' | 'raw'>('content');

  useEffect(() => {
    if (sourceId) {
      fetchDetails(sourceId);
    }
  }, [sourceId]);

  const fetchDetails = async (id: string) => {
    setLoading(true);
    try {
      const data = await api.getSourceDetails(id);
      setSourceDetail(data);
    } catch {
      // Error handling
    } finally {
      setLoading(false);
    }
  };

  if (!sourceId) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-3xl max-h-[85vh] shadow-2xl flex flex-col relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {loading || !sourceDetail ? (
          <div className="p-12 flex flex-col items-center justify-center">
            <div className="w-8 h-8 border-3 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-xs text-slate-400 mt-3">Loading captured source metadata...</span>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="pr-8 mb-4">
              <div className="flex items-center space-x-2 text-xs mb-1">
                <span className="bg-sky-950 text-sky-400 px-2 py-0.5 rounded border border-sky-800 font-mono font-semibold">
                  {sourceDetail.sourceType}
                </span>
                {sourceDetail.url && (
                  <a
                    href={sourceDetail.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-slate-400 hover:text-sky-400 flex items-center gap-1 font-mono text-[11px] truncate max-w-md"
                  >
                    <span>{sourceDetail.url}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
              <h2 className="text-xl font-bold text-white tracking-tight">{sourceDetail.title}</h2>
            </div>

            {/* Navigation Tabs */}
            <div className="flex space-x-2 border-b border-slate-800 mb-4 pb-2 text-xs">
              <button
                onClick={() => setActiveTab('content')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                  activeTab === 'content'
                    ? 'bg-sky-600/20 text-sky-300 border border-sky-500/40'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Extracted Text & Content
              </button>
              <button
                onClick={() => setActiveTab('metadata')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                  activeTab === 'metadata'
                    ? 'bg-sky-600/20 text-sky-300 border border-sky-500/40'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                DOM Metadata & Headings
              </button>
              <button
                onClick={() => setActiveTab('raw')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                  activeTab === 'raw'
                    ? 'bg-sky-600/20 text-sky-300 border border-sky-500/40'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Raw Text Stream
              </button>
            </div>

            {/* Main Scrollable Content Box */}
            <div className="flex-1 overflow-y-auto pr-2 space-y-4 text-xs">
              {activeTab === 'content' && (
                <div className="space-y-4">
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-slate-300 leading-relaxed whitespace-pre-wrap">
                    {sourceDetail.normalizedContent || sourceDetail.rawContent}
                  </div>
                </div>
              )}

              {activeTab === 'metadata' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                      <div className="text-slate-400 text-[11px]">SHA-256 Content Hash</div>
                      <div className="text-sky-400 font-mono text-xs truncate mt-0.5">{sourceDetail.contentHash}</div>
                    </div>
                    <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                      <div className="text-slate-400 text-[11px]">Ingestion Timestamp</div>
                      <div className="text-slate-200 font-mono text-xs mt-0.5">{sourceDetail.createdAt}</div>
                    </div>
                  </div>

                  {sourceDetail.metadata && (
                    <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
                      <div className="font-semibold text-white">Extracted Metadata Object</div>
                      <pre className="text-[11px] font-mono text-slate-300 overflow-x-auto p-2 bg-slate-900 rounded-lg">
                        {JSON.stringify(sourceDetail.metadata, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'raw' && (
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-slate-400 text-[11px] leading-relaxed whitespace-pre-wrap">
                  {sourceDetail.rawContent}
                </div>
              )}
            </div>

            {/* Footer Actions */}
            <div className="pt-4 border-t border-slate-800 flex justify-between items-center text-xs">
              <span className="text-slate-500">Source ID: {sourceDetail.id}</span>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-medium transition-colors"
              >
                Close Inspector
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
