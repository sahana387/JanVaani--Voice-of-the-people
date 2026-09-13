import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { Policy } from '../types';
import { GovtSimpleToggle } from '../components/GovtSimpleToggle';
import { CitationPill } from '../components/CitationPill';
import { 
  Building2, Calendar, FileText, Scale, MessageSquare, 
  BarChart3, CheckCircle2, AlertTriangle, HelpCircle, 
  Download, ArrowLeft, Clock, MapPin, Sparkles, Share2, Printer
} from 'lucide-react';

export const PolicyDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { language, t } = useApp();
  const [policy, setPolicy] = useState<Policy | null>(null);
  const [viewMode, setViewMode] = useState<'simple' | 'official'>('simple');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const data = await api.getPolicyDetail(Number(id), language);
        setPolicy(data);
      } catch (err) {
        console.error("Failed to load policy details", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id, language]);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-xs text-slate-500 font-semibold">Retrieving official gazette and AI grounding evidence...</p>
      </div>
    );
  }

  if (!policy) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-900">Policy not found</h2>
        <Link to="/policies" className="text-xs font-bold text-blue-600 hover:underline">
          Return to Policy Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center justify-between">
        <Link
          to="/policies"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Policies</span>
        </Link>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <Link
            to={`/report/${policy.id}`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors border border-slate-300/80"
          >
            <Printer className="w-3.5 h-3.5 text-slate-600" />
            <span>Printable Report</span>
          </Link>
          <Link
            to={`/compare/${policy.id}`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold transition-colors border border-blue-200"
          >
            <Scale className="w-3.5 h-3.5 text-blue-600" />
            <span>Compare Diffs</span>
          </Link>
          <Link
            to={`/chat?policy_id=${policy.id}`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors shadow-sm"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Ask JanVaani</span>
          </Link>
        </div>
      </div>

      {/* Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-md text-xs font-bold bg-blue-50 text-blue-800 border border-blue-200">
              {policy.code}
            </span>
            <span className="px-3 py-1 rounded-md text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
              {policy.category}
            </span>
            <span className="px-3 py-1 rounded-md text-xs font-bold bg-amber-50 text-amber-800 border border-amber-300 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {policy.status}
            </span>
          </div>

          {/* Toggle Mode */}
          <GovtSimpleToggle mode={viewMode} onChange={setViewMode} />
        </div>

        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
            {policy.title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-2">
            Published by: <strong className="text-slate-800 font-semibold">{policy.department}</strong> • Jurisdiction: {policy.jurisdiction || 'BBMP'}
          </p>
        </div>

        {/* Translation Disclaimer if active */}
        {policy.translation_disclaimer && (
          <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-200 text-xs text-amber-800 flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>{policy.translation_disclaimer}</span>
          </div>
        )}

        {/* Executive Summary */}
        <div className={`p-5 rounded-2xl border transition-all ${
          viewMode === 'simple'
            ? 'bg-blue-50/50 border-blue-200 text-slate-800'
            : 'bg-slate-900 text-slate-100 border-slate-800 font-mono text-xs'
        }`}>
          <div className="text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5">
            {viewMode === 'simple' ? (
              <>
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span className="text-blue-900 font-bold">{t.simpleExplanation}</span>
              </>
            ) : (
              <>
                <FileText className="w-4 h-4 text-amber-400" />
                <span className="text-amber-400 font-bold">{t.originalGovtText}</span>
              </>
            )}
          </div>
          <p className="leading-relaxed">
            {viewMode === 'simple' ? policy.summary_simple : policy.summary_official}
          </p>
        </div>

        {/* Key Metrics Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
            <span className="text-slate-500 block">Effective Date</span>
            <strong className="text-slate-900 font-bold">{policy.effective_date}</strong>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
            <span className="text-slate-500 block">Consultation Deadline</span>
            <strong className="text-amber-700 font-bold">{policy.consultation_deadline || 'N/A'}</strong>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
            <span className="text-slate-500 block">Applicable Scope</span>
            <strong className="text-slate-900 font-bold truncate block">{policy.where_applies}</strong>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
            <span className="text-slate-500 block">Grounded Clauses</span>
            <strong className="text-emerald-700 font-bold">{policy.clauses?.length || 3} Indexed Sections</strong>
          </div>
        </div>
      </div>

      {/* Core Question Breakdowns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* What Changed */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
            <Scale className="w-4 h-4 text-blue-600" />
            <h3>{t.whatChanged}</h3>
          </div>
          <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
            {policy.what_changed}
          </p>
        </div>

        {/* Who is Affected */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
            <Building2 className="w-4 h-4 text-indigo-600" />
            <h3>{t.whoIsAffected}</h3>
          </div>
          <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
            {policy.who_affected}
          </p>
        </div>

        {/* Positive Impacts */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-sm font-bold text-emerald-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <h3>{t.positiveImpacts}</h3>
          </div>
          <p className="text-xs text-slate-700 leading-relaxed bg-emerald-50/50 p-4 rounded-xl border border-emerald-100">
            {policy.positive_impacts}
          </p>
        </div>

        {/* Potential Concerns */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-sm font-bold text-amber-800">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <h3>{t.negativeImpacts}</h3>
          </div>
          <p className="text-xs text-slate-700 leading-relaxed bg-amber-50/50 p-4 rounded-xl border border-amber-100">
            {policy.negative_impacts}
          </p>
        </div>

      </div>

      {/* Glossary of Key Terms */}
      {policy.definitions && Object.keys(policy.definitions).length > 0 && (
        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
            <HelpCircle className="w-5 h-5" />
            <h2>{t.glossary}</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            {Object.entries(policy.definitions).map(([term, def]) => (
              <div key={term} className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1">
                <h4 className="text-xs font-bold text-amber-300">{term}</h4>
                <p className="text-xs text-slate-300 leading-relaxed">{def}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Grounded Policy Clauses */}
      {policy.clauses && policy.clauses.length > 0 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Grounded Section Clauses & Legal Source Diffs
            </h2>
            <p className="text-xs text-slate-500">
              Each clause below maps directly to official gazette page numbers and statutory references.
            </p>
          </div>

          <div className="space-y-4">
            {policy.clauses.map((clause) => (
              <div
                key={clause.id}
                className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-blue-100 text-blue-900">
                      Section {clause.section_number}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900">
                      {clause.title}
                    </h3>
                  </div>

                  {clause.clause_type && (
                    <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase ${
                      clause.clause_type === 'modified' ? 'bg-amber-100 text-amber-900 border border-amber-300' :
                      clause.clause_type === 'added' ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' :
                      'bg-slate-200 text-slate-800'
                    }`}>
                      {clause.clause_type} Clause
                    </span>
                  )}
                </div>

                {/* Text View based on viewMode */}
                <div className="p-3.5 rounded-xl bg-white border border-slate-200 text-xs leading-relaxed text-slate-800">
                  {viewMode === 'simple' ? clause.simple_text : clause.official_text}
                </div>

                {/* Practical Impact & Numerical Change */}
                {clause.practical_impact && (
                  <div className="text-xs text-slate-600 bg-slate-100/70 p-3 rounded-lg flex items-start gap-2">
                    <strong className="text-slate-900 font-semibold shrink-0">Citizen Impact:</strong>
                    <span>{clause.practical_impact}</span>
                  </div>
                )}

                {/* Source Citation Pill */}
                <div className="pt-1 flex items-center justify-between text-xs">
                  <CitationPill
                    citation={{
                      source: policy.title,
                      department: policy.department,
                      page: clause.page_number,
                      section: `Section ${clause.section_number} - ${clause.title}`,
                      citation: clause.source_citation || `Section ${clause.section_number}, Page ${clause.page_number}`,
                      confidence: 85.0,
                      snippet: clause.official_text
                    }}
                  />
                  <span className="text-[11px] text-slate-400">
                    Official Gazette Record
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bottom Civic Action Bar */}
      <div className="bg-gradient-to-r from-slate-900 to-blue-950 text-white rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="space-y-1">
          <h3 className="text-lg font-bold">Have an opinion on this policy?</h3>
          <p className="text-xs text-slate-300">
            Submit your feedback, vote in quadratic civic polls, or generate a formal municipal objection draft.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <Link
            to={`/citizen-response?policy_id=${policy.id}`}
            className="px-4 py-2.5 rounded-xl bg-india-saffron hover:bg-orange-600 text-white text-xs font-bold transition-colors shadow-md"
          >
            Draft Civic Response
          </Link>
          <Link
            to={`/sentiment/${policy.id}`}
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors border border-white/20"
          >
            Vote Sentiment
          </Link>
        </div>
      </div>

    </div>
  );
};
