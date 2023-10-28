import { QuestionComplexity } from "@/@types/models/question";
import authorizedAxios from "@/utils/axios/authorizedAxios";

class MatchingService {
  static async setUpPairCoding(questionComplexity: QuestionComplexity) {
    try {
      const data = { questionComplexity };
      await authorizedAxios.post("/matching/user", data);
    } catch (error) {
      console.error("Error while sending matching request:", error);
    }
  }

  static async getMatchingStatus() {
    try {
      const response = await authorizedAxios.get(`/matching/user/status`);
      return response.data;
    } catch (error) {
      console.error("Error while sending matching request:", error);
    }
  }
}

export default MatchingService;
