// components/QuestionDescription.tsx
import React from "react";
import { Select, Button, Tag, Text } from "@chakra-ui/react";
import { useCollabContext } from "src/hooks/contexts/useCollabContext";

const QuestionDescription = () => {
  const { state, onNewAttempt, onQuestionChange, onDeleteAttempt, setCurrentAttempt } =
    useCollabContext();
  const { currentAttempt } = useCollabContext(); // It's better to merge this with the line above

  const { questionTotalList } = state;

  const handleNewAttempt = () => {
    if (currentQuestion) {
      onNewAttempt(currentQuestion.id); // Assuming `currentQuestion` is defined
    }
  };

  const handleQuestionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newQuestionId = event.target.value;
    if (currentAttempt) {
      onQuestionChange(newQuestionId, currentAttempt.attemptId);
    }
  };

  const handlePageChange = (pageIndex: number) => {
    const selectedAttempt = state.listOfAttempts[pageIndex];
    if (selectedAttempt) {
      setCurrentAttempt(selectedAttempt); // Assuming setCurrentAttempt is obtained from useCollabContext or a similar context
    }
  };

  const handleDeleteAttempt = (attemptId: number) => {
    onDeleteAttempt(attemptId);
  };

  const currentQuestion = questionTotalList.find(
    (question) => question.id === currentAttempt?.question.id,
  );

  return (
    <div>
      <Select placeholder="Select a question" onChange={handleQuestionChange}>
        {questionTotalList.map((question) => (
          <option key={question.id} value={question.id}>
            {question.title}
          </option>
        ))}
      </Select>
      {currentQuestion && (
        <>
          <div>
            {currentQuestion.categories.map((category, index) => (
              <Tag key={index}>{category}</Tag>
            ))}
          </div>
          <Text>Difficulty: {currentQuestion.complexity}</Text>
          <Text>{currentQuestion.description}</Text>
          {/* Page buttons and new attempt button */}
          <Button onClick={handleNewAttempt}>New Attempt</Button>
          <div>
            {state.listOfAttempts.map((attempt, index) => (
              <Button
                key={attempt.attemptId}
                onClick={() => handlePageChange(index)}
                isActive={currentAttempt?.attemptId === attempt.attemptId}
              >
                Page {index + 1}
              </Button>
            ))}
          </div>
          {currentAttempt && (
            <Button onClick={() => handleDeleteAttempt(currentAttempt.attemptId)}>
              Delete Attempt
            </Button>
          )}
        </>
      )}
    </div>
  );
};

export default QuestionDescription;
