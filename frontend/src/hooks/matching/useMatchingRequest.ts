import { QuestionComplexity } from "@/@types/models/question";
import { User } from "@/@types/user";
import MatchingService from "@/services/matching";
import { use } from "react";

export const useMatching = () => {
  const sendMatchingRequest = (complexity: QuestionComplexity): Promise<void> => {
    return MatchingService.setUpPairCoding(complexity);
  };

  const getMatchingStatus = () => {
    return MatchingService.getMatchingStatus();
  };

  return {
    sendMatchingRequest,
    getMatchingStatus,
  };
};
