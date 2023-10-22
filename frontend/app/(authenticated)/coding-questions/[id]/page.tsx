import QuestionService from "@/services/questionService";
import { QuestionDetails } from "@/views/question";

const QuestionDetailsPage = async ({ params }: { params: { id: string } }) => {
  const question = await QuestionService.getQuestion(params.id)
  return <QuestionDetails {...question} />;
};

export default QuestionDetailsPage;
