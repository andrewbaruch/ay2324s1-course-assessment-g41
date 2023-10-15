import { QuestionComplexity } from "./models/question";
import { Topic } from "./topic";

export interface User {
  id: string;
  email?: string;
  image?: string | null;
  name?: string | null;
  preferred_language?: string | null;
  preferred_difficulty?: string | null;
  preferred_topics?: Topic[] | null;
}

export type UserRequest = Partial<User>;
export type UserResponse = User;

export type AvatarData = File & { preview: string };

export interface AvatarFormValues {
  avatar?: AvatarData;
}

export type EditProfileFormValues = UserRequest & AvatarFormValues;
