export type TrailId =
  | "hybrid-intelligence"
  | "future-of-work"
  | "tech-industry";

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: string;
}

export interface Quest {
  type: string;
  name: string;
  description: string;
  level: number;
  questions: Question[];
}

export interface Trail {
  id: TrailId;
  title: string;
  summary: string;
  quests: Quest[];
}
