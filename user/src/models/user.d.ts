export interface User {
    id: string;
    email: string;
    image: string;
    name?: string;
    preferred_language?: string;
    preferred_difficulty?: Difficulty;
    preferred_topics: Topic[];
}

export enum Difficulty {
    Easy = 1,
    Medium,
    Hard,
  }

export interface Language {
    id: string;
    name: string;
    slug: string;
    description: string;
}

export interface Topic {
    id: string;
    name: string;
    slug: string;
    description: string;
}

export default User;
