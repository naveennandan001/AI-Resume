import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { speechService } from '../services/audio';
import { InterviewSession, InterviewFeedback } from '../types';
import { 
  Mic, MicOff, Send, Clock, Video, Bot, User, Sparkles, 
  CheckCircle2, ArrowRight, RefreshCw, AlertCircle, Award
} from 'lucide-react';

export const MockInterviewPage: React.FC = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();

  const [session, setSession] = useState<InterviewSession | null>(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answerMode, setAnswerMode] = useState<'text' | 'voice'>('text');
  const [answerText, setAnswerText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingError, setRecordingError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<InterviewFeedback | null>(null);
  const [timerSeconds, setTimerSeconds] = useState(0);

  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => setTimerSeconds(prev => prev + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const loadSession = async () => {
    try {
      const res = await api.get(`/interviews/${sessionId}`);
      setSession(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (sessionId) loadSession();
  }, [sessionId]);

  const handleStartVoice = () => {
    setRecordingError('');
    setIsRecording(true);
    speechService.startListening(
      (transcript, isFinal) => {
        setAnswerText(prev => (prev ? prev + ' ' : '') + transcript);
      },
      (errorMsg) => {
        setRecordingError(errorMsg);
        setIsRecording(false);
      },
      () => {
        setIsRecording(false);
      }
    );
  };

  const handleStopVoice = () => {
    speechService.stopListening();
    setIsRecording(false);
  };

  const handleSubmitAnswer = async () => {
    if (!session || !answerText.trim()) return;
    setSubmitting(true);
    setFeedback(null);
    const currentQ = session.questions[currentIdx];

    try {
      const res = await api.post(`/interviews/${session.id}/answer`, {
        question_id: currentQ.id,
        answer_text: answerText
      });
      setFeedback(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  const handleNextQuestion = () => {
    if (!session) return;
    setFeedback(null);
    setAnswerText('');
    if (currentIdx + 1 < session.questions.length) {
      setCurrentIdx(prev => prev + 1);
    } else {
      handleFinishInterview();
    }
  };

  const handleFinishInterview = async () => {
    if (!session) return;
    try {
      await api.post(`/interviews/${session.id}/finish`);
      navigate(`/interviews/summary/${session.id}`);
    } catch (e) {
      console.error(e);
    }
  };

  if (!session) {
    return (
      <div className="p-8 text-center text-slate-400">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        <p className="text-sm font-medium">Entering interactive AI mock interview room...</p>
      </div>
    );
  }

  const currentQ = session.questions[currentIdx];
  const formatTime = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="space-y-6">
      {/* Room Header Bar */}
      <div className="p-4 rounded-2xl glass-card border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <Video className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <span>{session.interview_type} Interview</span>
              <span className="px-2 py-0.5 rounded-md bg-slate-800 text-[10px] text-slate-400 border border-slate-700">
                {session.difficulty}
              </span>
            </h2>
            <p className="text-[11px] text-slate-400">Adaptive AI Evaluation Room</p>
          </div>
        </div>

        <div className="flex items-center gap-6 text-xs text-slate-300">
          <div className="flex items-center gap-1.5 font-mono">
            <Clock className="w-4 h-4 text-cyan-400" />
            <span>{formatTime(timerSeconds)}</span>
          </div>
          <div className="font-semibold text-emerald-400">
            Question {currentIdx + 1} of {session.questions.length}
          </div>
        </div>
      </div>

      {/* Main Split Grid: AI Interviewer Left vs Candidate Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: AI Interviewer Avatar & Prompt */}
        <div className="lg:col-span-5 p-6 rounded-2xl glass-card border border-slate-800 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center text-white shadow-lg shadow-blue-500/20 shrink-0">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">AI Executive Interviewer</h3>
                <p className="text-[11px] text-cyan-400 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  Active & Listening
                </p>
              </div>
            </div>

            {/* Question Box */}
            <div className="p-5 rounded-2xl bg-slate-950/80 border border-blue-500/30 text-white space-y-2 shadow-inner">
              <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">
                {currentQ.question_type} Question #{currentQ.sequence}
              </span>
              <p className="text-base font-medium leading-relaxed text-slate-100">
                "{currentQ.question_text}"
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800/80 text-[11px] text-slate-400">
            💡 <strong>Coaching Tip:</strong> Use the STAR method (Situation, Task, Action, Result) to structure behavioral and technical responses effectively.
          </div>
        </div>

        {/* Right Column: Candidate Workspace */}
        <div className="lg:col-span-7 p-6 rounded-2xl glass-card border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <User className="w-4 h-4 text-emerald-400" />
              Candidate Answer Workspace
            </h3>

            {/* Mode Switcher */}
            <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
              <button
                onClick={() => setAnswerMode('text')}
                className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                  answerMode === 'text' ? 'bg-slate-800 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                Text Input
              </button>
              <button
                onClick={() => setAnswerMode('voice')}
                className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                  answerMode === 'voice' ? 'bg-slate-800 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                Voice Recording
              </button>
            </div>
          </div>

          {/* Voice Mic Controls */}
          {answerMode === 'voice' && (
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={isRecording ? handleStopVoice : handleStartVoice}
                  className={`p-3 rounded-full text-white font-semibold transition-all shadow-lg ${
                    isRecording ? 'bg-red-600 animate-pulse' : 'bg-emerald-600 hover:bg-emerald-500'
                  }`}
                >
                  {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </button>
                <div>
                  <p className="text-xs font-semibold text-white">
                    {isRecording ? 'Microphone Active (Recording...)' : 'Click mic to record your voice'}
                  </p>
                  <p className="text-[10px] text-slate-400">Speech will transcribe directly into the text field below.</p>
                </div>
              </div>
            </div>
          )}

          {recordingError && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
              {recordingError}
            </div>
          )}

          {/* Text Area Answer Input */}
          <div>
            <textarea
              rows={6}
              value={answerText}
              onChange={(e) => setAnswerText(e.target.value)}
              placeholder="Type or speak your answer here..."
              className="w-full p-4 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500 leading-relaxed"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => setAnswerText('')}
              className="text-xs text-slate-400 hover:text-white"
            >
              Clear Text
            </button>

            <button
              onClick={handleSubmitAnswer}
              disabled={submitting || !answerText.trim()}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold text-xs hover:brightness-110 disabled:opacity-50 transition-all flex items-center gap-2"
            >
              {submitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              <span>{submitting ? 'Evaluating Answer...' : 'Submit Answer for AI Evaluation'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Answer Evaluation Feedback Panel */}
      {feedback && (
        <div className="p-6 rounded-2xl glass-card border border-emerald-500/30 space-y-6 animate-fade-in">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xl font-black border border-emerald-500/30">
                {feedback.overall_answer_score}
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Instant AI Feedback & STAR Analysis</h3>
                <p className="text-xs text-slate-400">Answer Evaluation breakdown for Question #{currentQ.sequence}</p>
              </div>
            </div>

            <button
              onClick={handleNextQuestion}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold text-xs hover:brightness-110 transition-all flex items-center gap-2"
            >
              <span>{currentIdx + 1 < session.questions.length ? 'Next Question' : 'Finish Interview'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Metric Scores */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {[
              { label: 'Relevance', score: feedback.relevance },
              { label: 'Accuracy', score: feedback.accuracy },
              { label: 'Clarity', score: feedback.clarity },
              { label: 'Structure', score: feedback.structure },
              { label: 'Completeness', score: feedback.completeness },
            ].map((m, i) => (
              <div key={i} className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">{m.label}</span>
                <span className="text-lg font-bold text-emerald-400 block">{m.score}/10</span>
              </div>
            ))}
          </div>

          {/* STAR Method Indicator Badges */}
          {feedback.star_breakdown && (
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <h4 className="text-xs font-bold text-slate-300 mb-2">STAR Method Checklist:</h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                {Object.entries(feedback.star_breakdown).map(([part, status]) => (
                  <div key={part} className="p-2 rounded-lg bg-slate-900 flex items-center justify-between border border-slate-800">
                    <span className="capitalize font-semibold text-slate-200">{part}:</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      status === 'Present' ? 'bg-emerald-500/20 text-emerald-400' :
                      status === 'Weak' ? 'bg-amber-500/20 text-amber-400' : 'bg-red-500/20 text-red-400'
                    }`}>
                      {status === 'Present' ? '✅ Present' : status === 'Weak' ? '⚠️ Weak' : '❌ Missing'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Strengths & Model Answer */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <h4 className="font-bold text-emerald-400">What You Did Well:</h4>
              <ul className="space-y-1 text-slate-300">
                {feedback.what_did_well.map((item, i) => (
                  <li key={i}>• {item}</li>
                ))}
              </ul>

              <h4 className="font-bold text-amber-400 pt-2">What Needs Improvement:</h4>
              <ul className="space-y-1 text-slate-300">
                {feedback.needs_improvement.map((item, i) => (
                  <li key={i}>• {item}</li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <h4 className="font-bold text-cyan-400">Suggested Model Answer Structure:</h4>
              <p className="text-slate-300 leading-relaxed italic bg-slate-950 p-3 rounded-lg border border-slate-800">
                "{feedback.suggested_model_answer}"
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
