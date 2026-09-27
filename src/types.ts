export interface Resource {
  title: string;
  type: 'course' | 'book' | 'article' | 'video' | 'tool' | 'project' | 'certification';
  url: string;
  priceEst: string;
  isFree: boolean;
  description?: string;
}

export interface Topic {
  id: string;
  name: string;
  description: string;
  estimatedHours: number;
  resources: Resource[];
}

export interface Milestone {
  id: string;
  title: string;
  checklist: string[];
  deliverable: string;
}

export interface RoadmapPhase {
  id: string;
  phaseNumber: number;
  title: string;
  description: string;
  durationWeeks: number;
  topics: Topic[];
  milestones: Milestone[];
}

export interface SkillGapItem {
  skillName: string;
  category: 'technical' | 'soft' | 'domain';
  currentLevel: string; // e.g. "None", "Basic", "Intermediate"
  targetLevel: string;
  gapDescription: string;
  importance: 'high' | 'medium' | 'low';
}

export interface JobSearchPrep {
  resumeAdvice: string[];
  portfolioStrategy: string[];
  networkingActions: string[];
  interviewPrep: string[];
}

export interface WeeklySchedule {
  suggestedRoutine: string;
  dailyBreakdown: {
    weekday: string;
    focus: string;
    hours: number;
  }[];
}

export interface CareerRoadmap {
  id: string;
  createdAt: string;
  currentRole: string;
  targetRole: string;
  yearsExperience: number;
  hoursPerWeek: number;
  learningBudget: number;
  
  title: string;
  summary: string;
  targetRoleOverview: string;
  estimatedTimeMonths: number;
  difficulty: 'Beginner Friendly' | 'Moderate' | 'Challenging' | 'Expert Transition';
  
  skillsGapAnalysis: SkillGapItem[];
  phases: RoadmapPhase[];
  learningBudgetStrategy: string;
  weeklySchedule: WeeklySchedule;
  jobSearchPreparation: JobSearchPrep;
}

export interface UserPreferences {
  currentRole: string;
  targetRole: string;
  yearsExperience: number;
  hoursPerWeek: number;
  learningBudget: number;
}
