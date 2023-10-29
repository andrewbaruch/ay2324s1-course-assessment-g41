// components/CodeEditor.tsx
import React from "react";
import { Textarea } from "@chakra-ui/react";
import { useCollabContext } from "src/hooks/contexts/useCollabContext";

const CodeEditor = () => {
  const { currentAttempt, onCodeChange } = useCollabContext();

  const handleCodeChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (currentAttempt) {
      onCodeChange(event.target.value, currentAttempt.attemptId);
    }
  };

  return (
    <Textarea
      value={currentAttempt ? currentAttempt.codeText : ""}
      onChange={handleCodeChange}
      width="100%"
      height="100%"
      resize="none"
    />
  );
};

export default CodeEditor;
