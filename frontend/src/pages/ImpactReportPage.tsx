import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { CitizenImpactReport } from '../types';
import { 
  FileText, Printer, Download, ArrowLeft, ShieldCheck, 
  Landmark, Calendar, CheckCircle2, AlertTriangle, Sparkles
} from 'lucide-react';

export const ImpactReportPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const policyId = id ? Number(id) : 1;

  const { language } = useApp();
  const [report, setReport] = useState<CitizenImpactReport | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      setLoading(true);
      try {
        const data = await api.getPolicyReport(policyId, language);
        setReport(data);
      } catch (err) {
        console.error("Failed to load impact report", err);
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [policyId, language]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center text-xs text-slate-500 space-y-3">
        <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p>Generating structured Citizen Impact Report...</p>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center text-xs text-slate-500">
        Report not found.
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Bar with Print Controls */}
      <div className="no-print flex items-center justify-between">
        <Link
          to={`/policies/${policyId}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Policy Details</span>
        </Link>

        <div className="flex items-center gap-3">
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-md"
          >
            <Printer className="w-4 h-4" />
            <span>Print / Save as PDF</span>
          </button>
        </div>
      </div>

      {/* Printable Report Document Card */}
      <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-sm space-y-8 print:border-none print:shadow-none print:p-0">
        
        {/* Official Header */}
        <div className="border-b-2 border-slate-900 pb-6 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-india-navy flex items-center justify-center text-white font-black text-sm">
                JV
              </div>
              <span className="text-xs font-bold uppercase tracking-widest text-slate-500">
                JANVAANI • CITIZEN POLICY IMPACT ASSESSMENT
              </span>
            </div>
            <span className="text-xs font-mono font-bold text-slate-900">
              REF: {report.policy_code}
            </span>
          </div>

          <h1 className="text-2xl font-black text-slate-900 tracking-tight pt-2">
            {report.report_title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 pt-1 font-medium">
            <span>Department: <strong>{report.department}</strong></span>
            <span>•</span>
            <span>Effective Date: <strong>{report.effective_date}</strong></span>
            <span>•</span>
            <span>Status: <strong className="text-blue-700">{report.status}</strong></span>
          </div>
        </div>

        {/* Legal Disclaimer Box */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <strong className="text-slate-900 block font-bold">Authoritative Grounding Notice:</strong>
            <span>{report.authoritative_source_note} All summaries are derived strictly from retrieved gazette sections.</span>
          </div>
        </div>

        {/* Report Sections Stream */}
        <div className="space-y-6">
          {report.sections.map((sec) => (
            <div key={sec.section_id} className="space-y-2 border-b border-slate-100 pb-5 last:border-b-0">
              <h2 className="text-sm font-bold text-slate-900">
                {sec.title}
              </h2>
              <p className="text-xs text-slate-700 leading-relaxed bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                {sec.content}
              </p>
              <div className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                <FileText className="w-3 h-3 text-blue-600" />
                <span>Source Grounding: {sec.citation}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Definitions Glossary if present */}
        {report.definitions && Object.keys(report.definitions).length > 0 && (
          <div className="p-5 rounded-2xl bg-slate-900 text-slate-100 space-y-3">
            <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              Glossary of Key Technical Terms
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {Object.entries(report.definitions).map(([term, def]) => (
                <div key={term} className="p-3 rounded-lg bg-white/5 border border-white/10 space-y-1">
                  <strong className="text-amber-300 font-bold block">{term}</strong>
                  <span className="text-slate-300">{def}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Report Sign-off */}
        <div className="pt-6 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-400">
          <span>Generated by JanVaani AI Civic Platform</span>
          <span>Date: {report.generated_at}</span>
        </div>

      </div>
    </div>
  );
};
