import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { ProgressData } from '../types';
import { LineChart, Sparkles, TrendingUp, Award, Zap } from 'lucide-react';
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, Legend 
} from 'recharts';

export const ProgressPage: React.FC = () => {
  const [data, setData] = useState<ProgressData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const res = await api.get('/progress');
        setData(res.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchProgress();
  }, []);

  if (loading || !data) {
    return (
      <div className="p-8 text-center text-slate-400">
        <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        <p className="text-sm font-medium">Loading progress historical analytics...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <LineChart className="w-6 h-6 text-purple-400" />
          Progress Tracking & Performance Analytics
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Historical growth trajectory across resume quality, job matching, communication, and technical depth.
        </p>
      </div>

      {/* Insight Highlight Banner */}
      <div className="p-6 rounded-2xl glass-card border border-purple-500/30 flex items-start gap-4">
        <div className="p-3 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30 shrink-0">
          <TrendingUp className="w-6 h-6" />
        </div>
        <div>
          <span className="text-xs font-semibold text-purple-400 uppercase tracking-wider">AI Growth Insight</span>
          <h2 className="text-lg font-bold text-white mt-0.5">{data.insight}</h2>
          <p className="text-xs text-slate-400 mt-1">
            Based on {data.total_interviews} mock interviews and {data.total_matches} job match calculations stored in your profile.
          </p>
        </div>
      </div>

      {/* Main Overall Growth Chart */}
      <div className="p-6 rounded-2xl glass-card border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-white">Overall Score Progression</h3>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data.history}>
              <defs>
                <linearGradient id="colorInt" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorMatch" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="date" stroke="#64748b" fontSize={11} />
              <YAxis domain={[40, 100]} stroke="#64748b" fontSize={11} />
              <Tooltip contentStyle={{ background: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }} />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Area type="monotone" name="Interview Score" dataKey="interview_score" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorInt)" />
              <Area type="monotone" name="Job Match Score" dataKey="job_match_score" stroke="#06b6d4" strokeWidth={2.5} fillOpacity={1} fill="url(#colorMatch)" />
              <Area type="monotone" name="Resume Score" dataKey="resume_score" stroke="#3b82f6" strokeWidth={2} fillOpacity={0} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Skill Component Trajectory Chart */}
      <div className="p-6 rounded-2xl glass-card border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-white">Skill Breakdown Trajectory (Technical vs Communication vs Structure)</h3>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data.history}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="date" stroke="#64748b" fontSize={11} />
              <YAxis domain={[40, 100]} stroke="#64748b" fontSize={11} />
              <Tooltip contentStyle={{ background: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }} />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Area type="monotone" name="Technical Knowledge" dataKey="technical_knowledge" stroke="#8b5cf6" strokeWidth={2} fillOpacity={0} />
              <Area type="monotone" name="Communication" dataKey="communication" stroke="#f59e0b" strokeWidth={2} fillOpacity={0} />
              <Area type="monotone" name="STAR Structure" dataKey="structure" stroke="#ec4899" strokeWidth={2} fillOpacity={0} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
