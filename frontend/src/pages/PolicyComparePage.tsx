import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { Policy } from '../types';
import { 
  Scale, ArrowRight, CheckCircle2, AlertCircle, 
  FileText, Sparkles, Building2, ChevronRight, Layers, ArrowLeft
} from 'lucide-react';

export const PolicyComparePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const policyId = id ? Number(id) : 1;

  const [policies, setPolicies] = useState<Policy[]>([]);
  const [currentPolicyId, setCurrentPolicyId] = useState<number>(policyId);
  const [diffData, setDiffData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [polList, diff] = await Promise.all([
          api.getPolicies(),
          api.comparePolicy(currentPolicyId)
        ]);
        setPolicies(polList.policies || []);
        setDiffData(diff);
      } catch (err) {
        console.error("Failed to load compare diffs", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [currentPolicyId]);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Breadcrumb & Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Link
          to={`/policies/${currentPolicyId}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Policy View</span>
        </Link>

        {/* Policy Selector */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Select Policy to Compare:
          </label>
          <select
            value={currentPolicyId}
            onChange={(e) => setCurrentPolicyId(Number(e.target.value))}
            className="px-3 py-1.5 rounded-xl bg-white border border-slate-300 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
          >
            {policies.map((p) => (
              <option key={p.id} value={p.id}>
                {p.code}: {p.title.substring(0, 35)}...
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-200 text-xs font-semibold border border-blue-400/30">
          <Scale className="w-3.5 h-3.5 text-amber-400" />
          <span>Statutory Diff & Numerical Delta Tracker</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Old vs New Policy Comparison
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-3xl">
          Visualizing explicit statutory differences between previous regulations and newly amended gazettes. Zero silent changes.
        </p>

        {diffData && (
          <div className="grid grid-cols-3 gap-3 pt-2 max-w-lg">
            <div className="p-3 rounded-xl bg-amber-500/20 border border-amber-400/30 text-center">
              <div className="text-xl font-black text-amber-300">{diffData.total_modifications}</div>
              <div className="text-[11px] text-slate-300">Modified Clauses</div>
            </div>
            <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-400/30 text-center">
              <div className="text-xl font-black text-emerald-300">{diffData.total_additions}</div>
              <div className="text-[11px] text-slate-300">Added Clauses</div>
            </div>
            <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-400/30 text-center">
              <div className="text-xl font-black text-rose-300">{diffData.total_removals}</div>
              <div className="text-[11px] text-slate-300">Removed Clauses</div>
            </div>
          </div>
        )}
      </div>

      {loading ? (
        <div className="p-16 text-center text-xs text-slate-500">
          <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          Comparing legal versions and calculating numerical deltas...
        </div>
      ) : !diffData ? (
        <div className="p-8 bg-white rounded-2xl border text-center text-xs text-slate-500">
          No comparison data available for this policy.
        </div>
      ) : (
        <div className="space-y-8">
          
          {/* Numerical Changes Card */}
          {diffData.numerical_changes && diffData.numerical_changes.length > 0 && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-blue-50 text-blue-700">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    Key Numerical Limits & Threshold Revisions
                  </h2>
                  <p className="text-xs text-slate-500">
                    Direct parameter changes from previous municipal limits
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {diffData.numerical_changes.map((item: any, idx: number) => (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3"
                  >
                    <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                      <span>{item.parameter}</span>
                      <span className="text-[10px] text-slate-500 font-medium">{item.citation}</span>
                    </div>

                    <div className="flex items-center justify-between gap-3 p-3 bg-white rounded-xl border border-slate-200">
                      <div className="text-center flex-1">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Before</span>
                        <strong className="text-xs text-rose-600 font-bold line-through">{item.before}</strong>
                      </div>
                      <ArrowRight className="w-4 h-4 text-blue-600 shrink-0" />
                      <div className="text-center flex-1">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">After</span>
                        <strong className="text-xs text-emerald-600 font-bold">{item.after}</strong>
                      </div>
                    </div>

                    <div className="text-xs text-slate-600 leading-relaxed bg-slate-100/70 p-3 rounded-lg">
                      <strong>Practical Impact:</strong> {item.practical_implication}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Detailed Clause Diff List */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <h2 className="text-base font-bold text-slate-900">
              Clause-by-Clause Statutory Diff Breakdown
            </h2>

            <div className="space-y-4">
              {diffData.modified_clauses?.map((c: any, idx: number) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-slate-50 border border-amber-200 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-amber-100 text-amber-900">
                      MODIFIED: Section {c.section} — {c.title}
                    </span>
                    <span className="text-[11px] text-slate-500 font-medium">{c.citation}</span>
                  </div>

                  <div className="p-3.5 bg-white rounded-xl border border-slate-200 text-xs text-slate-800 leading-relaxed">
                    <span className="font-bold text-slate-900 block mb-1">Amended Legal Text:</span>
                    "{c.official_text}"
                  </div>

                  <div className="p-3 bg-blue-50/80 rounded-xl border border-blue-200 text-xs text-blue-900 leading-relaxed">
                    <span className="font-bold text-blue-950 block mb-0.5">Plain Citizen Explanation:</span>
                    {c.simple_text}
                  </div>
                </div>
              ))}

              {diffData.added_clauses?.map((c: any, idx: number) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-emerald-50/40 border border-emerald-200 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-emerald-100 text-emerald-900">
                      NEWLY ADDED: Section {c.section} — {c.title}
                    </span>
                    <span className="text-[11px] text-slate-500 font-medium">{c.citation}</span>
                  </div>

                  <div className="p-3.5 bg-white rounded-xl border border-emerald-200 text-xs text-slate-800 leading-relaxed">
                    "{c.official_text}"
                  </div>

                  <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900 leading-relaxed">
                    <span className="font-bold text-emerald-950 block mb-0.5">What this means for you:</span>
                    {c.simple_text}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}
    </div>
  );
};
