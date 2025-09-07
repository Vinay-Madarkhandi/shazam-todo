export interface Day {
  id: string;
  dayNumber: number;
  title: string;
  description: string;
  mathContent?: string;
  codeContent?: string;
  isCompleted: boolean;
  remarks?: string;
  completedAt?: Date;
}

export interface Week {
  id: string;
  weekNumber: number;
  title: string;
  description: string;
  days: Day[];
  isCompleted: boolean;
  progress: number; // percentage of days completed
}

export interface Phase {
  id: string;
  phaseNumber: number;
  title: string;
  description: string;
  goal: string;
  weeks: Week[];
  isCompleted: boolean;
  progress: number; // percentage of weeks completed
}

export interface ProgressData {
  phases: Phase[];
  totalDays: number;
  completedDays: number;
  overallProgress: number;
}
