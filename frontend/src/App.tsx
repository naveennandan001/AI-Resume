import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppProvider } from './context/AppContext';

import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { MainLayout } from './components/layout/MainLayout';

import { DashboardPage } from './pages/DashboardPage';
import { ResumeUploadPage } from './pages/ResumeUploadPage';
import { ResumeImprovementPage } from './pages/ResumeImprovementPage';
import { JobMatchPage } from './pages/JobMatchPage';
import { SkillGapPage } from './pages/SkillGapPage';
import { ResumeTailorPage } from './pages/ResumeTailorPage';
import { InterviewSetupPage } from './pages/InterviewSetupPage';
import { MockInterviewPage } from './pages/MockInterviewPage';
import { InterviewSummaryPage } from './pages/InterviewSummaryPage';
import { ImprovementPlanPage } from './pages/ImprovementPlanPage';
import { ProgressPage } from './pages/ProgressPage';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppProvider>
        <Router>
          <Routes>
            {/* Public Pages */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Protected App Routes */}
            <Route
              element={
                <ProtectedRoute>
                  <MainLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/resumes" element={<ResumeUploadPage />} />
              <Route path="/resumes/improve" element={<ResumeImprovementPage />} />
              <Route path="/jobs" element={<JobMatchPage />} />
              <Route path="/jobs/skill-gap" element={<SkillGapPage />} />
              <Route path="/jobs/tailor" element={<ResumeTailorPage />} />
              <Route path="/interviews" element={<InterviewSetupPage />} />
              <Route path="/interviews/session/:sessionId" element={<MockInterviewPage />} />
              <Route path="/interviews/summary/:sessionId" element={<InterviewSummaryPage />} />
              <Route path="/improvement-plan" element={<ImprovementPlanPage />} />
              <Route path="/progress" element={<ProgressPage />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AppProvider>
    </AuthProvider>
  );
};

export default App;
