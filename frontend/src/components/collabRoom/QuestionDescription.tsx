// components/QuestionDescription.tsx
import React from "react";
import { Box } from "@chakra-ui/react";
import QuestionDetails from "./QuestionDetails";
import AttemptActions from "./AttemptActions";

const QuestionDescription = () => {
  return (
    <Box>
      <QuestionDetails />
      <AttemptActions />
    </Box>
  );
};

export default QuestionDescription;
