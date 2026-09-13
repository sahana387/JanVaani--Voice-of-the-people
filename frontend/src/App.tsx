import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

// Pages
import { HomePage } from './pages/HomePage';
import { PoliciesPage } from './pages/PoliciesPage';
import { PolicyDetailPage } from './pages/PolicyDetailPage';
import { AskJanVaaniPage } from './pages/AskJanVaaniPage';
import { PolicyComparePage } from './pages/PolicyComparePage';
import { CivicMapPage } from './pages/CivicMapPage';
import { PersonalizedForYouPage } from './pages/PersonalizedForYouPage';
import { PublicSentimentPage } from './pages/PublicSentimentPage';
import { QuadraticVotingPage } from './pages/QuadraticVotingPage';
import { CitizenResponsePage } from './pages/CitizenResponsePage';
import { ImpactReportPage } from './pages/ImpactReportPage';
import { AlertsPage } from './pages/AlertsPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';

export function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-blue-600 selection:text-white">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/policies" element={<PoliciesPage />} />
              <Route path="/policies/:id" element={<PolicyDetailPage />} />
              <Route path="/chat" element={<AskJanVaaniPage />} />
              <Route path="/compare" element={<PolicyComparePage />} />
              <Route path="/compare/:id" element={<PolicyComparePage />} />
              <Route path="/map" element={<CivicMapPage />} />
              <Route path="/for-you" element={<PersonalizedForYouPage />} />
              <Route path="/sentiment" element={<PublicSentimentPage />} />
              <Route path="/sentiment/:id" element={<PublicSentimentPage />} />
              <Route path="/quadratic-voting" element={<QuadraticVotingPage />} />
              <Route path="/citizen-response" element={<CitizenResponsePage />} />
              <Route path="/report/:id" element={<ImpactReportPage />} />
              <Route path="/alerts" element={<AlertsPage />} />
              <Route path="/admin" element={<AdminDashboardPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
