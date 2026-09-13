import React from 'react';
import { useApp } from '../context/AppContext';
import { Landmark, Sparkles } from 'lucide-react';

interface GovtSimpleToggleProps {
  mode: 'simple' | 'official';
  onChange: (mode: 'simple' | 'official') => void;
}

export const GovtSimpleToggle: React.FC<GovtSimpleToggleProps> = ({ mode, onChange }) => {
  const { t } = useApp();

  return (
    <div className="inline-flex p-1 rounded-xl bg-slate-100 border border-slate-200 shadow-inner">
      <button
        onClick={() => onChange('simple')}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
          mode === 'simple'
            ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
        }`}
      >
        <Sparkles className={`w-3.5 h-3.5 ${mode === 'simple' ? 'text-amber-300' : 'text-blue-600'}`} />
        <span>{t.explainLikeCitizen}</span>
      </button>

      <button
        onClick={() => onChange('official')}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
          mode === 'official'
            ? 'bg-slate-900 text-white shadow-md shadow-slate-900/20'
            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
        }`}
      >
        <Landmark className={`w-3.5 h-3.5 ${mode === 'official' ? 'text-amber-400' : 'text-slate-500'}`} />
        <span>{t.originalGovtText}</span>
      </button>
    </div>
  );
};
