import { QuestionComplexity } from "./models/question";

export interface Topic {
  id: string;
  name: string;
  slug: string;
  description: string;
}

export type TopicRequest = Partial<Topic>;
export type TopicResponse = Topic;
