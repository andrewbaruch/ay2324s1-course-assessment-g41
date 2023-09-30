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

  if (currentTab === HeaderTabs.QUESTION_FORM) {
    return <QuestionForm question={null} />;
  }

  if (!hasSelectedQuestion || !question) {
    return <QuestionsList questions={questions} />;
  } else {
    return <QuestionDetails {...question} />;
  }
};

export default Questions;
