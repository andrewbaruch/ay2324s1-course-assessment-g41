export enum QuestionComplexity {
  EASY = 'Easy',
  MEDIUM = 'Medium',
  HARD = 'Hard',
}

export interface Question {
  title: string;
  id: number;
  description: string;
  categories: string[];
  complexity: QuestionComplexity;
}