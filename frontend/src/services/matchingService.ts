import { Question } from "@/types/models/question";

import { QuestionComplexity } from "@/types/models/question";
import { useQuestionList } from "@/hooks/useQuestionList";
import QuestionService from "@/services/questionService";

const PEER_PREP_A5_KEY = "PEER_PREP_A5_KEY";

const questions = QuestionService.getQuestions();

class MatchingService {
  static setUpPairCoding(complexity: QuestionComplexity) {
    MatchingService.pairWithPeer();

    // get random question based on complexity
    const codingQuestion = MatchingService.getRandomQuestion(complexity);

    // send to other peer

    // store coding question in local storage
    localStorage?.setItem(PEER_PREP_A5_KEY, JSON.stringify(codingQuestion));
  }

  static getCodingQuestion() {
    const storage = localStorage?.getItem(PEER_PREP_A5_KEY);
    if (!storage) {
      return [];
    }
    const codingQuestion: Question = JSON.parse(storage);
    return codingQuestion;
  }

  private static pairWithPeer() {
    // TODO: call pairing service container to get peer
  }

  private static getRandomQuestion(complexity: QuestionComplexity) {
    const filteredQuestions = questions.filter(
      (q) => q.complexity === complexity
    );
    const randomIndex = Math.floor(Math.random() * filteredQuestions.length);

    return filteredQuestions[randomIndex];
  }
}

export default MatchingService;
