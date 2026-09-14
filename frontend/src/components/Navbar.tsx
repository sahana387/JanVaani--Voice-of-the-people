import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  Building2, MessageSquare, Map, Scale, BarChart3, 
  FileText, Bell, Shield, Languages, UserCheck, Menu, X, Sparkles
} from 'lucide-react';
import { Language } from '../i18n/translations';

export const Navbar: React.FC = () => {
  const { language, setLanguage, t, userRole, setUserRole } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: t.navHome || t.appName, path: '/', icon: Building2 },
    { name: t.navPolicies || 'Policies', path: '/policies', icon: FileText },
    { name: t.navForYou || t.forYou, path: '/for-you', icon: Sparkles },
    { name: t.navAskJanVaani || 'Ask JanVaani', path: '/chat', icon: MessageSquare },
    { name: t.navMap || 'Map', path: '/map', icon: Map },
    { name: t.navCompare || 'Compare', path: '/compare/1', icon: Scale },
    { name: t.navSentiment || 'Public Sentiment', path: '/sentiment/1', icon: BarChart3 },
    { name: t.navVoting || 'Quadratic Voting', path: '/quadratic-voting', icon: UserCheck },
    { name: t.navAlerts || 'Alerts', path: '/alerts', icon: Bell },
  ];

  const languages: { code: Language; label: string }[] = [
    { code: 'en', label: 'English' },
    { code: 'hi', label: 'हिंदी' },
    { code: 'kn', label: 'ಕನ್ನಡ' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      {/* Top Civic Banner */}
      <div className="bg-gradient-to-r from-india-navy via-slate-900 to-india-navy text-white text-xs py-1 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-medium tracking-wide">
              {t.topBannerText}
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-slate-300">
            <span>{t.topBannerGazette}</span>
            <span className="text-slate-500">|</span>
            <span>{t.topBannerRti}</span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-india-saffron via-amber-500 to-india-navy flex items-center justify-center text-white shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform">
              <span className="text-xl font-black tracking-tight">JV</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-bold tracking-tight text-slate-900">
                  {t.appName}
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 font-semibold border border-blue-200 uppercase">
                  {t.govAi}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                {t.tagline}
              </p>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden xl:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 font-bold border border-blue-200/60'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-blue-700' : 'text-slate-500'}`} />
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Right Controls: Language Selector, Role Switcher, Admin Link */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Language Dropdown */}
            <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200">
              <Languages className="w-3.5 h-3.5 text-slate-500 ml-1 mr-1" />
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                  className={`px-2 py-1 rounded text-xs font-medium transition-all ${
                    language === lang.code
                      ? 'bg-white text-slate-900 shadow-sm font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>

            {/* Role Switcher */}
            <button
              onClick={() => setUserRole(userRole === 'citizen' ? 'admin' : 'citizen')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                userRole === 'admin'
                  ? 'bg-amber-50 border-amber-300 text-amber-900'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
              title="Toggle role for prototype testing"
            >
              <Shield className={`w-3.5 h-3.5 ${userRole === 'admin' ? 'text-amber-600' : 'text-slate-500'}`} />
              {userRole === 'admin' ? t.adminMode : t.citizenView}
            </button>

            {/* Admin Link if Admin */}
            {userRole === 'admin' && (
              <Link
                to="/admin"
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors shadow-sm"
              >
                {t.dashboard}
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="xl:hidden flex items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2">
          <div className="grid grid-cols-2 gap-2 pb-3 border-b border-slate-100">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 p-2 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-100"
                >
                  <Icon className="w-4 h-4 text-blue-600" />
                  {link.name}
                </Link>
              );
            })}
          </div>
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-1">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                  className={`px-2.5 py-1 rounded text-xs font-medium ${
                    language === lang.code ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>
            <button
              onClick={() => setUserRole(userRole === 'citizen' ? 'admin' : 'citizen')}
              className="text-xs px-3 py-1 rounded border border-slate-300 font-medium"
            >
              {userRole === 'admin' ? t.switchToCitizen : t.switchToAdmin}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
