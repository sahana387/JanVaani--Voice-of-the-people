import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { Policy } from '../types';
import { 
  FileText, Send, Copy, Check, Sparkles, 
  ShieldCheck, AlertCircle, Printer, ArrowLeft
} from 'lucide-react';

export const CitizenResponsePage: React.FC = () => {
  const { sessionToken, selectedWardName } = useApp();
  const [searchParams] = useSearchParams();
  const initialPolicyId = searchParams.get('policy_id') ? Number(searchParams.get('policy_id')) : 1;

  const [policies, setPolicies] = useState<Policy[]>([]);
  const [selectedPolicyId, setSelectedPolicyId] = useState<number>(initialPolicyId);
  const [responseType, setResponseType] = useState<string>('objection');
  const [citizenPosition, setCitizenPosition] = useState<string>('Objection regarding residential density & water supply');
  const [concerns, setConcerns] = useState<string>(
    'Our 12-meter neighborhood road in Indiranagar already faces severe water pressure drop and lack of roadside parking. Permitting 24-meter multi-story complexes without upgrading underground sewage and water lines will create extreme crisis for existing residents.'
  );
  const [specificPoints, setSpecificPoints] = useState<string>(
    'Conduct a mandatory hydrogeological survey and mandate 100% on-site sewage treatment plants (STP) for all buildings above 15 meters.'
  );
  const [userWard, setUserWard] = useState<string>(searchParams.get('ward') || selectedWardName || 'Indiranagar, Bengaluru');
  const [generatedDraft, setGeneratedDraft] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const loadPolicies = async () => {
      try {
        const res = await api.getPolicies();
        setPolicies(res.policies || []);
      } catch (err) {
        console.error(err);
      }
    };
    loadPolicies();
  }, []);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!concerns.trim()) return;

    setLoading(true);
    setCopied(false);
    try {
      const draft = await api.generateCitizenDraft({
        policy_id: selectedPolicyId,
        session_token: sessionToken,
        response_type: responseType,
        citizen_position: citizenPosition,
        concerns: concerns,
        user_ward: userWard,
        specific_points: specificPoints
      });
      setGeneratedDraft(draft.full_draft);
    } catch (err) {
      console.error("Failed to generate draft", err);
      alert("Failed to generate civic draft. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!generatedDraft) return;
    navigator.clipboard.writeText(generatedDraft);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-rose-900 via-slate-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 text-rose-200 text-xs font-semibold border border-rose-400/30">
          <FileText className="w-3.5 h-3.5 text-amber-400" />
          <span>Democratic Feedback & Legal Representation Drafter</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
          Citizen Response Assistant
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
          Convert your thoughts and local neighborhood concerns into formal, structured, and respectful submissions for municipal public consultations, objections, and RTI filings.
        </p>
      </div>

      {/* Main Grid: Input Form + Generated Output */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Form Inputs */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
          <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
            Draft Submission Parameters
          </h2>

          <form onSubmit={handleGenerate} className="space-y-4">
            {/* Policy Selection */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                1. Target Municipal Policy
              </label>
              <select
                value={selectedPolicyId}
                onChange={(e) => setSelectedPolicyId(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-rose-500"
              >
                {policies.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.code}: {p.title.substring(0, 42)}...
                  </option>
                ))}
              </select>
            </div>

            {/* Response Type */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                2. Type of Submission
              </label>
              <select
                value={responseType}
                onChange={(e) => setResponseType(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-rose-500"
              >
                <option value="objection">Formal Statement of Objection (Under Municipal Act)</option>
                <option value="feedback">Constructive Public Consultation Feedback</option>
                <option value="support">Statement of Community Support & Recommendations</option>
                <option value="rti">Right to Information (RTI) Inquiry</option>
                <option value="email">Representation to Municipal Commissioner / Ward Committee</option>
              </select>
            </div>

            {/* User Locality */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                3. Your Ward / Neighborhood Context
              </label>
              <input
                type="text"
                value={userWard}
                onChange={(e) => setUserWard(e.target.value)}
                placeholder="e.g., Indiranagar 100ft Road Resident, Bengaluru"
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>

            {/* Core Concerns */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                4. Your Key Concerns & Lived Experience
              </label>
              <textarea
                value={concerns}
                onChange={(e) => setConcerns(e.target.value)}
                placeholder="Describe your observations, local infrastructure constraints, or why this policy affects your daily life..."
                rows={4}
                className="w-full p-3 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500 placeholder:text-slate-400 leading-relaxed font-medium"
              />
            </div>

            {/* Specific Requests / Solutions */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                5. Specific Requests / Proposed Amendments (Optional)
              </label>
              <input
                type="text"
                value={specificPoints}
                onChange={(e) => setSpecificPoints(e.target.value)}
                placeholder="e.g., Require traffic impact study before granting permits..."
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>{loading ? 'Synthesizing Formal Draft...' : 'Generate Civic Response Draft'}</span>
            </button>
          </form>
        </div>

        {/* Generated Draft Output Box */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  Citizen Response Draft
                </h3>
              </div>

              {generatedDraft && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied!' : 'Copy Draft'}</span>
                  </button>
                </div>
              )}
            </div>

            {/* Non-fabrication reminder */}
            <div className="p-2.5 rounded-xl bg-slate-100 text-[11px] text-slate-600 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-slate-500 shrink-0" />
              <span>Grounded integrity: Generated based solely on your provided points and verified policy clauses.</span>
            </div>

            {/* Textarea or Pre block */}
            {generatedDraft ? (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 font-mono text-xs text-slate-800 leading-relaxed whitespace-pre-wrap max-h-[380px] overflow-y-auto">
                {generatedDraft}
              </div>
            ) : (
              <div className="p-16 text-center text-xs text-slate-400 space-y-2 border-2 border-dashed border-slate-200 rounded-2xl">
                <FileText className="w-10 h-10 mx-auto text-slate-300" />
                <p>Fill in your parameters on the left and click <strong>"Generate Civic Response Draft"</strong>.</p>
              </div>
            )}
          </div>

          {generatedDraft && (
            <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
              <span>Ready for submission at Ward Committee or BBMP portal.</span>
              <span className="font-bold text-rose-700">DRAFT ONLY</span>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
