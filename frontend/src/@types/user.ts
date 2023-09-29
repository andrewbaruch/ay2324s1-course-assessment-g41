import { QuestionComplexity, 
    QuestionAdvancedCategories, 
    QuestionIntermediateCategories, 
    QuestionBasicCategories } from './models/question';


export interface User {
  userId: string;
  createdAt: string;
  updatedAt: string;
  // karwi: why set null ?
  name?: string | null;
  hasProfilePicture?: boolean | null;
  profilePictureUrl?: string | null;
  bio?: string | null;
  // karwi: nested
  preferredDifficulty?: QuestionComplexity | null;
  // karwi: change to category type
  preferredTopics?: string[] | null;
}

export type UserRequest = Partial<User>;
export type UserResponse = User;

export type AvatarData = File & { preview: string };

export interface AvatarFormValues {
  avatar?: AvatarData;
}

export type EditProfileFormValues = UserRequest & AvatarFormValues;
