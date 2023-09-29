// `app/page.tsx` is the UI for the `/` URL
'use client';

import {
  QuestionsList,
  QuestionDetails,
  QuestionForm,
} from '@/components/question';
import { useHeaderTab } from '@/hooks/useHeaderTabs';
import { useQuestion } from '@/hooks/useQuestion';
import { useQuestionList } from '@/hooks/useQuestionList';
import { HeaderTabs } from '@/@types/header';
import useAuthenticated from '@/hooks/guards/useAuthenticated';

const Questions = () => {
  useAuthenticated();
  const { questions } = useQuestionList();
  const { hasSelectedQuestion, question } = useQuestion();
  const { currentTab } = useHeaderTab();

  return currentTab === HeaderTabs.QUESTION_LIST ? (
    !hasSelectedQuestion || !question ? (
      <QuestionsList questions={questions} />
    ) : (
      <QuestionDetails {...question} />
    )
  ) : (
    <QuestionForm question={null} />
  );
};

export default Questions;
