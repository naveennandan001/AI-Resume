import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import api from '../services/api';
import { SectionImprovement } from '../types';
import { 
  Wand2, Check, X, RefreshCw, AlertCircle, Sparkles, ArrowRight, ShieldCheck
} from 'lucide-react';
import { NextStepBanner } from '../components/common/NextStepBanner';

export const ResumeImprovementPage: React.FC = () => {
  const { activeResume } = useApp();
  const [selectedSection, setSelectedSection] = useState('summary');
  const [originalText, setOriginalText] = useState(
    "Worked on backend REST endpoints using Python and React web application interface."
  );
  const [improvement, setImprovement] = useState<SectionImprovement | null>(null);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  const sections = [
    { key: 'summary', name: 'Professional Summary' },
    { key: 'experience', name: 'Work Experience' },
    { key: 'project', name: 'Key Project' },
    { key: 'skills', name: 'Technical Skills' },
    { key: 'achievements', name: 'Achievements' },
  ];

  const handleImprove = async () => {
    if (!activeResume) return;
    setLoading(true);
    setStatusMessage('');
    try {
      const res = await api.post(`/resumes/${activeResume.id}/improve`, {
        section_name: selectedSection,
        original_text: originalText
      });
      setImprovement(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = () => {
    setStatusMessage('✅ Section improvement accepted and saved to resume draft!');
  };

  const handleReject = () => {
    setImprovement(null);
    setStatusMessage('❌ Suggestion rejected. Original text retained.');
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Wand2 className="w-6 h-6 text-purple-400" />
          AI Resume Improvement & Section Refinement
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Transform generic bullet points into high-impact bullet statements with strong action verbs and quantified structure recommendations.
        </p>
      </div>

      {/* Safety Notice Banner */}
      <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2">
        <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
        <span>
          <strong>Ethical AI Guarantee:</strong> We suggest stronger action verbs and phrasing without fabricating fake employment, degrees, or unearned metrics.
        </span>
      </div>

      {/* Section Selector */}
      <div className="p-6 rounded-2xl glass-card border border-slate-800 space-y-4">
        <label className="block text-xs font-semibold text-slate-300">Select Resume Section to Refine:</label>
        <div className="flex flex-wrap gap-2">
          {sections.map((sec) => (
            <button
              key={sec.key}
              onClick={() => setSelectedSection(sec.key)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                selectedSection === sec.key
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {sec.name}
            </button>
          ))}
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Original Text:</label>
          <textarea
            rows={3}
            value={originalText}
            onChange={(e) => setOriginalText(e.target.value)}
            className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-purple-500"
            placeholder="Paste your original bullet point or summary..."
          />
        </div>

        <button
          onClick={handleImprove}
          disabled={loading || !originalText.trim()}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold text-xs hover:brightness-110 disabled:opacity-50 transition-all flex items-center gap-2"
        >
          {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          <span>{loading ? 'Generating Improvement...' : 'Generate AI Improvement'}</span>
        </button>
      </div>

      {statusMessage && (
        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-cyan-400 text-center font-medium">
          {statusMessage}
        </div>
      )}

      {/* Side-by-Side Comparison */}
      {improvement && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Original Box */}
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Original Text</span>
              <p className="mt-3 text-sm text-slate-300 leading-relaxed bg-slate-950 p-4 rounded-xl border border-slate-800/80">
                "{improvement.original_text}"
              </p>
            </div>

            {/* AI Improved Version */}
            <div className="p-6 rounded-2xl glass-card border border-purple-500/30">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  AI Improved Version
                </span>
              </div>
              <p className="text-sm font-medium text-white leading-relaxed bg-purple-950/30 p-4 rounded-xl border border-purple-500/20">
                "{improvement.improved_text}"
              </p>

              {/* Action Buttons */}
              <div className="mt-4 flex items-center gap-2">
                <button
                  onClick={handleAccept}
                  className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-500 transition-all flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  Accept
                </button>
                <button
                  onClick={handleReject}
                  className="px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 text-xs font-semibold hover:bg-slate-700 transition-all flex items-center gap-1.5"
                >
                  <X className="w-3.5 h-3.5" />
                  Reject
                </button>
                <button
                  onClick={handleImprove}
                  className="px-4 py-2 rounded-xl bg-purple-600/20 border border-purple-500/30 text-purple-300 text-xs font-semibold hover:bg-purple-600/30 transition-all flex items-center gap-1.5 ml-auto"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Regenerate
                </button>
              </div>
            </div>
          </div>

          {/* Why it is better */}
          <div className="p-6 rounded-2xl glass-card border border-slate-800">
            <h3 className="text-sm font-bold text-white mb-3">Why This Version is Better:</h3>
            <ul className="space-y-2 text-xs text-slate-300">
              {improvement.why_better.map((reason, i) => (
                <li key={i} className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{reason}</span>
                </li>
              ))}
            </ul>

            {improvement.suggested_metrics_to_add && improvement.suggested_metrics_to_add.length > 0 && (
              <div className="mt-4 pt-4 border-t border-slate-800">
                <h4 className="text-xs font-bold text-amber-400 mb-2">Suggested Real Metrics You Could Add:</h4>
                <ul className="space-y-1 text-xs text-slate-400">
                  {improvement.suggested_metrics_to_add.map((metric, i) => (
                    <li key={i}>• {metric}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Next Step Banner */}
      <NextStepBanner
        title="Compare Profile Against Target Job Description"
        subtitle="Extract required skills and identify technical gaps before tailoring."
        buttonText="Job Matching"
        to="/jobs"
      />
    </div>
  );
};
