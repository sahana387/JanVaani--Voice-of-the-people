import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { QuadraticTopic, QuadraticVotingState } from '../types';
import { 
  UserCheck, Zap, ShieldCheck, CheckCircle2, 
  HelpCircle, BarChart3, Plus, Minus, RotateCcw, Award
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import confetti from 'canvas-confetti';

export const QuadraticVotingPage: React.FC = () => {
  const { sessionToken, t } = useApp();
  const [votingState, setVotingState] = useState<QuadraticVotingState | null>(null);
  const [allocations, setAllocations] = useState<Record<number, number>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const VOTE_COSTS = [0, 1, 4, 9, 16, 25, 36, 49, 64, 81, 100];

  useEffect(() => {
    const loadTopics = async () => {
      setLoading(true);
      try {
        const data = await api.getQuadraticTopics(sessionToken);
        setVotingState(data);
        
        // Initial state
        const initialAlloc: Record<number, number> = {};
        data.topics?.forEach((topic: QuadraticTopic) => {
          initialAlloc[topic.id] = topic.user_credits_spent || 0;
        });
        setAllocations(initialAlloc);
      } catch (err) {
        console.error("Failed to load quadratic topics", err);
      } finally {
        setLoading(false);
      }
    };
    loadTopics();
  }, [sessionToken]);

  const totalCreditsUsed = Object.values(allocations).reduce((a, b) => a + b, 0);
  const creditsRemaining = Math.max(0, 100 - totalCreditsUsed);

  const getVotesForCredits = (credits: number) => {
    return Math.floor(Math.sqrt(credits));
  };

  const handleAdjustVotes = (topicId: number, currentCredits: number, direction: 'up' | 'down') => {
    const currentVotes = getVotesForCredits(currentCredits);
    const targetVotes = direction === 'up' ? currentVotes + 1 : Math.max(0, currentVotes - 1);
    const targetCost = targetVotes * targetVotes;
    const costDifference = targetCost - currentCredits;

    if (direction === 'up' && costDifference > creditsRemaining) {
      alert("Not enough credits remaining. Adjust other topics to free up credits!");
      return;
    }

    setAllocations(prev => ({
      ...prev,
      [topicId]: targetCost
    }));
  };

  const handleReset = () => {
    const resetAlloc: Record<number, number> = {};
    votingState?.topics.forEach(t => resetAlloc[t.id] = 0);
    setAllocations(resetAlloc);
  };

  const handleCastVotes = async () => {
    if (totalCreditsUsed > 100) {
      alert("Allocated credits exceed 100 credit limit.");
      return;
    }

    setSaving(true);
    setSuccessMessage('');
    try {
      const payloadAllocations = Object.entries(allocations).map(([topicId, credits]) => ({
        topic_id: Number(topicId),
        credits_allocated: credits
      }));

      await api.castQuadraticVotes({
        session_token: sessionToken,
        allocations: payloadAllocations
      });

      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });

      setSuccessMessage("Your quadratic votes were successfully recorded in the municipal civic ledger!");
      
      // Refresh topics to get updated community totals
      const updated = await api.getQuadraticTopics(sessionToken);
      setVotingState(updated);
    } catch (err: any) {
      alert(err.message || "Failed to submit quadratic votes.");
    } finally {
      setSaving(false);
    }
  };

  const chartData = votingState?.topics.map(t => ({
    name: t.title.substring(0, 26) + '...',
    fullTitle: t.title,
    votes: t.total_votes_cast,
    credits: t.total_credits_spent
  })) || [];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 text-purple-200 text-xs font-semibold border border-purple-400/30">
          <UserCheck className="w-3.5 h-3.5 text-amber-400" />
          <span>Democratic Participation Mechanism</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
          Quadratic Civic Voting Arena
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-3xl">
          Quadratic voting allows you to express the <em>intensity</em> of your preference. 
          Cost of votes increases quadratically (Cost = Votes²). You have 100 civic credits.
        </p>
      </div>

      {/* Credit Budget Bar */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4 sticky top-20 z-20 backdrop-blur-md bg-white/95">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Total Budget
              </span>
              <span className="text-xl font-black text-slate-900">100 Credits</span>
            </div>
            <div className="h-8 w-px bg-slate-200"></div>
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Credits Used
              </span>
              <span className="text-xl font-black text-purple-600">{totalCreditsUsed}</span>
            </div>
            <div className="h-8 w-px bg-slate-200"></div>
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Credits Remaining
              </span>
              <span className={`text-xl font-black ${creditsRemaining > 0 ? 'text-emerald-600' : 'text-slate-500'}`}>
                {creditsRemaining}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleReset}
              className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 border border-slate-200 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
            <button
              onClick={handleCastVotes}
              disabled={saving}
              className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white text-xs font-bold transition-all shadow-md"
            >
              {saving ? 'Recording Votes...' : 'Confirm & Cast Votes'}
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${
              totalCreditsUsed > 100 ? 'bg-rose-500' : 'bg-gradient-to-r from-purple-500 to-indigo-600'
            }`}
            style={{ width: `${Math.min(100, (totalCreditsUsed / 100) * 100)}%` }}
          ></div>
        </div>

        {successMessage && (
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}
      </div>

      {/* Quadratic Formula Explanation Box */}
      <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-200 text-xs text-purple-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 font-semibold">
          <HelpCircle className="w-4 h-4 text-purple-700 shrink-0" />
          <span>Quadratic Scale: 1 vote = 1 credit • 2 votes = 4 cr • 3 votes = 9 cr • 4 votes = 16 cr • 5 votes = 25 cr</span>
        </div>
        <span className="text-[11px] font-bold text-purple-800 bg-purple-100 px-2.5 py-1 rounded-lg">
          Non-Linear Civic Power
        </span>
      </div>

      {/* Topics Allocation Cards */}
      <div className="space-y-4">
        {votingState?.topics.map((topic) => {
          const creditsSpent = allocations[topic.id] || 0;
          const votesAwarded = getVotesForCredits(creditsSpent);
          const nextCost = (votesAwarded + 1) * (votesAwarded + 1) - creditsSpent;

          return (
            <div
              key={topic.id}
              className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-purple-300 transition-all"
            >
              <div className="space-y-1.5 max-w-xl">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-purple-50 text-purple-800 border border-purple-200 uppercase">
                    {topic.category}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Community Total: {topic.total_votes_cast} votes ({topic.total_credits_spent} credits)
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  {topic.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {topic.description}
                </p>
              </div>

              {/* Vote Counter Widget */}
              <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200/80 shrink-0">
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Credits Spent
                  </span>
                  <strong className="text-sm text-purple-700 font-extrabold">{creditsSpent} cr</strong>
                </div>

                <div className="flex items-center gap-2 bg-white p-1 rounded-xl border border-slate-200 shadow-inner">
                  <button
                    onClick={() => handleAdjustVotes(topic.id, creditsSpent, 'down')}
                    disabled={votesAwarded === 0}
                    className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 disabled:opacity-30 text-slate-700 flex items-center justify-center font-bold transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>

                  <div className="w-12 text-center">
                    <span className="text-lg font-black text-slate-900 block">{votesAwarded}</span>
                    <span className="text-[9px] uppercase font-bold text-slate-400 block -mt-1">Votes</span>
                  </div>

                  <button
                    onClick={() => handleAdjustVotes(topic.id, creditsSpent, 'up')}
                    disabled={creditsRemaining < nextCost}
                    className="w-8 h-8 rounded-lg bg-purple-600 hover:bg-purple-700 disabled:opacity-30 text-white flex items-center justify-center font-bold transition-colors shadow-sm"
                    title={`Next vote costs ${nextCost} more credits`}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Community Results Chart */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Aggregated Community Priority Distribution
            </h2>
            <p className="text-xs text-slate-500">
              Total quadratic votes cast across Bengaluru wards
            </p>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-800 border border-purple-200">
            Public Participation Ledger
          </span>
        </div>

        <div className="h-64 mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip
                formatter={(val: any) => [`${val} Votes`, 'Community Priority']}
                contentStyle={{ borderRadius: '0.75rem', fontSize: '11px', border: '1px solid #e2e8f0' }}
              />
              <Bar dataKey="votes" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
