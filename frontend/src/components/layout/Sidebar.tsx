import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, FileText, Target, Video, LineChart, 
  Sparkles, CheckSquare, Wand2, Compass
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'My Resume', path: '/resumes', icon: FileText },
    { name: 'Job Matching', path: '/jobs', icon: Target },
    { name: 'Skill Gap Analysis', path: '/jobs/skill-gap', icon: Compass },
    { name: 'Tailor Resume', path: '/jobs/tailor', icon: Wand2 },
    { name: 'Interview Coach', path: '/interviews', icon: Video },
    { name: 'Progress Tracking', path: '/progress', icon: LineChart },
    { name: 'Improvement Plan', path: '/improvement-plan', icon: CheckSquare },
  ];

  return (
    <aside className="w-64 border-r border-slate-800 bg-slate-900/50 flex flex-col shrink-0 hidden md:flex min-h-[calc(100vh-4rem)]">
      <div className="p-4 flex-1 space-y-1">
        <div className="px-3 py-2 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
          Career Strategy
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-blue-600/15 text-blue-400 border border-blue-500/20 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`
              }
            >
              <Icon className="w-4 h-4" />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </div>

      {/* Quick Demo CTA footer box */}
      <div className="p-4 m-3 rounded-xl bg-gradient-to-b from-slate-800/80 to-slate-900 border border-slate-700/60 text-center">
        <Sparkles className="w-5 h-5 text-cyan-400 mx-auto mb-2" />
        <h4 className="text-xs font-semibold text-white">Hackathon Demo Mode</h4>
        <p className="text-[11px] text-slate-400 mt-1 mb-3">Instant end-to-end evaluation journey pre-loaded.</p>
      </div>
    </aside>
  );
};
