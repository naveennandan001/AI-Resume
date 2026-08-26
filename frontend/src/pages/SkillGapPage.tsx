import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  Compass, CheckCircle2, AlertCircle, XCircle, 
  BookOpen, Code, ArrowRight, Sparkles, Shield
} from 'lucide-react';
import { NextStepBanner } from '../components/common/NextStepBanner';

export const SkillGapPage: React.FC = () => {
  const { activeJob } = useApp();
  const navigate = useNavigate();

  const mockGaps = [
    {
      skill: 'Docker & Containerization',
      why_it_matters: 'The job posting explicitly emphasizes containerizing microservices for reproducible local testing and deployment.',
      priority: 'High',
      learning_resources: ['Docker Docs Starter Guide', 'Container Deployment Best Practices'],
      suggested_mini_project: 'Write a multi-stage Dockerfile for a FastAPI backend and React frontend managed with docker-compose.'
    },
    {
      skill: 'AWS Cloud Services (EC2 & S3)',
      why_it_matters: 'Essential for deploying cloud infrastructure specified in the target role requirements.',
      priority: 'High',
      learning_resources: ['AWS Cloud Practitioner Fundamentals', 'Deploying Python Web APIs to AWS'],
      suggested_mini_project: 'Deploy your containerized web application to an AWS EC2 instance behind an Nginx reverse proxy.'
    },
    {
      skill: 'Kubernetes Microservices',
      why_it_matters: 'Listed as a preferred qualification for scalable microservices orchestration.',
      priority: 'Medium',
      learning_resources: ['Kubernetes Basics', 'Minikube Local Architecture'],
      suggested_mini_project: 'Deploy containerized web services onto a local Minikube cluster with basic ingress routing.'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Compass className="w-6 h-6 text-indigo-400" />
          Skill Gap Analysis & Roadmap
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Detailed breakdown of skills you possess, skills requiring refinement, and missing competencies with actionable learning resources.
        </p>
      </div>

      {/* Target Job Info Card */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs text-slate-300">
        <div>
          <span>Target Job: <strong className="text-white">{activeJob ? activeJob.title : 'Software Engineer (Full-Stack)'}</strong></span>
          <span className="ml-4 text-slate-500">|</span>
          <span className="ml-4">Company: <strong className="text-white">{activeJob ? activeJob.company : 'TechCorp Solutions'}</strong></span>
        </div>
      </div>

      {/* Summary Skill Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Skills You Have */}
        <div className="p-6 rounded-2xl glass-card border border-emerald-500/30">
          <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            Skills You Already Have
          </h3>
          <div className="space-y-2 text-xs text-slate-300">
            {['Python', 'SQL', 'React', 'Git', 'FastAPI'].map((s, i) => (
              <div key={i} className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 font-medium">
                ✓ {s}
              </div>
            ))}
          </div>
        </div>

        {/* Skills Needing Improvement */}
        <div className="p-6 rounded-2xl glass-card border border-amber-500/30">
          <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-400" />
            Skills Needing Improvement
          </h3>
          <div className="space-y-2 text-xs text-slate-300">
            {['REST API Performance', 'Database Indexing'].map((s, i) => (
              <div key={i} className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 font-medium">
                ! {s}
              </div>
            ))}
          </div>
        </div>

        {/* Missing Job Skills */}
        <div className="p-6 rounded-2xl glass-card border border-red-500/30">
          <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
            <XCircle className="w-4 h-4 text-red-400" />
            Missing Job Skills
          </h3>
          <div className="space-y-2 text-xs text-slate-300">
            {['Docker', 'AWS EC2 / S3', 'Kubernetes'].map((s, i) => (
              <div key={i} className="p-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-300 font-medium">
                ✕ {s}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detailed Skill Gap Cards */}
      <div>
        <h2 className="text-lg font-bold text-white mb-4">Detailed Skill Action Plans</h2>
        <div className="space-y-4">
          {mockGaps.map((gap, idx) => (
            <div key={idx} className="p-6 rounded-2xl glass-card border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-base font-bold text-white">{gap.skill}</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    gap.priority === 'High' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  }`}>
                    {gap.priority} Priority
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                <strong>Why it matters:</strong> {gap.why_it_matters}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {/* Resources */}
                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="font-semibold text-blue-400 flex items-center gap-1.5 mb-2">
                    <BookOpen className="w-3.5 h-3.5" />
                    Suggested Learning Categories
                  </span>
                  <ul className="space-y-1 text-slate-300">
                    {gap.learning_resources.map((res, i) => (
                      <li key={i}>• {res}</li>
                    ))}
                  </ul>
                </div>

                {/* Mini Project */}
                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="font-semibold text-indigo-400 flex items-center gap-1.5 mb-2">
                    <Code className="w-3.5 h-3.5" />
                    Recommended Mini-Project
                  </span>
                  <p className="text-slate-300 leading-relaxed">{gap.suggested_mini_project}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Next Step Banner */}
      <NextStepBanner
        title="Tailor Your Resume for This Target Job"
        subtitle="Align summary, reorder skill chips, and optimize bullet keywords."
        buttonText="Tailor Resume"
        to="/jobs/tailor"
      />
    </div>
  );
};
