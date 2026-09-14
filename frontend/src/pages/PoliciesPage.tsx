import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { Policy, Ward } from '../types';
import { PolicyCard } from '../components/PolicyCard';
import { Search, Filter, SlidersHorizontal, Building2, CheckCircle2, RotateCcw } from 'lucide-react';

export const PoliciesPage: React.FC = () => {
  const { language, t } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedCategory, setSelectedCategory] = useState<string>(searchParams.get('category') || 'All');
  const [selectedStatus, setSelectedStatus] = useState<string>(searchParams.get('status') || 'All');
  const [selectedWard, setSelectedWard] = useState<string>(searchParams.get('ward') || 'All');
  const [searchTerm, setSearchTerm] = useState<string>(searchParams.get('search') || '');

  const categories = [
    { id: 'All', label: t.allCategories },
    { id: 'Zoning & Planning', label: t.housingZoning },
    { id: 'Transport & Mobility', label: t.trafficRoads },
    { id: 'Environment & Waste', label: t.wasteSegregation },
    { id: 'Environment & Energy', label: t.rooftopSolar },
  ];

  const statuses = [
    { id: 'All', label: t.allStatuses },
    { id: 'Public Consultation', label: t.activeConsultations },
    { id: 'Active', label: 'Active' },
    { id: 'Enacted', label: 'Enacted' }
  ];

  useEffect(() => {
    const loadWards = async () => {
      try {
        const res = await api.getWards();
        setWards(res.wards || []);
      } catch (err) {
        console.error(err);
      }
    };
    loadWards();
  }, []);

  useEffect(() => {
    const fetchPolicies = async () => {
      setLoading(true);
      try {
        const params: any = { lang: language };
        if (selectedCategory !== 'All') params.category = selectedCategory;
        if (selectedStatus !== 'All') params.status = selectedStatus;
        if (selectedWard !== 'All') params.ward_number = Number(selectedWard);
        if (searchTerm.trim()) params.search = searchTerm.trim();

        const res = await api.getPolicies(params);
        setPolicies(res.policies || []);
      } catch (err) {
        console.error("Failed to load policies", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPolicies();
  }, [selectedCategory, selectedStatus, selectedWard, searchTerm, language]);

  const resetFilters = () => {
    setSelectedCategory('All');
    setSelectedStatus('All');
    setSelectedWard('All');
    setSearchTerm('');
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-wider">
          <Building2 className="w-4 h-4" />
          <span>{t.municipalTransparencyPortal}</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          {t.browsePolicies}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-3xl">
          {t.browsePoliciesDesc}
        </p>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t.searchKeywordOrCode}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
            />
          </div>

          {/* Category */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.label}</option>
            ))}
          </select>

          {/* Status */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {statuses.map((s) => (
              <option key={s.id} value={s.id}>{s.label}</option>
            ))}
          </select>

          {/* Ward */}
          <select
            value={selectedWard}
            onChange={(e) => setSelectedWard(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">{t.allWards}</option>
            {wards.map((w) => (
              <option key={w.ward_number} value={w.ward_number.toString()}>
                Ward {w.ward_number} — {w.name}
              </option>
            ))}
          </select>
        </div>

        {/* Filter Summary & Reset */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
          <span>Found <strong>{policies.length}</strong> {t.foundPolicies}</span>
          {(selectedCategory !== 'All' || selectedStatus !== 'All' || selectedWard !== 'All' || searchTerm) && (
            <button
              onClick={resetFilters}
              className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800"
            >
              <RotateCcw className="w-3 h-3" />
              {t.resetFilters}
            </button>
          )}
        </div>
      </div>

      {/* Policy Cards Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="h-72 rounded-2xl bg-slate-100 animate-pulse"></div>
          ))}
        </div>
      ) : policies.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 space-y-3">
          <Filter className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">{t.noPoliciesFound}</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {t.noPoliciesFoundDesc}
          </p>
          <button
            onClick={resetFilters}
            className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700"
          >
            {t.resetAllFilters}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {policies.map((policy) => (
            <PolicyCard key={policy.id} policy={policy} />
          ))}
        </div>
      )}
    </div>
  );
};
