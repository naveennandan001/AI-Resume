import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { DashboardData } from '../types';
import { 
  Sparkles, FileText, Target, Wand2, Video, LineChart, 
  ArrowRight, Award, CheckCircle2, Clock, Activity, ShieldCheck
} from 'lucide-react';
import { NextStepBanner } from '../components/common/NextStepBanner';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';

export const DashboardPage: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const res = await api.get('/dashboard');
        setData(res.data);
      } catch (e) {
        console.error('Failed to load dashboard', e);
      } finally {
        setLoading(false);
      }
    };
    loadDashboard();
  }, []);

  if (loading || !data) {
    return (
      <div className="p-8 text-center text-slate-400">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        <p className="text-sm font-medium">Loading your career dashboard...</p>
      </div>
    );
  }

  const sampleTrend = [
    { name: 'S1', score: 65 },
    { name: 'S2', score: 71 },
    { name: 'S3', score: 75 },
    { name: 'S4', score: data.readiness_score }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="p-8 rounded-2xl bg-gradient-to-r from-blue-900/60 via-slate-900 to-indigo-900/40 border border-blue-500/20 relative overflow-hidden shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Career Coaching Dashboard</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              Welcome back, <span className="gradient-text">{data.user_name}</span>
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-xl">
              Track your career readiness, practice customized AI interviews, and get actionable suggestions to close skill gaps.
            </p>
          </div>

          {/* Readiness Score Badge */}
          <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 text-center shrink-0 min-w-[200px]">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Career Readiness Score</span>
            <div className="text-4xl font-black text-emerald-400 mt-1">
              {data.readiness_score} <span className="text-lg text-slate-500 font-normal">/ 100</span>
            </div>
            <div className="mt-2 w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-emerald-500 to-cyan-400 h-full rounded-full"
                style={{ width: `${data.readiness_score}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Breakdown Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.entries(data.score_breakdown).map(([label, score], i) => (
          <div key={i} className="p-5 rounded-xl glass-card border border-slate-800">
            <span className="text-xs text-slate-400 font-medium">{label}</span>
            <div className="text-2xl font-bold text-white mt-1 flex items-baseline gap-1">
              <span>{score}</span>
              <span className="text-xs text-slate-500 font-normal">/100</span>
            </div>
            <div className="mt-3 w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-blue-500 h-full rounded-full"
                style={{ width: `${score}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-bold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {[
            { title: 'Analyze Resume', icon: FileText, to: '/resumes', color: 'from-blue-600 to-indigo-600' },
            { title: 'Match a Job', icon: Target, to: '/jobs', color: 'from-cyan-600 to-blue-600' },
            { title: 'Tailor Resume', icon: Wand2, to: '/jobs/tailor', color: 'from-indigo-600 to-purple-600' },
            { title: 'Start Interview', icon: Video, to: '/interviews', color: 'from-emerald-600 to-teal-600' },
            { title: 'View Progress', icon: LineChart, to: '/progress', color: 'from-purple-600 to-pink-600' }
          ].map((act, i) => {
            const Icon = act.icon;
            return (
              <button
                key={i}
                onClick={() => navigate(act.to)}
                className="p-4 rounded-xl glass-card glass-card-hover border border-slate-800 text-left flex flex-col justify-between h-28 group"
              >
                <div className={`w-9 h-9 rounded-lg bg-gradient-to-tr ${act.color} text-white flex items-center justify-center shadow-md`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-white group-hover:text-cyan-400 transition-colors">{act.title}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 transition-colors" />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Split Grid: Recent Activity & Progress Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 p-6 rounded-2xl glass-card border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              Recent Activity
            </h3>
          </div>

          <div className="space-y-3">
            {data.recent_activities.length > 0 ? (
              data.recent_activities.map((act) => (
                <div key={act.id} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
                      {act.type === 'resume_analysis' ? <FileText className="w-4 h-4" /> :
                       act.type === 'job_match' ? <Target className="w-4 h-4" /> : <Video className="w-4 h-4" />}
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-white">{act.title}</h4>
                      <p className="text-[10px] text-slate-400">{new Date(act.timestamp).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold text-emerald-400">{act.score}</span>
                    <span className="text-[10px] text-slate-500 block">Score</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400">No activity logged yet. Upload a resume to start!</p>
            )}
          </div>
        </div>

        {/* Progress Mini Chart */}
        <div className="p-6 rounded-2xl glass-card border border-slate-800 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
              <LineChart className="w-4 h-4 text-indigo-400" />
              Readiness Trajectory
            </h3>
            <p className="text-xs text-slate-400 mb-4">Overall career readiness score improvement over recent sessions.</p>
          </div>

          <div className="h-36 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sampleTrend}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#64748b" fontSize={10} />
                <YAxis domain={[50, 100]} hide />
                <Tooltip contentStyle={{ background: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }} />
                <Area type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorScore)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Next Step Banner */}
      <NextStepBanner
        title="Analyze or Upload Your Resume"
        subtitle="Extract sections and receive an overall AI resume score breakdown."
        buttonText="Analyze Resume"
        to="/resumes"
      />
    </div>
  );
};
