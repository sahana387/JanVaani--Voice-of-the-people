import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ShieldCheck, BookOpen, FileCheck, Landmark, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  const { t } = useApp();

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 pt-12 pb-8 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-slate-800">
          {/* Col 1: Brand & Purpose */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-india-saffron flex items-center justify-center text-white font-bold text-sm">
                JV
              </div>
              <span className="text-lg font-bold text-white tracking-tight">JANVAANI</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              AI-powered civic policy and municipal transparency platform connecting citizens with official government decisions through grounded intelligence.
            </p>
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>Grounded Evidence AI Architecture</span>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">
              Citizen Modules
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><Link to="/policies" className="hover:text-white transition-colors">Browse Municipal Policies</Link></li>
              <li><Link to="/chat" className="hover:text-white transition-colors">Ask JanVaani (RAG Q&A)</Link></li>
              <li><Link to="/map" className="hover:text-white transition-colors">Interactive Ward GIS Map</Link></li>
              <li><Link to="/for-you" className="hover:text-white transition-colors">Personalized Impact Feed</Link></li>
              <li><Link to="/quadratic-voting" className="hover:text-white transition-colors">Quadratic Voting Arena</Link></li>
            </ul>
          </div>

          {/* Col 3: Civic Tools */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">
              Civic Participation
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><Link to="/compare/1" className="hover:text-white transition-colors">Old vs New Policy Comparison</Link></li>
              <li><Link to="/sentiment/1" className="hover:text-white transition-colors">Aggregated Public Sentiment</Link></li>
              <li><Link to="/citizen-response" className="hover:text-white transition-colors">Citizen Response Draft Assistant</Link></li>
              <li><Link to="/report/1" className="hover:text-white transition-colors">Citizen Impact Reports</Link></li>
              <li><Link to="/alerts" className="hover:text-white transition-colors">Public Consultation Deadlines</Link></li>
            </ul>
          </div>

          {/* Col 4: Official Compliance & Legal Disclaimer */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">
              Authoritative Disclaimer
            </h4>
            <div className="p-3 rounded-lg bg-slate-800/80 border border-slate-700/60 text-[11px] text-slate-400 space-y-2">
              <p className="flex items-start gap-1.5">
                <Landmark className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  Official government gazettes, municipal by-laws, and council notifications remain the legal authority.
                </span>
              </p>
              <p>
                JanVaani AI does not present unsupported claims as government facts. All key conclusions are grounded in retrieved source documents with page citations.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500 gap-4">
          <p>© 2026 JANVAANI — Voice of the People. Built for Civic Transparency & Democratic Empowerment.</p>
          <div className="flex items-center gap-4">
            <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-400 text-[11px]">
              Demo / Synthetic Municipal Pilot
            </span>
            <span className="hover:text-slate-300">Open Data Standard</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
