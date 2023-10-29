// components/QuestionDetails.tsx
import React from "react";
import { Tag, Text, Box } from "@chakra-ui/react";
import { useCollabContext } from "src/hooks/contexts/useCollabContext";
import { OptionBase, Select, SingleValue } from "chakra-react-select";

interface OptionType extends OptionBase {
  value: string;
  label: string;
}

const QuestionDetails = () => {
  const { state, onQuestionChange, currentAttempt } = useCollabContext();
  const { questionTotalList } = state;

  const handleQuestionChange = (selectedOption: SingleValue<OptionType>) => {
    if (!selectedOption) {
      return;
    }
    const newQuestionId = selectedOption.value;
    if (currentAttempt) {
      onQuestionChange(newQuestionId, currentAttempt.attemptId);
    }
  };

  const currentQuestion = questionTotalList.find(
    (question) => question.id === currentAttempt?.question.id,
  );

  const options = questionTotalList.map((question) => ({
    value: question.id,
    label: question.title,
  }));

  return currentAttempt ? (
    <Box>
      <Select
        options={options}
        onChange={handleQuestionChange}
        value={currentQuestion ? { value: currentQuestion.id, label: currentQuestion.title } : null}
        placeholder="Select a question"
      />
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
