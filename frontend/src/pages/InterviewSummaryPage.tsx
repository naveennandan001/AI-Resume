import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { InterviewSummary } from '../types';
import { 
  Award, CheckCircle2, AlertTriangle, ArrowRight, 
  Sparkles, RefreshCw, Target, CheckSquare
} from 'lucide-react';
import { NextStepBanner } from '../components/common/NextStepBanner';

export const InterviewSummaryPage: React.FC = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const [summary, setSummary] = useState<InterviewSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await api.post(`/interviews/${sessionId}/finish`);
        setSummary(res.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    if (sessionId) fetchSummary();
  }, [sessionId]);

  const handlePracticeWeakAreas = async () => {
    try {
      const res = await api.post('/interviews', {
        interview_type: 'Behavioral',
        difficulty: 'Intermediate',
        num_questions: 3
      });
      navigate(`/interviews/session/${res.data.id}`);
    } catch (e) {
      console.error(e);
    }
  };

  if (loading || !summary) {
    return (
      <div className="p-8 text-center text-slate-400">
        <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        <p className="text-sm font-medium">Generating comprehensive interview evaluation summary...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Award className="w-6 h-6 text-emerald-400" />
          Mock Interview Performance Summary
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Detailed session breakdown evaluating response relevance, technical accuracy, and STAR method structure.
        </p>
      </div>

      {/* Main Score Banner */}
      <div className="p-6 rounded-2xl glass-card border border-emerald-500/30 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white text-3xl font-black shadow-xl shadow-emerald-500/20 shrink-0">
            {summary.overall_score}
          </div>
          <div>
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Overall Session Score</span>
            <h2 className="text-xl font-bold text-white mt-0.5">Interview Performance Breakdown</h2>
            <p className="text-xs text-slate-300 mt-1">
              Next Focus: <strong>{summary.next_interview_focus}</strong>
            </p>
          </div>
        </div>

        {/* Practice Weak Areas CTA */}
        <button
          onClick={handlePracticeWeakAreas}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold text-xs hover:brightness-110 shadow-lg shadow-emerald-500/25 transition-all flex items-center gap-2 shrink-0"
        >
          <Sparkles className="w-4 h-4" />
          <span>Practice Weak Areas</span>
        </button>
      </div>

      {/* Metric Breakdown Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        {Object.entries(summary.category_scores).map(([cat, score], i) => (
          <div key={i} className="p-4 rounded-xl glass-card border border-slate-800 text-center">
            <span className="text-[11px] text-slate-400 font-medium capitalize block truncate">{cat.replace('_', ' ')}</span>
            <span className="text-xl font-bold text-white mt-1 block">{score}/100</span>
            <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden mt-2">
              <div className="bg-emerald-400 h-full rounded-full" style={{ width: `${score}%` }}></div>
            </div>
          </div>
        ))}
      </div>

      {/* Strengths & Weaknesses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top Strengths */}
        <div className="p-6 rounded-2xl glass-card border border-emerald-500/30">
          <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            Top Key Strengths
          </h3>
          <ul className="space-y-2 text-xs text-slate-300">
            {summary.top_strengths.map((str, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">•</span>
                <span>{str}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Biggest Weaknesses */}
        <div className="p-6 rounded-2xl glass-card border border-amber-500/30">
          <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            Biggest Areas for Growth
          </h3>
          <ul className="space-y-2 text-xs text-slate-300">
            {summary.biggest_weaknesses.map((wk, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-amber-400 font-bold">•</span>
                <span>{wk}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Questions Struggled & Recommended Practice */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl glass-card border border-slate-800">
          <h3 className="text-sm font-bold text-white mb-3">Questions You Struggled With:</h3>
          <ul className="space-y-2 text-xs text-slate-300">
            {summary.struggled_questions.map((q, i) => (
              <li key={i} className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">• {q}</li>
            ))}
          </ul>
        </div>

        <div className="p-6 rounded-2xl glass-card border border-slate-800">
          <h3 className="text-sm font-bold text-white mb-3">Recommended Practice Focus:</h3>
          <ul className="space-y-2 text-xs text-slate-300">
            {summary.recommended_practice_areas.map((rec, i) => (
              <li key={i} className="p-2.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-300">• {rec}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Next Step Banner */}
      <NextStepBanner
        title="View Personalized Career Improvement Plan"
        subtitle="Follow a week-by-week structured roadmap to close technical & interview gaps."
        buttonText="View Improvement Plan"
        to="/improvement-plan"
      />
    </div>
  );
};
