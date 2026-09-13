import React, { useState } from 'react';
import { Citation } from '../types';
import { ShieldCheck, FileText, ChevronRight, X, ExternalLink } from 'lucide-react';

interface CitationPillProps {
  citation: Citation;
}

export const CitationPill: React.FC<CitationPillProps> = ({ citation }) => {
  const [modalOpen, setModalOpen] = useState(false);

  const getConfidenceBadge = (conf: number) => {
    if (conf >= 60) return { bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', text: 'High Grounding' };
    if (conf >= 30) return { bg: 'bg-blue-50 text-blue-700 border-blue-200', text: 'Moderate Grounding' };
    return { bg: 'bg-amber-50 text-amber-700 border-amber-200', text: 'Related Reference' };
  };

  const badge = getConfidenceBadge(citation.confidence);

  return (
    <>
      <button
        onClick={() => setModalOpen(true)}
        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300/80 transition-all text-left group"
        title="View source document evidence chunk"
      >
        <FileText className="w-3 h-3 text-blue-600 shrink-0" />
        <span className="truncate max-w-[200px] font-semibold text-slate-800">
          Page {citation.page}: {citation.section}
        </span>
        <span className={`text-[10px] px-1.5 py-0.2 rounded border font-bold ${badge.bg}`}>
          {citation.confidence}%
        </span>
        <ChevronRight className="w-3 h-3 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
      </button>

      {/* Citation Detail Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex justify-between items-start border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-blue-50 text-blue-700">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Official Grounding Evidence
                  </h3>
                  <p className="text-xs text-slate-500">
                    Verified source excerpt extracted from municipal gazette
                  </p>
                </div>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Document Metadata Details */}
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/80 space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Document:</span>
                <span className="text-slate-900 font-semibold">{citation.source}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Department:</span>
                <span className="text-slate-800">{citation.department}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Page & Section:</span>
                <span className="text-blue-700 font-semibold">Page {citation.page} ({citation.section})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Grounding Confidence:</span>
                <span className={`px-2 py-0.5 rounded font-bold border text-[11px] ${badge.bg}`}>
                  {citation.confidence}% — {badge.text}
                </span>
              </div>
            </div>

            {/* Chunk Snippet */}
            <div className="space-y-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Official Document Excerpt
              </span>
              <div className="p-3.5 rounded-xl bg-slate-900 text-slate-100 text-xs font-mono leading-relaxed border border-slate-800 overflow-y-auto max-h-48">
                "{citation.snippet}"
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors"
              >
                Close Grounding Drawer
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
