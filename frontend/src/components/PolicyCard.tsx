import React from 'react';
import { Link } from 'react-router-dom';
import { Policy } from '../types';
import { useApp } from '../context/AppContext';
import { 
  Building2, Calendar, FileText, ArrowRight, MessageSquare, 
  Scale, BarChart3, CheckCircle2, AlertCircle, Clock
} from 'lucide-react';

interface PolicyCardProps {
  policy: Policy;
}

export const PolicyCard: React.FC<PolicyCardProps> = ({ policy }) => {
  const { t } = useApp();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Public Consultation':
        return { bg: 'bg-amber-50 text-amber-800 border-amber-300', icon: Clock };
      case 'Active':
        return { bg: 'bg-emerald-50 text-emerald-800 border-emerald-300', icon: CheckCircle2 };
      case 'Enacted':
        return { bg: 'bg-blue-50 text-blue-800 border-blue-300', icon: CheckCircle2 };
      default:
        return { bg: 'bg-slate-50 text-slate-700 border-slate-300', icon: AlertCircle };
    }
  };

  const statusStyle = getStatusBadge(policy.status);
  const StatusIcon = statusStyle.icon;

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-blue-300 transition-all duration-300 flex flex-col justify-between overflow-hidden">
      <div className="p-6 space-y-4">
        {/* Top Badges */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200 uppercase tracking-wider">
            {policy.category}
          </span>
          <div className="flex items-center gap-1.5">
            {policy.is_demo && (
              <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-500 font-semibold border border-slate-200">
                Demo Data
              </span>
            )}
            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${statusStyle.bg}`}>
              <StatusIcon className="w-3 h-3" />
              {policy.status}
            </span>
          </div>
        </div>

        {/* Policy Code & Title */}
        <div>
          <div className="text-[11px] font-mono font-semibold text-slate-500">
            {policy.code}
          </div>
          <Link to={`/policies/${policy.id}`}>
            <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug line-clamp-2 mt-0.5">
              {policy.title}
            </h3>
          </Link>
          <p className="text-xs text-slate-500 font-medium mt-1">
            {policy.department}
          </p>
        </div>

        {/* Simple Explanation Summary */}
        <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed bg-slate-50/60 p-3 rounded-xl border border-slate-100">
          {policy.summary_simple}
        </p>

        {/* Key Statistics Tags */}
        {policy.key_statistics && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {policy.key_statistics.split('|').map((stat, idx) => (
              <span
                key={idx}
                className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-semibold border border-slate-200"
              >
                {stat.trim()}
              </span>
            ))}
          </div>
        )}

        {/* Dates */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>Effective: <strong className="text-slate-700 font-semibold">{policy.effective_date}</strong></span>
          </div>
          {policy.consultation_deadline && (
            <div className="text-amber-700 font-medium">
              Consultation until: <strong>{policy.consultation_deadline}</strong>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Action Footer */}
      <div className="bg-slate-50/80 px-6 py-3 border-t border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link
            to={`/chat?policy_id=${policy.id}`}
            className="p-1.5 rounded-lg text-slate-600 hover:text-blue-600 hover:bg-white transition-colors"
            title="Ask Questions about this policy"
          >
            <MessageSquare className="w-4 h-4" />
          </Link>
          <Link
            to={`/compare/${policy.id}`}
            className="p-1.5 rounded-lg text-slate-600 hover:text-blue-600 hover:bg-white transition-colors"
            title="Compare with previous policy"
          >
            <Scale className="w-4 h-4" />
          </Link>
          <Link
            to={`/sentiment/${policy.id}`}
            className="p-1.5 rounded-lg text-slate-600 hover:text-blue-600 hover:bg-white transition-colors"
            title="Public sentiment & vote"
          >
            <BarChart3 className="w-4 h-4" />
          </Link>
        </div>

        <Link
          to={`/policies/${policy.id}`}
          className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 group-hover:text-blue-700 hover:underline"
        >
          <span>Understand Policy</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  );
};
