import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useApp } from '../context/AppContext';
import { Resume, ResumeAnalysis } from '../types';
import { 
  Upload, FileText, CheckCircle2, AlertTriangle, Sparkles, 
  ArrowRight, Wand2, ShieldAlert, FileSearch, RefreshCw
} from 'lucide-react';
import { NextStepBanner } from '../components/common/NextStepBanner';

export const ResumeUploadPage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [selectedResume, setSelectedResume] = useState<Resume | null>(null);
  const [error, setError] = useState('');
  const { setActiveResume } = useApp();
  const navigate = useNavigate();

  const fetchResumes = async () => {
    try {
      const res = await api.get('/resumes');
      setResumes(res.data);
      if (res.data.length > 0 && !selectedResume) {
        setSelectedResume(res.data[0]);
        setActiveResume(res.data[0]);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchResumes();
  }, []);

  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    setUploading(true);
    setError('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await api.post('/resumes/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const newResume = res.data;
      setSelectedResume(newResume);
      setActiveResume(newResume);
      await fetchResumes();
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const analysis: ResumeAnalysis | undefined = selectedResume?.analysis;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <FileSearch className="w-6 h-6 text-blue-400" />
          AI Resume Upload & Analysis
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Upload your resume in PDF, DOCX, or TXT format to receive instant section parsing and quality evaluation.
        </p>
      </div>

      {/* Upload Zone */}
      <div className="p-6 rounded-2xl glass-card border border-slate-800">
        <form onSubmit={handleFileUpload} className="space-y-4">
          <div className="border-2 border-dashed border-slate-700 hover:border-blue-500 rounded-xl p-8 text-center transition-colors bg-slate-950/40">
            <Upload className="w-10 h-10 text-slate-400 mx-auto mb-3" />
            <p className="text-sm font-semibold text-white">Drag and drop your resume file here</p>
            <p className="text-xs text-slate-400 mt-1">Supports PDF, DOCX, TXT (Up to 10MB)</p>

            <input
              type="file"
              accept=".pdf,.docx,.doc,.txt"
              onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
              className="hidden"
              id="resume-file-input"
            />
            <label
              htmlFor="resume-file-input"
              className="mt-4 inline-block px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold hover:bg-slate-700 cursor-pointer"
            >
              Browse Files
            </label>

            {file && (
              <p className="mt-3 text-xs text-cyan-400 font-medium">Selected: {file.name}</p>
            )}
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs text-center">
              {error}
            </div>
          )}

          <div className="flex items-center justify-between">
            {resumes.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Select Resume:</span>
                <select
                  value={selectedResume?.id || ''}
                  onChange={(e) => {
                    const r = resumes.find(x => x.id === e.target.value);
                    if (r) {
                      setSelectedResume(r);
                      setActiveResume(r);
                    }
                  }}
                  className="bg-slate-900 border border-slate-700 text-white text-xs rounded-lg px-3 py-1.5 focus:outline-none"
                >
                  {resumes.map(r => (
                    <option key={r.id} value={r.id}>{r.filename}</option>
                  ))}
                </select>
              </div>
            )}

            <button
              type="submit"
              disabled={!file || uploading}
              className="ml-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold text-xs hover:brightness-110 disabled:opacity-50 transition-all flex items-center gap-2"
            >
              {uploading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              <span>{uploading ? 'Extracting & Analyzing...' : 'Analyze Resume'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Analysis Results Display */}
      {selectedResume && analysis && (
        <div className="space-y-6">
          {/* Main Score Banner */}
          <div className="p-6 rounded-2xl glass-card border border-blue-500/30 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center text-white text-3xl font-black shadow-xl shadow-blue-500/20 shrink-0">
                {analysis.overall_score}
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Overall Resume Score</span>
                <h2 className="text-xl font-bold text-white mt-0.5">Resume Quality Breakdown</h2>
                <p className="text-xs text-slate-300 mt-1">
                  Evaluated across structure, content impact, bullet clarity, and ATS keyword presence.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => navigate('/resumes/improve')}
                className="px-4 py-2 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-400 text-xs font-semibold hover:bg-blue-600/30 transition-all flex items-center gap-1.5"
              >
                <Wand2 className="w-3.5 h-3.5" />
                <span>Improve Sections</span>
              </button>
            </div>
          </div>

          {/* Category Scores Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(analysis.categories).map(([catKey, val]) => (
              <div key={catKey} className="p-5 rounded-xl glass-card border border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-200 capitalize">{catKey}</span>
                  <span className="text-xs font-bold text-cyan-400">{val.score}/10</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mb-3">
                  <div
                    className="bg-blue-500 h-full rounded-full"
                    style={{ width: `${val.score * 10}%` }}
                  ></div>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed mb-2">{val.explanation}</p>

                {val.problems && val.problems.length > 0 && (
                  <div className="mt-2 text-[10px] text-amber-400 font-medium bg-amber-500/10 p-1.5 rounded border border-amber-500/20">
                    ⚠️ {val.problems[0]}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Weakness Detection & Recommendations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Strengths & Recommendations */}
            <div className="p-6 rounded-2xl glass-card border border-slate-800">
              <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Key Strengths & Suggestions
              </h3>
              <ul className="space-y-2 text-xs text-slate-300">
                {analysis.strengths.map((str, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">•</span>
                    <span>{str}</span>
                  </li>
                ))}
              </ul>

              <h4 className="text-xs font-bold text-slate-400 mt-4 mb-2">Top Actionable Recommendations:</h4>
              <ul className="space-y-2 text-xs text-slate-300">
                {analysis.recommendations.map((rec, i) => (
                  <li key={i} className="flex items-start gap-2 bg-blue-500/10 p-2 rounded-lg border border-blue-500/20">
                    <Sparkles className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Detected Issues */}
            <div className="p-6 rounded-2xl glass-card border border-slate-800">
              <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-400" />
                Detected Weaknesses & Formatting Issues
              </h3>
              <div className="space-y-2">
                {analysis.detected_issues.map((iss, i) => (
                  <div key={i} className="p-3 rounded-xl bg-slate-900/80 border border-amber-500/20 text-xs text-slate-300 flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-amber-300">{iss}</span>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Consider strengthening bullet points with action verbs and quantifiable results before job submission.
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Next Step Banner */}
          <NextStepBanner
            title="Match Resume Against Target Job Description"
            subtitle="Compare your parsed resume skills with real job requirements to compute match score."
            buttonText="Match a Job"
            to="/jobs"
          />
        </div>
      )}
    </div>
  );
};
