import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import api from '../services/api';
import { Video, Sparkles, Sliders, Play, Shield } from 'lucide-react';

export const InterviewSetupPage: React.FC = () => {
  const { activeResume, activeJob } = useApp();
  const [interviewType, setInterviewType] = useState('Technical');
  const [difficulty, setDifficulty] = useState('Intermediate');
  const [numQuestions, setNumQuestions] = useState(5);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const types = ['Technical', 'HR', 'Behavioral', 'Project-based', 'Mixed'];
  const difficulties = ['Beginner', 'Intermediate', 'Advanced'];

  const handleStartInterview = async () => {
    setLoading(true);
    try {
      const res = await api.post('/interviews', {
        resume_id: activeResume?.id,
        job_description_id: activeJob?.id,
        interview_type: interviewType,
        difficulty: difficulty,
        num_questions: numQuestions
      });
      navigate(`/interviews/session/${res.data.id}`);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      {/* Header */}
      <div className="text-center">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white mx-auto shadow-lg shadow-emerald-500/20 mb-3">
          <Video className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-bold text-white">AI Personalized Mock Interview Setup</h1>
        <p className="text-sm text-slate-400 mt-1">
          Configure your mock interview session tailored to your uploaded resume and target job profile.
        </p>
      </div>

      <div className="p-8 rounded-2xl glass-card border border-slate-800 space-y-6">
        {/* Active Context Card */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs text-slate-300 gap-2">
          <div>
            <span>Resume: <strong className="text-white">{activeResume ? activeResume.filename : 'Demo Candidate Resume'}</strong></span>
          </div>
          <div>
            <span>Target Job: <strong className="text-white">{activeJob ? activeJob.title : 'Software Engineer'}</strong></span>
          </div>
        </div>

        {/* Interview Type Selector */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-2">Select Interview Focus:</label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {types.map((t) => (
              <button
                key={t}
                onClick={() => setInterviewType(t)}
                className={`py-2.5 px-3 rounded-xl text-xs font-semibold transition-all ${
                  interviewType === t
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/20'
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Difficulty Level */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-2">Select Difficulty Level:</label>
          <div className="grid grid-cols-3 gap-3">
            {difficulties.map((d) => (
              <button
                key={d}
                onClick={() => setDifficulty(d)}
                className={`py-2.5 px-4 rounded-xl text-xs font-semibold transition-all ${
                  difficulty === d
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        {/* Number of Questions */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-2">Number of Questions:</label>
          <div className="flex items-center gap-3">
            {[3, 5, 8].map((n) => (
              <button
                key={n}
                onClick={() => setNumQuestions(n)}
                className={`px-5 py-2 rounded-xl text-xs font-semibold transition-all ${
                  numQuestions === n
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-900 border border-slate-800 text-slate-400'
                }`}
              >
                {n} Questions
              </button>
            ))}
          </div>
        </div>

        {/* Start Button */}
        <button
          onClick={handleStartInterview}
          disabled={loading}
          className="w-full py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold text-base hover:brightness-110 shadow-xl shadow-emerald-500/25 transition-all flex items-center justify-center gap-2"
        >
          <Play className="w-5 h-5 fill-current" />
          <span>{loading ? 'Generating Interview Room...' : 'Start Personalized Mock Interview'}</span>
        </button>
      </div>
    </div>
  );
};
