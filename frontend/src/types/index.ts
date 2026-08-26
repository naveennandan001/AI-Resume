export interface User {
  id: string;
  name: string;
  email: string;
  created_at: string;
}

export interface CategoryScore {
  score: number;
  explanation: string;
  problems: string[];
  suggestions: string[];
}

export interface ResumeAnalysis {
  overall_score: number;
  categories: Record<string, CategoryScore>;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  detected_issues: string[];
}

export interface Resume {
  id: string;
  filename: string;
  raw_text: string;
  structured_data?: {
    name?: string;
    email?: string;
    skills?: string[];
    experience?: any[];
    education?: any[];
    projects?: any[];
  };
  created_at: string;
  analysis?: ResumeAnalysis;
}

export interface SkillGapItem {
  skill: string;
  why_it_matters: string;
  priority: 'High' | 'Medium' | 'Low';
  learning_resources: string[];
  suggested_mini_project: string;
}

export interface JobMatch {
  id: string;
  resume_id: string;
  job_description_id: string;
  match_score: number;
  category_scores: Record<string, number>;
  strong_matches: string[];
  partial_matches: string[];
  missing_skills: string[];
  skill_gaps: SkillGapItem[];
  created_at: string;
}

export interface JobDescription {
  id: string;
  title: string;
  company: string;
  description: string;
  created_at: string;
}

export interface SectionImprovement {
  section_name: string;
  original_text: string;
  improved_text: string;
  why_better: string[];
  suggested_metrics_to_add: string[];
}

export interface TailoredSuggestions {
  tailored_summary: string;
  skills_reordering: string[];
  improved_bullets: { original: string; tailored: string }[];
  recommended_keywords: string[];
  note: string;
}

export interface InterviewQuestion {
  id: string;
  question_text: string;
  question_type: string;
  sequence: number;
}

export interface StarBreakdown {
  situation: 'Present' | 'Weak' | 'Missing';
  task: 'Present' | 'Weak' | 'Missing';
  action: 'Present' | 'Weak' | 'Missing';
  result: 'Present' | 'Weak' | 'Missing';
}

export interface InterviewFeedback {
  id: string;
  answer_id: string;
  relevance: number;
  accuracy: number;
  clarity: number;
  structure: number;
  completeness: number;
  overall_answer_score: number;
  what_did_well: string[];
  needs_improvement: string[];
  star_breakdown?: StarBreakdown;
  better_answer_structure: string;
  suggested_model_answer: string;
}

export interface InterviewSession {
  id: string;
  interview_type: string;
  difficulty: string;
  overall_score: number;
  status: 'in_progress' | 'completed';
  questions: InterviewQuestion[];
  created_at: string;
}

export interface InterviewSummary {
  session_id: string;
  overall_score: number;
  category_scores: Record<string, number>;
  top_strengths: string[];
  biggest_weaknesses: string[];
  struggled_questions: string[];
  recommended_practice_areas: string[];
  next_interview_focus: string;
}

export interface ImprovementPlanTask {
  task: string;
  category: string;
  priority: 'High' | 'Medium' | 'Low';
}

export interface WeeklyPlan {
  week: number;
  title: string;
  tasks: ImprovementPlanTask[];
}

export interface ImprovementPlan {
  id: string;
  user_id: string;
  overall_readiness_score: number;
  weekly_plans: WeeklyPlan[];
  created_at: string;
}

export interface ActivityItem {
  id: string;
  type: 'resume_analysis' | 'job_match' | 'interview';
  title: string;
  score: number;
  timestamp: string;
}

export interface DashboardData {
  user_name: string;
  readiness_score: number;
  score_breakdown: Record<string, number>;
  recent_activities: ActivityItem[];
  top_recommendations: string[];
  has_resume: boolean;
  has_job_match: boolean;
  has_interview: boolean;
}

export interface ProgressHistoryPoint {
  date: string;
  resume_score: number;
  job_match_score: number;
  interview_score: number;
  communication: number;
  technical_knowledge: number;
  structure: number;
}

export interface ProgressData {
  history: ProgressHistoryPoint[];
  insight: string;
  total_interviews: number;
  total_matches: number;
}
