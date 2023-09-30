// `app/page.tsx` is the UI for the `/` URL
"use client";

import { MatchingForm } from "@/components/matching";

import {
  QuestionsList,
  QuestionDetails,
  QuestionForm,
} from "@/components/question";
import { useHeaderTab } from "@/hooks/useHeaderTabs";
import { useQuestion } from "@/hooks/useQuestion";
import { useQuestionList } from "@/hooks/useQuestionList";
import { HeaderTabs } from "@/types/header";

const Root = () => {
  const { questions } = useQuestionList();
  const { hasSelectedQuestion, question } = useQuestion();
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

  return currentTab === HeaderTabs.QUESTION_LIST ? (
    !hasSelectedQuestion || !question ? (
      <QuestionsList questions={questions} />
    ) : (
      <QuestionDetails {...question} />
    )
  ) : currentTab === HeaderTabs.MATCHING_FORM ? (
    <MatchingForm />
  ) : (
    <QuestionForm question={null} />
  );
};

export default Root;
