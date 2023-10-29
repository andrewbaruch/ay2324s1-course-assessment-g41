// components/QuestionDetails.tsx
import React from "react";
import { Select, Tag, Text, Box } from "@chakra-ui/react";
import { useCollabContext } from "src/hooks/contexts/useCollabContext";

const QuestionDetails = () => {
  const { state, onQuestionChange, currentAttempt } = useCollabContext();
  const { questionTotalList } = state;

  const handleQuestionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newQuestionId = event.target.value;
    if (currentAttempt) {
      onQuestionChange(newQuestionId, currentAttempt.attemptId);
    }
  };

  const currentQuestion = questionTotalList.find(
    (question) => question.id === currentAttempt?.question.id,
  );

  return currentAttempt ? (
    <Box>
      <Select placeholder="Select a question" onChange={handleQuestionChange}>
        {questionTotalList.map((question) => (
          <option key={question.id} value={question.id}>
            {question.title}
          </option>
        ))}
      </Select>
      {currentQuestion && (
        <>
          <Text>Difficulty: {currentQuestion.complexity}</Text>
          <div>
            {currentQuestion.categories.map((category, index) => (
              <Tag key={index}>{category}</Tag>
            ))}
          </div>
          <Text>{currentQuestion.description}</Text>
        </>
      )}
    </Box>
  ) : null;
};

export default QuestionDetails;
