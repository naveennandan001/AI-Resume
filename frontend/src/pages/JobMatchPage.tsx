import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import api from '../services/api';
import { JobMatch, JobDescription } from '../types';
import { 
  Target, Sparkles, CheckCircle2, AlertCircle, XCircle, 
  ArrowRight, Compass, Building2, Briefcase, Info
} from 'lucide-react';
import { NextStepBanner } from '../components/common/NextStepBanner';

export const JobMatchPage: React.FC = () => {
  const { activeResume, setActiveJob } = useApp();
  const [title, setTitle] = useState('Software Engineer (Full-Stack)');
  const [company, setCompany] = useState('TechCorp Solutions');
  const [description, setDescription] = useState(
    `TechCorp Solutions is seeking a Full-Stack Software Engineer.
Requirements:
- Strong proficiency in Python, JavaScript/TypeScript, and React.
- Solid understanding of SQL and relational database design.
- Hands-on experience with Docker containerization and AWS cloud services.
- Excellent communication skills.`
  );
  const [loading, setLoading] = useState(false);
  const [matchResult, setMatchResult] = useState<JobMatch | null>(null);
  const navigate = useNavigate();

  const handleMatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeResume) {
      alert("Please upload or select a resume first!");
      navigate('/resumes');
      return;
    }

    setLoading(true);
    try {
      // 1. Create job entry
      const jobRes = await api.post('/jobs', { title, company, description });
      const createdJob: JobDescription = jobRes.data;
      setActiveJob(createdJob);

      // 2. Perform match
      const matchRes = await api.post(`/jobs/${createdJob.id}/match`, null, {
        params: { resume_id: activeResume.id }
      });
      setMatchResult(matchRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Target className="w-6 h-6 text-cyan-400" />
          Job Description Input & Resume Match Engine
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Paste a target job posting to analyze skill alignment, extract required qualifications, and generate your compatibility match score.
        </p>
      </div>

      {/* Input Form */}
      <div className="p-6 rounded-2xl glass-card border border-slate-800">
        <form onSubmit={handleMatch} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Target Job Title</label>
              <div className="relative">
                <Briefcase className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Full-Stack Engineer"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Company Name</label>
              <div className="relative">
                <Building2 className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="TechCorp Solutions"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Paste Job Description</label>
            <textarea
              rows={6}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Paste full job posting responsibilities and requirements..."
              className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-slate-400">
              Active Resume: <strong className="text-white">{activeResume ? activeResume.filename : 'Demo Candidate Resume'}</strong>
            </span>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold text-xs hover:brightness-110 disabled:opacity-50 transition-all flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>{loading ? 'Comparing Skills...' : 'Calculate Job Match'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Match Results Display */}
      {matchResult && (
        <div className="space-y-6">
          {/* Main Match Banner */}
          <div className="p-6 rounded-2xl glass-card border border-cyan-500/30 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white text-3xl font-black shadow-xl shadow-cyan-500/20 shrink-0">
                {matchResult.match_score}%
              </div>
              <div>
                <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">Job Compatibility Estimate</span>
                <h2 className="text-xl font-bold text-white mt-0.5">Resume & Job Fit Breakdown</h2>
                <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-1">
                  <Info className="w-3.5 h-3.5 text-blue-400" />
                  <span>This AI score is a compatibility estimate and does not guarantee job placement.</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => navigate('/jobs/skill-gap')}
              className="px-5 py-2.5 rounded-xl bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-semibold hover:bg-cyan-500/30 transition-all flex items-center gap-2 shrink-0"
            >
              <span>View Skill Gaps</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Category Scores Breakdown */}
          <div className="grid grid-cols-2 lg:grid-cols-6 gap-3">
            {Object.entries(matchResult.category_scores).map(([label, score], i) => (
              <div key={i} className="p-4 rounded-xl glass-card border border-slate-800 text-center">
                <span className="text-[11px] text-slate-400 font-medium capitalize block truncate">{label.replace('_', ' ')}</span>
                <span className="text-xl font-bold text-white mt-1 block">{score}%</span>
                <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden mt-2">
                  <div className="bg-cyan-400 h-full rounded-full" style={{ width: `${score}%` }}></div>
                </div>
              </div>
            ))}
          </div>

          {/* Skills Breakdown Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Strong Match */}
            <div className="p-6 rounded-2xl glass-card border border-emerald-500/30">
              <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Strong Match ({matchResult.strong_matches.length})
              </h3>
              <div className="flex flex-wrap gap-2">
                {matchResult.strong_matches.map((sk, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-medium">
                    ✓ {sk}
                  </span>
                ))}
              </div>
            </div>

            {/* Partial Match */}
            <div className="p-6 rounded-2xl glass-card border border-amber-500/30">
              <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-400" />
                Partial Match ({matchResult.partial_matches.length})
              </h3>
              <div className="flex flex-wrap gap-2">
                {matchResult.partial_matches.map((sk, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-medium">
                    ! {sk}
                  </span>
                ))}
              </div>
            </div>

            {/* Missing Skills */}
            <div className="p-6 rounded-2xl glass-card border border-red-500/30">
              <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                <XCircle className="w-4 h-4 text-red-400" />
                Missing Job Skills ({matchResult.missing_skills.length})
              </h3>
              <div className="flex flex-wrap gap-2">
                {matchResult.missing_skills.map((sk, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-lg bg-red-500/10 border border-red-500/20 text-red-300 text-xs font-medium">
                    ✕ {sk}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Next Step Banner */}
          <NextStepBanner
            title="Inspect Skill Gap Analysis & Actionable Resources"
            subtitle="Understand why missing skills matter and get suggested mini-projects."
            buttonText="Skill Gap Analysis"
            to="/jobs/skill-gap"
          />
        </div>
      )}
    </div>
  );
};
