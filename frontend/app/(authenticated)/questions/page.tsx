'use client';

import {
  QuestionsList,
} from '@/views/question';
import { useQuestionList } from '@/hooks/questions/useQuestionList';
import useAuthenticated from '@/hooks/guards/useAuthenticated';

// karwi: better name?
export default function Questions() {
  // useAuthenticated();
  const { questions } = useQuestionList();
  return (
    <QuestionsList questions={questions} />
  );
}
