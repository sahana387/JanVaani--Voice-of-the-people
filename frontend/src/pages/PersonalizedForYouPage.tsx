import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { Policy, Ward } from '../types';
import { PolicyCard } from '../components/PolicyCard';
import { 
  Sparkles, MapPin, CheckSquare, Square, Filter, 
  ArrowRight, ShieldCheck, Zap, Sliders, Bell
} from 'lucide-react';

export const PersonalizedForYouPage: React.FC = () => {
  const { 
    selectedWardNumber, setSelectedWardNumber, 
    selectedWardName, setSelectedWardName,
    userInterests, toggleInterest, language
  } = useApp();

  const [wards, setWards] = useState<Ward[]>([]);
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [loading, setLoading] = useState(true);

  const availableInterests = [
    { id: 'Zoning & Planning', label: 'Housing & Zoning Regulations' },
    { id: 'Transport & Mobility', label: 'Traffic, Roads & Public Transit' },
    { id: 'Environment & Waste', label: 'Waste Segregation & Sanitation' },
    { id: 'Environment & Energy', label: 'Rooftop Solar & Clean Energy' },
    { id: 'Taxation & Finance', label: 'Property Tax & Betterment Levies' },
  ];

  useEffect(() => {
    const loadInitial = async () => {
      setLoading(true);
      try {
        const [wRes, pRes] = await Promise.all([
          api.getWards(),
          api.getPolicies({ lang: language })
        ]);
        setWards(wRes.wards || []);
        setPolicies(pRes.policies || []);
      } catch (err) {
        console.error("Failed to load personalized data", err);
      } finally {
        setLoading(false);
      }
    };
    loadInitial();
  }, [language]);

  const handleWardChange = (wardNum: number) => {
    const found = wards.find(w => w.ward_number === wardNum);
    setSelectedWardNumber(wardNum);
    if (found) setSelectedWardName(found.name);
  };

  // Filter policies based on user interests
  const relevantPolicies = policies.filter(p => {
    if (userInterests.length === 0) return true;
    return userInterests.includes(p.category);
  });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-200 text-xs font-semibold border border-blue-400/30">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Personalized Civic Engine</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
          Your Personalized Policy Feed
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
          Instead of wading through hundreds of pages of municipal gazettes, JanVaani matches policies directly to your neighborhood and citizen interests.
        </p>
      </div>

      {/* Profile & Preferences Selector */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center gap-2">
          <Sliders className="w-5 h-5 text-blue-600" />
          <h2 className="text-base font-bold text-slate-900">
            Citizen Preferences & Location Profile
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Location / Ward */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              1. Your Selected Ward / Locality
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <select
                value={selectedWardNumber}
                onChange={(e) => handleWardChange(Number(e.target.value))}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {wards.map((w) => (
                  <option key={w.ward_number} value={w.ward_number}>
                    Ward {w.ward_number} — {w.name} ({w.zone} Zone)
                  </option>
                ))}
              </select>
            </div>
            <p className="text-[11px] text-slate-500">
              Matched locality: <strong>{selectedWardName}</strong> (Bengaluru)
            </p>
          </div>

          {/* Interests Checklist */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              2. Your Civic Interest Areas
            </label>
            <div className="grid grid-cols-1 gap-1.5 max-h-44 overflow-y-auto pr-1">
              {availableInterests.map((interest) => {
                const isSelected = userInterests.includes(interest.id);
                return (
                  <button
                    key={interest.id}
                    onClick={() => toggleInterest(interest.id)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-left transition-all border ${
                      isSelected
                        ? 'bg-blue-50 border-blue-200 text-blue-900 font-semibold'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {isSelected ? (
                      <CheckSquare className="w-4 h-4 text-blue-600 shrink-0" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-400 shrink-0" />
                    )}
                    <span>{interest.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic Impact Statement Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200/80 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-600 text-white shadow-md shadow-emerald-500/20 shrink-0">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-emerald-950">
              {relevantPolicies.length} new municipal policies directly affect your selected area and interests.
            </h3>
            <p className="text-xs text-emerald-800">
              Filtered for {selectedWardName} • Showing high-relevance decisions.
            </p>
          </div>
        </div>

        <Link
          to="/map"
          className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-colors shrink-0 shadow-sm"
        >
          View on GIS Map
        </Link>
      </div>

      {/* Personalized Policies Stream */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900">
            Your Tailored Policy Impact Stream
          </h3>
          <span className="text-xs text-slate-500">
            Showing <strong>{relevantPolicies.length}</strong> prioritized policies
          </span>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2].map((n) => (
              <div key={n} className="h-64 rounded-2xl bg-slate-100 animate-pulse"></div>
            ))}
          </div>
        ) : relevantPolicies.length === 0 ? (
          <div className="p-12 bg-white rounded-3xl border text-center text-xs text-slate-500 space-y-2">
            <p>No policies match your selected interest filters.</p>
            <button
              onClick={() => toggleInterest('Zoning & Planning')}
              className="text-blue-600 font-bold hover:underline"
            >
              Reset Interest Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {relevantPolicies.map((policy) => (
              <PolicyCard key={policy.id} policy={policy} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
