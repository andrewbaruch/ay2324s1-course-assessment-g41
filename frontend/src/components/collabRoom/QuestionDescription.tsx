// components/QuestionDescription.tsx
import React from "react";
import QuestionDetails from "./QuestionDetails";
import AttemptActions from "./AttemptActions";

const QuestionDescription = () => {
  return (
    <div>
      <QuestionDetails />
      <AttemptActions />
    </div>
  );
};

export default QuestionDescription;
