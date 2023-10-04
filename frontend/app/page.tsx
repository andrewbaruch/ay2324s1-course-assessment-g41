// `app/page.tsx` is the UI for the `/` URL
"use client";

import { MatchingForm } from "@/components/matching";
import { CodingPage } from "@/components/coding";

import {
  QuestionsList,
  QuestionDetails,
  QuestionForm,
} from "@/components/question";
import { useHeaderTab } from "@/hooks/useHeaderTabs";
import { useQuestion } from "@/hooks/useQuestion";
import { useCodingQuestion } from "@/hooks/useCodingQuestion";
import { useQuestionList } from "@/hooks/useQuestionList";
import { HeaderTabs } from "@/types/header";

const Root = () => {
  const { questions } = useQuestionList();
  const { hasSelectedQuestion, question } = useQuestion();
  const { codingQuestion } = useCodingQuestion();
  const { currentTab } = useHeaderTab();

  // return currentTab === HeaderTabs.QUESTION_LIST ? (
  //   !hasSelectedQuestion || !question ? (
  //     <QuestionsList questions={questions} />
  //   ) : (
  //     <QuestionDetails {...question} />
  //   )
  // ) : (
  //   <QuestionForm question={null} />
  // );

  // return <CodingPage />;
  return currentTab === HeaderTabs.QUESTION_LIST ? (
    !hasSelectedQuestion || !question ? (
      <QuestionsList questions={questions} />
    ) : (
      <QuestionDetails {...question} />
    )
  ) : currentTab === HeaderTabs.MATCHING_FORM ? (
    <MatchingForm />
  ) : currentTab === HeaderTabs.CODING_PAGE ? (
    <CodingPage codingQuestion={codingQuestion} />
  ) : (
    <QuestionForm question={null} />
  );
};

export default Root;
