export enum QuestionDifficulty {
  EASY = 'EASY',
  MEDIUM = 'MEDIUM',
  HARD = 'HARD',
}

export interface Question {
  title: string;
  id: number;
  description: string;
  categories: string[];
  complexity: QuestionDifficulty;
}