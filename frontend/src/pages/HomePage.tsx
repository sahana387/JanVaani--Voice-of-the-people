import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { Policy, Ward } from '../types';
import { PolicyCard } from '../components/PolicyCard';
import { 
  Search, Sparkles, MapPin, Scale, MessageSquare, 
  BarChart3, UserCheck, ShieldCheck, ArrowRight, Clock,
  FileText, CheckCircle2, ChevronRight
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const { t, language, selectedWardNumber, setSelectedWardNumber, selectedWardName, setSelectedWardName } = useApp();
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [polRes, wardRes] = await Promise.all([
          api.getPolicies({ lang: language }),
          api.getWards()
        ]);
        setPolicies(polRes.policies || []);
        setWards(wardRes.wards || []);
      } catch (err) {
        console.error("Failed to load home data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [language]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/policies?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleWardChange = (wardNum: number) => {
    const found = wards.find(w => w.ward_number === wardNum);
    setSelectedWardNumber(wardNum);
    if (found) setSelectedWardName(found.name);
  };

  const activeConsultations = policies.filter(p => p.status === 'Public Consultation');

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-900 via-slate-900 to-slate-900 text-white pt-16 pb-20 px-4 sm:px-6 lg:px-8 rounded-b-3xl shadow-xl">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px]"></div>

        <div className="relative max-w-5xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 text-xs font-semibold backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{t.tagline}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
            {t.heroHeadline}
          </h1>

          <p className="text-sm sm:text-lg text-slate-300 max-w-3xl mx-auto font-normal leading-relaxed">
            {t.heroSubheadline}
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto pt-4">
            <div className="relative flex items-center bg-white rounded-2xl shadow-2xl p-2 border border-slate-200">
              <Search className="w-5 h-5 text-slate-400 ml-3 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.searchPlaceholder}
                className="w-full px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none bg-transparent"
              />
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors shadow-md shrink-0"
              >
                {t.searchPolicies}
              </button>
            </div>
          </form>

          {/* Quick Stats Banner */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 max-w-4xl mx-auto text-left">
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="text-2xl font-black text-amber-400">4+</div>
              <div className="text-xs text-slate-400 font-medium">{t.municipalPolicies}</div>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="text-2xl font-black text-emerald-400">100%</div>
              <div className="text-xs text-slate-400 font-medium">{t.groundedCitations}</div>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="text-2xl font-black text-blue-400">6 Wards</div>
              <div className="text-xs text-slate-400 font-medium">{t.gisMappedZones}</div>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="text-2xl font-black text-purple-400">100 Credits</div>
              <div className="text-xs text-slate-400 font-medium">{t.quadraticVotingArena}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Ward-Specific Alert Bar */}
        <section className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200/80 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-blue-600 text-white shadow-md shadow-blue-500/20 shrink-0">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900">
                  {t.policiesAffectingArea}
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800">
                  Ward {selectedWardNumber}
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1">
                {t.showingImpactFor} <strong>{selectedWardName}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-stretch md:self-auto">
            <select
              value={selectedWardNumber}
              onChange={(e) => handleWardChange(Number(e.target.value))}
              className="px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs font-semibold text-slate-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {wards.map((w) => (
                <option key={w.ward_number} value={w.ward_number}>
                  Ward {w.ward_number} — {w.name}
                </option>
              ))}
            </select>
            <Link
              to="/for-you"
              className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-colors shrink-0 shadow-sm flex items-center gap-1"
            >
              <span>{t.personalizedView}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </section>

        {/* Active Public Consultations Countdown */}
        {activeConsultations.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping"></div>
                <h2 className="text-xl font-bold text-slate-900">
                  {t.activeConsultations}
                </h2>
              </div>
              <Link to="/alerts" className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1">
                {t.viewDeadlines} <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeConsultations.map((pol) => (
                <div
                  key={pol.id}
                  className="bg-amber-50/50 rounded-2xl p-5 border border-amber-200 flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[11px] font-bold text-amber-900">
                      <span>{pol.code}</span>
                      <span className="flex items-center gap-1 text-amber-700">
                        <Clock className="w-3.5 h-3.5" />
                        {t.deadline}: {pol.consultation_deadline}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-900">
                      {pol.title}
                    </h3>
                    <p className="text-xs text-slate-600 line-clamp-2">
                      {pol.summary_simple}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-amber-200/60 text-xs">
                    <Link
                      to={`/citizen-response?policy_id=${pol.id}`}
                      className="font-bold text-amber-900 hover:text-amber-950 flex items-center gap-1"
                    >
                      <span>{t.draftPublicComment}</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                    <Link
                      to={`/policies/${pol.id}`}
                      className="font-bold text-blue-600 hover:underline"
                    >
                      {t.readPolicy} →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Featured Policies Grid */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                {t.recentChanges}
              </h2>
              <p className="text-xs text-slate-500">
                {t.officialMunicipalBylaws}
              </p>
            </div>
            <Link
              to="/policies"
              className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              {t.browseAll} ({policies.length}) <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-64 rounded-2xl bg-slate-100 animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
              {policies.slice(0, 4).map((policy) => (
                <PolicyCard key={policy.id} policy={policy} />
              ))}
            </div>
          )}
        </section>

        {/* Civic Features Showcase Grid */}
        <section className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 space-y-8 shadow-2xl">
          <div className="max-w-2xl">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {t.civicAiEcosystem}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-2">
              {t.civicAiEcosystemDesc}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link
              to="/chat"
              className="group p-6 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all space-y-3"
            >
              <div className="p-3 rounded-xl bg-blue-500/20 text-blue-400 w-fit">
                <MessageSquare className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white group-hover:text-blue-300 transition-colors">
                {t.groundedRagAssistant}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {t.groundedRagDesc}
              </p>
            </Link>

            <Link
              to="/map"
              className="group p-6 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all space-y-3"
            >
              <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-400 w-fit">
                <MapPin className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
                {t.interactiveWardGIS}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {t.interactiveWardGISDesc}
              </p>
            </Link>

            <Link
              to="/compare/1"
              className="group p-6 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all space-y-3"
            >
              <div className="p-3 rounded-xl bg-amber-500/20 text-amber-400 w-fit">
                <Scale className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                {t.oldVsNewPolicy}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {t.oldVsNewPolicyDesc}
              </p>
            </Link>

            <Link
              to="/quadratic-voting"
              className="group p-6 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all space-y-3"
            >
              <div className="p-3 rounded-xl bg-purple-500/20 text-purple-400 w-fit">
                <UserCheck className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors">
                {t.quadraticCivicVoting}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {t.quadraticCivicVotingDesc}
              </p>
            </Link>

            <Link
              to="/citizen-response"
              className="group p-6 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all space-y-3"
            >
              <div className="p-3 rounded-xl bg-rose-500/20 text-rose-400 w-fit">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white group-hover:text-rose-300 transition-colors">
                {t.citizenResponseAssistant2}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {t.citizenResponseAssistant2Desc}
              </p>
            </Link>

            <Link
              to="/sentiment/1"
              className="group p-6 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all space-y-3"
            >
              <div className="p-3 rounded-xl bg-indigo-500/20 text-indigo-400 w-fit">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">
                {t.publicSentimentTracker}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {t.publicSentimentTrackerDesc}
              </p>
            </Link>
          </div>
        </section>

      </div>
    </div>
  );
};
