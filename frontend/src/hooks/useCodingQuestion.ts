import { useEffect, useState } from "react";
import { atom, useAtom } from "jotai";
import { Question } from "@/types/models/question";

interface CodingQuestionAtom {
  codingQuestion: Question | undefined;
}

const codingquestionAtom = atom<CodingQuestionAtom>({
  codingQuestion: undefined,
});

export const useCodingQuestion = () => {
  const [questionWrapper, setQuestionWrapper] = useAtom(codingquestionAtom);

  const setQuestion = (q: Question | undefined = undefined) => {
    setQuestionWrapper({
      codingQuestion: q,
    });
    return;
  };

  return { setQuestion, codingQuestion: questionWrapper.codingQuestion };
};
