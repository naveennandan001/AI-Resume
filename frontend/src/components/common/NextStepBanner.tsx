import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface NextStepBannerProps {
  title: string;
  subtitle: string;
  buttonText: string;
  to: string;
}

export const NextStepBanner: React.FC<NextStepBannerProps> = ({
  title,
  subtitle,
  buttonText,
  to
}) => {
  const navigate = useNavigate();

  return (
    <div className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-blue-900/40 via-indigo-900/30 to-slate-900 border border-blue-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
      <div className="flex items-start gap-3">
        <div className="p-2.5 rounded-xl bg-blue-500/20 text-blue-400 mt-1 border border-blue-500/30 shrink-0">
          <Sparkles className="w-5 h-5" />
        </div>
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-blue-400">Recommended Next Action</span>
          <h3 className="text-lg font-bold text-white mt-0.5">{title}</h3>
          <p className="text-sm text-slate-300">{subtitle}</p>
        </div>
      </div>

      <button
        onClick={() => navigate(to)}
        className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold text-sm hover:brightness-110 shadow-lg shadow-blue-500/25 transition-all flex items-center gap-2 shrink-0"
      >
        <span>{buttonText}</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
};
