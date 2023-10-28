import axios from "axios";

import { QuestionComplexity } from "@/@types/models/question";
import { User } from "@/@types/user";
import authorizedAxios from "@/utils/axios/authorizedAxios";

class MatchingService {
  static async setUpPairCoding(user: String, questionComplexity: QuestionComplexity) {
    try {
      const data = { questionComplexity };
      await authorizedAxios.post("/matching/user", data);
    } catch (error) {
      console.error("Error while sending matching request:", error);
    }
  }

  static async getMatchingStatus(id: String) {
    try {
      const response = await axios.get(`/matching/status/${id}`);
      console.log("in get status frontend");
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error("Error while sending matching request:", error);
    }
  }
}

export default MatchingService;
