import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { Policy, SentimentData } from '../types';
import { 
  BarChart3, ThumbsUp, ThumbsDown, Minus, MessageSquare, 
  ShieldCheck, AlertCircle, Send, CheckCircle2, Users, ArrowLeft
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export const PublicSentimentPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const policyId = id ? Number(id) : 1;

  const { selectedWardNumber, sessionToken, t } = useApp();
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [currentPolicyId, setCurrentPolicyId] = useState<number>(policyId);
  const [sentimentData, setSentimentData] = useState<SentimentData | null>(null);
  const [userStance, setUserStance] = useState<'support' | 'oppose' | 'neutral' | null>(null);
  const [userComment, setUserComment] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadInitial = async () => {
      setLoading(true);
      try {
        const [polList, sent] = await Promise.all([
          api.getPolicies(),
          api.getSentiment(currentPolicyId)
        ]);
        setPolicies(polList.policies || []);
        setSentimentData(sent);
      } catch (err) {
        console.error("Failed to load sentiment", err);
      } finally {
        setLoading(false);
      }
    };
    loadInitial();
  }, [currentPolicyId]);

  const handleVote = async (stance: 'support' | 'oppose' | 'neutral') => {
    setUserStance(stance);
    try {
      await api.submitSentiment({
        policy_id: currentPolicyId,
        stance: stance,
        comment: userComment.trim() || undefined,
        ward_number: selectedWardNumber,
        session_token: sessionToken
      });
      setSubmitted(true);
      // Refresh aggregated stats
      const updated = await api.getSentiment(currentPolicyId);
      setSentimentData(updated);
    } catch (err) {
      console.error("Failed to submit sentiment", err);
    }
  };

  const chartData = sentimentData ? [
    { name: 'Support', percentage: sentimentData.support_pct, count: sentimentData.support_count, fill: '#10b981' },
    { name: 'Oppose', percentage: sentimentData.oppose_pct, count: sentimentData.oppose_count, fill: '#ef4444' },
    { name: 'Neutral', percentage: sentimentData.neutral_pct, count: sentimentData.neutral_count, fill: '#64748b' },
  ] : [];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Breadcrumb & Policy Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Link
          to={`/policies/${currentPolicyId}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Policy View</span>
        </Link>

        <div className="flex items-center gap-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Select Policy:
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
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-200 text-xs font-semibold border border-blue-400/30">
          <BarChart3 className="w-3.5 h-3.5 text-emerald-400" />
          <span>Aggregated & Anonymized Civic Stance</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Public Sentiment Dashboard
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
          Express your anonymous stance on municipal proposals. Individual votes are never made public.
        </p>
      </div>

      {/* Privacy & Distinction Notice */}
      <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200 text-xs text-slate-600 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        <div>
          <strong className="text-slate-900 font-bold block">
            Official Distinction & Privacy Safeguard:
          </strong>
          <span>
            Public sentiment reflects voluntary anonymous citizen participation and does not represent the entire general population or official BBMP gazette approval.
          </span>
        </div>
      </div>

      {/* Main Grid: Voting Card + Stats Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Voting Box */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Cast Your Anonymous Stance
            </h2>
            <p className="text-xs text-slate-500">
              One anonymous entry per session. Your choice is aggregated in real-time.
            </p>
          </div>

          {/* Stance Buttons */}
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => handleVote('support')}
              className={`p-4 rounded-2xl border flex flex-col items-center gap-2 transition-all ${
                userStance === 'support'
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-500/20'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-emerald-50 hover:text-emerald-800'
              }`}
            >
              <ThumbsUp className="w-6 h-6" />
              <span className="text-xs font-bold">Support</span>
            </button>

            <button
              onClick={() => handleVote('oppose')}
              className={`p-4 rounded-2xl border flex flex-col items-center gap-2 transition-all ${
                userStance === 'oppose'
                  ? 'bg-rose-600 text-white border-rose-600 shadow-md shadow-rose-500/20'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-rose-50 hover:text-rose-800'
              }`}
            >
              <ThumbsDown className="w-6 h-6" />
              <span className="text-xs font-bold">Oppose</span>
            </button>

            <button
              onClick={() => handleVote('neutral')}
              className={`p-4 rounded-2xl border flex flex-col items-center gap-2 transition-all ${
                userStance === 'neutral'
                  ? 'bg-slate-800 text-white border-slate-800 shadow-md shadow-slate-800/20'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Minus className="w-6 h-6" />
              <span className="text-xs font-bold">Neutral</span>
            </button>
          </div>

          {/* Optional Comment Input */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Optional Civic Comment (Anonymized)
            </label>
            <textarea
              value={userComment}
              onChange={(e) => setUserComment(e.target.value)}
              placeholder="Share why you support or oppose this policy (e.g., impact on local traffic, water supply, parking)..."
              className="w-full p-3 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 h-24 placeholder:text-slate-400"
            />
          </div>

          {submitted && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Thank you! Your stance was securely recorded.</span>
            </div>
          )}

          <button
            onClick={() => handleVote(userStance || 'support')}
            className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors shadow-md"
          >
            {submitted ? 'Update My Anonymous Stance' : 'Submit My Stance'}
          </button>
        </div>

        {/* Aggregated Results Chart */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Aggregated Citizen Stance Distribution
                </h2>
                <p className="text-xs text-slate-500">
                  Total Participants: <strong>{sentimentData?.total_participants || 0}</strong> verified citizen responses
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
                Live Poll
              </span>
            </div>

            {/* Recharts Bar */}
            <div className="h-56 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} domain={[0, 100]} />
                  <Tooltip
                    formatter={(val: any) => [`${val}%`, 'Stance Ratio']}
                    contentStyle={{ borderRadius: '0.75rem', fontSize: '11px', border: '1px solid #e2e8f0' }}
                  />
                  <Bar dataKey="percentage" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Stance Numbers Breakdown */}
          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-100 text-center">
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
              <div className="text-lg font-black text-emerald-700">
                {sentimentData?.support_pct || 0}%
              </div>
              <div className="text-[11px] text-emerald-900 font-bold">Support</div>
            </div>

            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200">
              <div className="text-lg font-black text-rose-700">
                {sentimentData?.oppose_pct || 0}%
              </div>
              <div className="text-[11px] text-rose-900 font-bold">Oppose</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-100 border border-slate-200">
              <div className="text-lg font-black text-slate-700">
                {sentimentData?.neutral_pct || 0}%
              </div>
              <div className="text-[11px] text-slate-900 font-bold">Neutral</div>
            </div>
          </div>
        </div>

      </div>

      {/* Community Comments Stream */}
      {sentimentData?.recent_comments && sentimentData.recent_comments.length > 0 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-blue-600" />
            <h2 className="text-base font-bold text-slate-900">
              Recent Anonymized Community Perspectives
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sentimentData.recent_comments.map((c, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                    c.stance === 'support' ? 'bg-emerald-100 text-emerald-900' :
                    c.stance === 'oppose' ? 'bg-rose-100 text-rose-900' :
                    'bg-slate-200 text-slate-800'
                  }`}>
                    {c.stance}
                  </span>
                  <span className="text-[10px] text-slate-400">{c.timestamp}</span>
                </div>
                <p className="text-slate-700 leading-relaxed italic">
                  "{c.comment}"
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
