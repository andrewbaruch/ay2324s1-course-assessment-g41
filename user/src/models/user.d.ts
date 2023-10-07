export interface User {
    id: string;
    email: string;
    image: string;
    name?: string;
    preferred_language?: string;
    preferred_difficult?: string;
    preferred_topics: string[];
}

export default User;