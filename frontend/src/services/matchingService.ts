import axios from "axios";

import { QuestionComplexity } from "@/@types/models/question";
import { User } from "@/@types/user";

class MatchingService {
  static async setUpPairCoding(user: String, questionComplexity: QuestionComplexity) {
    try {
      const data = { user, questionComplexity };
      await axios.post("/api/matching", data);
    } catch (error) {
      console.error("Error while sending matching request:", error);
    }
  }

  static async getMatchingStatus(user: String) {
    try {
      const data = { user };
      await axios.post("/matching", data).then((response) => {
        console.log(response);
      });
    } catch (error) {
      console.error("Error while sending matching request:", error);
    }
  }
}

export default MatchingService;
