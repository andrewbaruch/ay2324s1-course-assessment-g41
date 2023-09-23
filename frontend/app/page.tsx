// `app/page.tsx` is the UI for the `/` URL
"use client";

import QuestionDetails from "@/components/question";
import { QuestionsList } from "@/components/question/QuestionList";
import { useQuestion } from "@/hooks/useQuestion";
import { Question, QuestionComplexity } from "@/types/models/question";

const QUESTION_EXAMPLE: Question = {
  title: "The K Weakest Rows in a Matrix",
  description: `You are given an m x n binary matrix mat of 1's (representing soldiers) and 0's (representing civilians). The soldiers are positioned in front of the civilians. That is, all the 1's will appear to the left of all the 0's in each row.
  A row i is weaker than a row j if one of the following is true:
  The number of soldiers in row i is less than the number of soldiers in row j.
  Both rows have the same number of soldiers and i < j.
  Return the indices of the k weakest rows in the matrix ordered from weakest to strongest.`,
  complexity: QuestionComplexity.EASY,
  id: 1,
  categories: ["DFS"],
};

const Root = () => {
  const questions = [
    QUESTION_EXAMPLE,
    QUESTION_EXAMPLE,
    QUESTION_EXAMPLE,
    QUESTION_EXAMPLE,
    QUESTION_EXAMPLE,
    QUESTION_EXAMPLE,
    QUESTION_EXAMPLE,
    QUESTION_EXAMPLE,
  ];
  const { hasSelectedQuestion, question } = useQuestion();

  return !hasSelectedQuestion || !question ? (
    <QuestionsList questions={questions} />
  ) : (
    <QuestionDetails {...question} />
  );
};

export default Root;
