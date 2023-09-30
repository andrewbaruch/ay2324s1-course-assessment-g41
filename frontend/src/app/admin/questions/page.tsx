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
import { Box } from '@chakra-ui/react';
// import AdminLayout from '@/layouts';

// ----------------------------------------------------------------------

// Questions.getLayout = (page: React.ReactElement) => (
//   <AdminLayout>{page}</AdminLayout>
// );

// ----------------------------------------------------------------------

// karwi: better name?
export default function Questions() {
  // useAuthenticated();
  const { questions } = useQuestionList();
  const { hasSelectedQuestion, question } = useQuestion();
  const { currentTab } = useHeaderTab();

  const renderContent = () => {
    if (currentTab === HeaderTabs.QUESTION_FORM) {
      return <QuestionForm question={null} />;
    }

    if (!hasSelectedQuestion || !question) {
      return <QuestionsList questions={questions} />;
    } else {
      return <QuestionDetails {...question} />;
    }
  };

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>{renderContent()}</Box>
  );
}
