// components/QuestionDescription.tsx
import React from "react";
import { Select, Button, Tag, Text } from "@chakra-ui/react";
import { useCollabContext } from "./useCollabContext";

const QuestionDescription = () => {
  const { state, setState } = useCollabContext();
  const { currentAttempt, setCurrentAttempt } = useCollabContext();
  const { questionTotalList } = state;

  const handleNewAttempt = () => {
    // Logic for creating a new attempt
  };

  const handleQuestionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    // Logic for handling question change
  };

  const handlePageChange = (pageIndex: number) => {
    // Logic for changing page
    // karwi: set current attempt
  };

  const handleDeleteAttempt = (attemptId: number) => {
    // Logic for deleting an attempt
  };

  const currentQuestion = questionTotalList.find(
    (question) => question.id === currentAttempt?.questionId,
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
