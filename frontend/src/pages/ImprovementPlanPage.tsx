import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { ImprovementPlan } from '../types';
import { 
  CheckSquare, Calendar, Sparkles, CheckCircle2, ArrowRight, ShieldCheck
} from 'lucide-react';
import { NextStepBanner } from '../components/common/NextStepBanner';

export const ImprovementPlanPage: React.FC = () => {
  const [plan, setPlan] = useState<ImprovementPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const res = await api.get('/improvement-plan');
        setPlan(res.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchPlan();
  }, []);

  if (loading || !plan) {
    return (
      <div className="p-8 text-center text-slate-400">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        <p className="text-sm font-medium">Generating your personalized week-by-week career improvement plan...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <CheckSquare className="w-6 h-6 text-blue-400" />
          Personalized Career Improvement Plan
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          A structured week-by-week action plan synthesized from your resume quality, job match gaps, and interview performance.
        </p>
      </div>

      {/* Target Overall Readiness Banner */}
      <div className="p-6 rounded-2xl glass-card border border-blue-500/30 flex items-center justify-between">
        <div>
          <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">Career Readiness Milestone</span>
          <h2 className="text-xl font-bold text-white mt-0.5">3-Week Action Roadmap</h2>
          <p className="text-xs text-slate-300 mt-1">Execute high-priority tasks to reach peak job readiness.</p>
        </div>
        <div className="text-right">
          <span className="text-3xl font-black text-emerald-400">{plan.overall_readiness_score}</span>
          <span className="text-xs text-slate-500 block">Current Target Score</span>
        </div>
      </div>

      {/* Weekly Plan Cards */}
      <div className="space-y-6">
        {plan.weekly_plans.map((wp) => (
          <div key={wp.week} className="p-6 rounded-2xl glass-card border border-slate-800 space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 font-bold flex items-center justify-center">
                W{wp.week}
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Week {wp.week}: {wp.title}</h3>
                <span className="text-[11px] text-slate-400">Target Action Items</span>
              </div>
            </div>

            <div className="space-y-3">
              {wp.tasks.map((t, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-slate-200 font-medium">{t.task}</p>
                      <span className="text-[10px] text-slate-400 mt-0.5 block">Category: {t.category}</span>
                    </div>
                  </div>

                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider shrink-0 ${
                    t.priority === 'High' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                    t.priority === 'Medium' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                    'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                  }`}>
                    {t.priority} Priority
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Next Step Banner */}
      <NextStepBanner
        title="Conduct Another Mock Interview to Test Your Growth"
        subtitle="Validate your progress and track score improvements across sessions."
        buttonText="Retake Interview"
        to="/interviews"
      />
    </div>
  );
};
