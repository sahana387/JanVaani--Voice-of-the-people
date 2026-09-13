import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { Policy, Citation } from '../types';
import { CitationPill } from '../components/CitationPill';
import { 
  MessageSquare, Send, Sparkles, ShieldCheck, AlertCircle, 
  HelpCircle, User, Bot, CornerDownLeft, RefreshCw, ChevronRight
} from 'lucide-react';

interface ChatMsg {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  confidence?: number;
  citations?: Citation[];
  hasEvidence?: boolean;
  disclaimer?: string;
  timestamp: string;
}

export const AskJanVaaniPage: React.FC = () => {
  const { language, t } = useApp();
  const [searchParams] = useSearchParams();
  const initialPolicyId = searchParams.get('policy_id') ? Number(searchParams.get('policy_id')) : undefined;

  const [policies, setPolicies] = useState<Policy[]>([]);
  const [selectedPolicyId, setSelectedPolicyId] = useState<number | undefined>(initialPolicyId);
  const [inputQuery, setInputQuery] = useState('');
  const [messages, setMessages] = useState<ChatMsg[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: t.welcomeMessage,
      confidence: 100,
      timestamp: 'Just now'
    }
  ]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const sampleQuestions = [
    "What is the maximum building height permitted along 12 meter roads?",
    "What are the penalties for unsegregated wet and dry waste?",
    "Will the Outer Ring Road bus priority lane fine private cars?",
    "What are the property tax rebate rules for rooftop solar installations?",
    "When is the deadline for public objections on revised zoning regulations?"
  ];

  useEffect(() => {
    const loadPolicies = async () => {
      try {
        const res = await api.getPolicies();
        setPolicies(res.policies || []);
      } catch (err) {
        console.error("Failed to load policies", err);
      }
    };
    loadPolicies();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || inputQuery;
    if (!textToSend.trim() || loading) return;

    const userMsg: ChatMsg = {
      id: 'msg_' + Date.now(),
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!queryText) setInputQuery('');
    setLoading(true);

    try {
      const response = await api.askChatbot({
        question: textToSend,
        policy_id: selectedPolicyId,
        language: language
      });

      const assistantMsg: ChatMsg = {
        id: 'msg_bot_' + Date.now(),
        sender: 'assistant',
        text: response.answer,
        confidence: response.confidence_score,
        citations: response.citations || [],
        hasEvidence: response.has_sufficient_evidence,
        disclaimer: response.disclaimer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      const errorMsg: ChatMsg = {
        id: 'msg_err_' + Date.now(),
        sender: 'assistant',
        text: "An error occurred while querying the municipal grounding engine. Please try again.",
        confidence: 0,
        hasEvidence: false,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-200 text-xs font-semibold border border-blue-400/30">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>{t.groundedEvidenceRag}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {t.askJanVaaniTitle}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300">
              {t.askJanVaaniDesc}
            </p>
          </div>

          {/* Policy Scope Dropdown */}
          <div className="bg-white/10 p-3 rounded-2xl border border-white/15 backdrop-blur-sm space-y-1.5">
            <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">
              {t.filterByScope}
            </label>
            <select
              value={selectedPolicyId || ''}
              onChange={(e) => setSelectedPolicyId(e.target.value ? Number(e.target.value) : undefined)}
              className="px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-semibold border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="">{t.allPoliciesBroad}</option>
              {policies.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.code}: {p.title.substring(0, 38)}...
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Chat Container */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col h-[580px] overflow-hidden">
        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 max-w-3xl ${
                msg.sender === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
              }`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm ${
                  msg.sender === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gradient-to-tr from-india-saffron to-amber-500 text-white font-bold text-xs'
                }`}
              >
                {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              {/* Message Bubble */}
              <div
                className={`rounded-2xl p-4 text-xs leading-relaxed space-y-2 shadow-sm ${
                  msg.sender === 'user'
                    ? 'bg-blue-600 text-white font-medium rounded-tr-none'
                    : 'bg-slate-50 text-slate-900 border border-slate-200 rounded-tl-none'
                }`}
              >
                <div className="whitespace-pre-line">{msg.text}</div>

                {/* Grounding Confidence & Citations for Assistant */}
                {msg.sender === 'assistant' && msg.citations && msg.citations.length > 0 && (
                  <div className="pt-3 border-t border-slate-200/80 space-y-2">
                    <div className="flex items-center justify-between text-[11px] text-slate-500 font-semibold">
                      <span className="flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        {t.groundedEvidenceCitations}
                      </span>
                      {msg.confidence !== undefined && (
                        <span className="text-emerald-700 font-bold">
                          {msg.confidence}% Confidence
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {msg.citations.map((cit, idx) => (
                        <CitationPill key={idx} citation={cit} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Insufficient Evidence Fallback Note */}
                {msg.sender === 'assistant' && msg.hasEvidence === false && (
                  <div className="p-2 rounded-lg bg-amber-50 border border-amber-200 text-[11px] text-amber-800 flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{t.zeroHallucinationPolicy}</span>
                  </div>
                )}

                <div className="text-[10px] text-slate-400 text-right pt-0.5">
                  {msg.timestamp}
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex gap-3 mr-auto max-w-lg">
              <div className="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 animate-spin" />
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-2xl rounded-tl-none p-4 text-xs text-slate-500 space-y-2">
                <div className="flex items-center gap-2 font-semibold text-blue-600">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>{t.searchingDatabase}</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Query Suggestions */}
        <div className="px-6 py-2 bg-slate-50 border-t border-slate-100 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider shrink-0">
            {t.suggestions}
          </span>
          {sampleQuestions.slice(0, 3).map((sq, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(sq)}
              className="text-[11px] px-3 py-1 rounded-full bg-white text-slate-700 hover:bg-blue-50 hover:text-blue-700 border border-slate-200 shrink-0 font-medium transition-colors text-left"
            >
              {sq}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="p-4 bg-white border-t border-slate-200 flex items-center gap-3"
        >
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder={t.askMunicipalQuestion}
            className="flex-1 px-4 py-3 text-xs rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium placeholder:text-slate-400"
          />
          <button
            type="submit"
            disabled={!inputQuery.trim() || loading}
            className="p-3 rounded-2xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold transition-all shadow-md shrink-0 flex items-center justify-center"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
