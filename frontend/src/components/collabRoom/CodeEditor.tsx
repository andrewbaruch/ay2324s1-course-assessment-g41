// components/CodeEditor.tsx
import React, { useContext } from "react";
import { CurrentAttemptContext } from "./CollabRoom";
import { useCollabContext } from "./useCollabContext";

const CodeEditor = () => {
  const { currentAttempt } = useCollabContext();

  return (
    <textarea
      value={currentAttempt ? currentAttempt.codeText : ""}
      readOnly={true} // Set to readOnly as per the requirement
    />
  );
};

export default CodeEditor;
