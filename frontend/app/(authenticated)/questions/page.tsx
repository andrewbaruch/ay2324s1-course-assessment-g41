'use client';

import {
  QuestionsList,
} from '@/views/question';
import { useQuestions } from '@/hooks/questions/useQuestionList';
import useAuthenticated from '@/hooks/guards/useAuthenticated';

// karwi: better name?
export default function Questions() {
  // useAuthenticated();
  const { questions } = useQuestions();
  return (
    <QuestionsList questions={questions} />
  );
}
