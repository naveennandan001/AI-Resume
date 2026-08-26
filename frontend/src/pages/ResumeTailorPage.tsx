import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import api from '../services/api';
import { TailoredSuggestions } from '../types';
import { 
  Wand2, Sparkles, ArrowRight, ShieldCheck, CheckCircle2, Copy
} from 'lucide-react';
import { NextStepBanner } from '../components/common/NextStepBanner';

export const ResumeTailorPage: React.FC = () => {
  const { activeResume, activeJob } = useApp();
  const [loading, setLoading] = useState(false);
  const [tailored, setTailored] = useState<TailoredSuggestions | null>(null);
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  const handleTailor = async () => {
    if (!activeResume || !activeJob) {
      alert("Please ensure both a resume and target job description are active.");
      return;
    }
    setLoading(true);
    try {
      const res = await api.post(`/jobs/${activeJob.id}/tailor`, {
        resume_id: activeResume.id,
        job_description_id: activeJob.id
      });
      setTailored(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!tailored) return;
    navigator.clipboard.writeText(tailored.tailored_summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Wand2 className="w-6 h-6 text-cyan-400" />
          Job-Specific Resume Tailoring
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Optimize summary phrasing, skill keyword ordering, and bullet alignment specifically for your target job description.
        </p>
      </div>

      {/* Target Alignment Summary */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs text-slate-300">
        <div>
          <span>Active Resume: <strong className="text-white">{activeResume ? activeResume.filename : 'Demo Resume'}</strong></span>
          <span className="mx-3 text-slate-500">|</span>
          <span>Target Job: <strong className="text-white">{activeJob ? activeJob.title : 'Software Engineer'}</strong></span>
        </div>

        <button
          onClick={handleTailor}
          disabled={loading}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-semibold hover:brightness-110 disabled:opacity-50 transition-all flex items-center gap-1.5"
        >
          <Sparkles className="w-4 h-4" />
          <span>{loading ? 'Tailoring Resume...' : 'Tailor Resume for This Job'}</span>
        </button>
      </div>

      {/* Visible Mandatory Note */}
      <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
          <span><strong>Note:</strong> AI suggestions should be reviewed before submission. We never fabricate experience.</span>
        </div>
      </div>

      {/* Tailored Results Output */}
      {tailored && (
        <div className="space-y-6">
          {/* Tailored Summary */}
          <div className="p-6 rounded-2xl glass-card border border-cyan-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                Tailored Professional Summary
              </h3>
              <button
                onClick={handleCopy}
                className="px-3 py-1 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 text-[11px] hover:text-white flex items-center gap-1"
              >
                <Copy className="w-3 h-3" />
                <span>{copied ? 'Copied!' : 'Copy Summary'}</span>
              </button>
            </div>
            <p className="text-sm text-slate-200 leading-relaxed bg-slate-950 p-4 rounded-xl border border-slate-800">
              "{tailored.tailored_summary}"
            </p>
          </div>

          {/* Recommended Keyword & Skill Ordering Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Skills Ordering */}
            <div className="p-6 rounded-2xl glass-card border border-slate-800">
              <h3 className="text-sm font-bold text-white mb-3">Recommended Skill Section Order</h3>
              <p className="text-xs text-slate-400 mb-3">Order skills to place job-required technologies first:</p>
              <div className="flex flex-wrap gap-2">
                {tailored.skills_reordering.map((sk, i) => (
                  <span key={i} className="px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 text-cyan-300 text-xs font-medium">
                    {i + 1}. {sk}
                  </span>
                ))}
              </div>
            </div>

            {/* Keyword Optimization */}
            <div className="p-6 rounded-2xl glass-card border border-slate-800">
              <h3 className="text-sm font-bold text-white mb-3">High-Priority Keywords to Highlight</h3>
              <p className="text-xs text-slate-400 mb-3">Integrate these natural keywords into your project descriptions:</p>
              <div className="flex flex-wrap gap-2">
                {tailored.recommended_keywords.map((kw, i) => (
                  <span key={i} className="px-3 py-1 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-semibold">
                    + {kw}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Improved Bullets */}
          <div className="p-6 rounded-2xl glass-card border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white">Tailored Project & Bullet Point Recommendations</h3>
            <div className="space-y-3">
              {tailored.improved_bullets.map((b, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2 text-xs">
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase">Original:</span>
                    <p className="text-slate-400 font-normal">{b.original}</p>
                  </div>
                  <div className="pt-2 border-t border-slate-800/60">
                    <span className="text-[10px] font-bold text-cyan-400 uppercase">Job Tailored:</span>
                    <p className="text-white font-medium">{b.tailored}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Next Step Banner */}
          <NextStepBanner
            title="Start Personalized AI Mock Interview"
            subtitle="Practice AI questions generated specifically from your resume and target job requirements."
            buttonText="Start Mock Interview"
            to="/interviews"
          />
        </div>
      )}
    </div>
  );
};
