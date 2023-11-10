import { Question, QuestionComplexity } from "@/@types/models/question";
import { useEffect, useState } from "react";
import { useQuestions } from "../questions/useQuestionList";

const useRoomQuestion = ({ complexity }: { complexity: QuestionComplexity }) => {
  const { questions } = useQuestions({
    difficulties: [complexity],
    sorting: 'asc'
  })

  const [selectedQuestion, setSelectedQuestion] = useState<Question>();

  const handleQuestionChange = () => {

  }

  return {
    questions,
    handleQuestionChange
  }
  
};