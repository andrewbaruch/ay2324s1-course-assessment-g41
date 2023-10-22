import { QuestionComplexity } from "@/@types/models/question";

export const transformQuestionComplexity = (complexity: QuestionComplexity) => {
  switch (complexity) {
    case "Easy":
      return 1
    case "Medium":
      return 2
    case "Hard":
      return 3
  }
}