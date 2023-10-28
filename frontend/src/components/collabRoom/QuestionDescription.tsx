// components/QuestionDescription.tsx
import React, { useContext } from "react";
import { Select, Button, Tag, Text } from "@chakra-ui/react";
import { CollabContext, CurrentAttemptContext } from "./CollabRoom";
import { QuestionComplexity } from "@/@types/models/question";
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
        </>
      )}
    </div>
  );
};

export default QuestionDescription;
