export interface Question {
    id: string;
    title: string;
    description: string;
    topic: string;
    subtopic: string;
    difficulty: Difficulty;
}

export enum Difficulty {
    EASY = 1,
    MEDIUM,
    HARD
}
