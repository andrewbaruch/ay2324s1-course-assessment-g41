import { atom, useAtom } from "jotai";
import { Question, QuestionComplexity } from "@/@types/models/question";
import QuestionService from "@/services/questionService";
import { useEffect } from "react";

interface QuestionListAtom {
  questions: Question[];
}

const questionListAtom = atom<QuestionListAtom>({
  questions: [],
});

export const useQuestions = () => {
  const [questionListWrapper, setQuestionListWrapper] = useAtom(questionListAtom);

  const setQuestionList = (questionList: Question[]) => {
    setQuestionListWrapper({
      questions: questionList,
    });
  };

  useEffect(() => {
    QuestionService.getQuestions().then(questions => {
      console.log(questions)
      setQuestionList(questions)
    })

  }, [])

  const addQuestion = async ({
    title,
    description,
    complexity,
    categories,
  }: {
    title: string;
    description: string;
    complexity: QuestionComplexity;
    categories: string[];
  }) => {
    await QuestionService.addQuestion({ title, description, complexity, categories });
    setQuestionList(await QuestionService.getQuestions());
  };

  const removeQuestion = async ({ id }: { id: string }) => {
    await QuestionService.removeQuestion({ id });
    setQuestionList(await QuestionService.getQuestions());
  };

  const editQuestion = async (editedQuestionData: Question) => {
    await QuestionService.editQuestion(editedQuestionData);
    setQuestionList(await QuestionService.getQuestions());
  };

  return {
    questions: questionListWrapper.questions,
    addQuestion,
    removeQuestion,
    editQuestion,
  };
};
