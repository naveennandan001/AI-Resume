import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Sparkles, FileSearch, Target, Compass, Wand2, Video, 
  CheckCircle2, ArrowRight, Shield, Zap, TrendingUp, Award
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, demoLogin } = useAuth();

  const handleStartAssessment = () => {
    if (user) {
      navigate('/resumes');
    } else {
      demoLogin().then(() => navigate('/resumes'));
    }
  };

  const handleTryDemo = () => {
    demoLogin().then(() => navigate('/dashboard'));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans overflow-x-hidden">
      {/* Top Header */}
      <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
            <Sparkles className="w-6 h-6" />
          </div>
          <span className="font-extrabold text-xl text-white tracking-tight">CareerAI</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleTryDemo}
            className="px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 text-sm font-semibold hover:bg-slate-700 transition-all flex items-center gap-2"
          >
            <Zap className="w-4 h-4 text-cyan-400" />
            <span>Try Demo</span>
          </button>
          <button
            onClick={() => navigate(user ? '/dashboard' : '/login')}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-sm font-semibold hover:brightness-110 shadow-lg shadow-blue-500/25 transition-all"
          >
            {user ? 'Go to Dashboard' : 'Sign In'}
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative px-6 py-20 md:py-28 max-w-6xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-6">
          <Sparkles className="w-4 h-4" />
          <span>The Next-Gen Career Readiness Platform</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight max-w-4xl mx-auto">
          AI-Powered Resume & <span className="gradient-text">Interview Coach</span>
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
          Turn your resume into a career strategy. Match your profile to real jobs, practice personalized AI mock interviews, and know exactly what skills to improve.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={handleStartAssessment}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold text-base hover:brightness-110 shadow-xl shadow-blue-500/30 transition-all flex items-center justify-center gap-2"
          >
            <span>Start Career Assessment</span>
            <ArrowRight className="w-5 h-5" />
          </button>
          <button
            onClick={handleTryDemo}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 font-bold text-base hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
          >
            <Sparkles className="w-5 h-5 text-cyan-400" />
            <span>Try Demo Mode</span>
          </button>
        </div>

        {/* Central Core Vision Banner */}
        <div className="mt-14 p-6 rounded-2xl glass-card border border-blue-500/30 max-w-3xl mx-auto text-center shadow-2xl">
          <p className="text-sm font-semibold uppercase tracking-wider text-cyan-400">Core Mission</p>
          <p className="text-lg font-bold text-white mt-1 italic">
            “Understand the candidate. Understand the job. Identify the gap. Coach the candidate to close the gap.”
          </p>
        </div>
      </section>

      {/* Feature Cards Grid */}
      <section className="px-6 py-16 bg-slate-900/40 border-y border-slate-800/80">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white">Everything You Need to Land Your Target Role</h2>
            <p className="text-slate-400 mt-2">Comprehensive AI tools tailored specifically to your profile.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: FileSearch, title: 'AI Resume Analysis', desc: 'Detailed score breakdown across structure, experience, quantifiable metrics, and keywords.' },
              { icon: Target, title: 'Job Match Score', desc: 'Compare your resume against any job description and obtain an instant match percentage.' },
              { icon: Compass, title: 'Skill Gap Detection', desc: 'Identify missing technical & soft skills with prioritized learning resources and mini-projects.' },
              { icon: Wand2, title: 'AI Resume Improvement', desc: 'Get smart bullet point recommendations without fabricating fake metrics or experience.' },
              { icon: Video, title: 'Personalized Mock Interviews', desc: 'Practice role-specific interview questions with interactive voice or text answer modes.' },
              { icon: Shield, title: 'Interview Feedback & STAR', desc: 'Receive question-by-question scoring and STAR method structure checks.' },
              { icon: TrendingUp, title: 'Progress Tracking', desc: 'Track your communication, technical knowledge, and readiness score growth over time.' }
            ].map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div key={idx} className="p-6 rounded-2xl glass-card glass-card-hover border border-slate-800">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">{feat.title}</h3>
                  <p className="text-sm text-slate-400 mt-2 leading-relaxed">{feat.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works (4 Steps) */}
      <section className="px-6 py-20 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-white">How It Works</h2>
          <p className="text-slate-400 mt-2">4 simple steps to continuous career improvement</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { step: '01', title: 'Upload Resume', desc: 'Upload PDF, DOCX, or TXT resume to instantly extract structured sections.' },
            { step: '02', title: 'Match a Job', desc: 'Paste target job description to compute compatibility score & skill gaps.' },
            { step: '03', title: 'Practice Interview', desc: 'Answer AI-generated technical & behavioral questions via text or voice.' },
            { step: '04', title: 'Improve & Apply', desc: 'Follow your personalized week-by-week improvement plan and land the job.' }
          ].map((item, i) => (
            <div key={i} className="relative p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
              <span className="text-4xl font-extrabold text-blue-500/30">{item.step}</span>
              <h3 className="text-lg font-bold text-white mt-2">{item.title}</h3>
              <p className="text-sm text-slate-400 mt-2">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Statistics / Value Proposition */}
      <section className="px-6 py-16 bg-gradient-to-r from-blue-950/40 via-slate-900 to-indigo-950/40 border-t border-slate-800">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <p className="text-3xl font-extrabold text-blue-400">AI-Powered</p>
            <p className="text-xs text-slate-400 mt-1 uppercase font-semibold">Structured Analysis</p>
          </div>
          <div>
            <p className="text-3xl font-extrabold text-cyan-400">Personalized</p>
            <p className="text-xs text-slate-400 mt-1 uppercase font-semibold">Question Generation</p>
          </div>
          <div>
            <p className="text-3xl font-extrabold text-indigo-400">Job-Specific</p>
            <p className="text-xs text-slate-400 mt-1 uppercase font-semibold">Skill Gap Detection</p>
          </div>
          <div>
            <p className="text-3xl font-extrabold text-emerald-400">Continuous</p>
            <p className="text-xs text-slate-400 mt-1 uppercase font-semibold">Progress Tracking</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-8 px-6 text-center text-xs text-slate-500">
        <p>© 2026 AI-Powered Resume & Interview Coach. Hackathon Production Build.</p>
      </footer>
    </div>
  );
};
