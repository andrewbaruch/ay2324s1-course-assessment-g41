import { QuestionComplexity } from "@/@types/models/question";
import MatchingService from "@/services/matching";

export const useMatching = () => {
  const sendMatchingRequest = (user: String, complexity: QuestionComplexity): Promise<void> => {
    return MatchingService.setUpPairCoding(complexity);
  };

  const getMatchingStatus = (user: String) => {
    return MatchingService.getMatchingStatus();
  };

  return {
    sendMatchingRequest,
    getMatchingStatus,
  };
};