export interface Question {
    id: string;
    title: string;
    description: string;
    category: string;
    complexity: Complexity;
}

export enum Complexity {
    easy = 1,
    medium,
    hard
}
