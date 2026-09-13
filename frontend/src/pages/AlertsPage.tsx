import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { AlertNotification } from '../types';
import { 
  Bell, Calendar, Clock, AlertTriangle, CheckCircle2, 
  Building2, ArrowRight, ShieldCheck, Filter
} from 'lucide-react';

export const AlertsPage: React.FC = () => {
  const [alerts, setAlerts] = useState<AlertNotification[]>([]);
  const [filterType, setFilterType] = useState<string>('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAlerts = async () => {
      setLoading(true);
      try {
        const data = await api.getAlerts(filterType !== 'All' ? { alert_type: filterType } : {});
        setAlerts(data.alerts || []);
      } catch (err) {
        console.error("Failed to load alerts", err);
      } finally {
        setLoading(false);
      }
    };
    loadAlerts();
  }, [filterType]);

  const getAlertBadge = (type: string) => {
    switch (type) {
      case 'deadline':
        return { bg: 'bg-rose-50 text-rose-800 border-rose-200', label: 'Consultation Deadline', icon: AlertTriangle };
      case 'council_meeting':
        return { bg: 'bg-amber-50 text-amber-800 border-amber-200', label: 'Ward Committee Meeting', icon: Calendar };
      case 'new_policy':
        return { bg: 'bg-blue-50 text-blue-800 border-blue-200', label: 'New Policy Enacted', icon: CheckCircle2 };
      default:
        return { bg: 'bg-slate-50 text-slate-700 border-slate-200', label: 'Civic Notice', icon: Bell };
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-200 text-xs font-semibold border border-blue-400/30">
          <Bell className="w-3.5 h-3.5 text-amber-400" />
          <span>Real-time Municipal Notifications</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Civic Policy Monitoring & Alerts
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
          Track upcoming public consultation deadlines, ward committee deliberations, and newly notified gazettes across Bengaluru.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 pb-2">
        {['All', 'deadline', 'council_meeting', 'new_policy'].map((t) => (
          <button
            key={t}
            onClick={() => setFilterType(t)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filterType === t
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {t === 'All' ? 'All Alerts' :
             t === 'deadline' ? 'Consultation Deadlines' :
             t === 'council_meeting' ? 'Council Meetings' : 'New Policies'}
          </button>
        ))}
      </div>

      {/* Alerts Feed */}
      <div className="space-y-4">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-500">
            <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            Fetching live municipal notices...
          </div>
        ) : alerts.length === 0 ? (
          <div className="p-12 bg-white rounded-3xl border text-center text-xs text-slate-500">
            No active alerts in this category.
          </div>
        ) : (
          alerts.map((alert) => {
            const badge = getAlertBadge(alert.alert_type);
            const BadgeIcon = badge.icon;

            return (
              <div
                key={alert.id}
                className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-blue-300 transition-colors"
              >
                <div className="space-y-2 max-w-xl">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${badge.bg}`}>
                      <BadgeIcon className="w-3 h-3" />
                      {badge.label}
                    </span>
                    <span className="text-[11px] font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
                      {alert.category}
                    </span>
                    {alert.event_date && (
                      <span className="text-[11px] text-slate-500 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        Date: <strong>{alert.event_date}</strong>
                      </span>
                    )}
                  </div>

                  <h3 className="text-sm font-bold text-slate-900">
                    {alert.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {alert.message}
                  </p>
                </div>

                {alert.policy_id && (
                  <div className="shrink-0 flex items-center gap-2">
                    <Link
                      to={`/citizen-response?policy_id=${alert.policy_id}`}
                      className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors"
                    >
                      Draft Response
                    </Link>
                    <Link
                      to={`/policies/${alert.policy_id}`}
                      className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors shadow-sm"
                    >
                      View Policy
                    </Link>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
