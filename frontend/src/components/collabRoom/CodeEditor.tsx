// components/CodeEditor.tsx
import React from "react";
import { useCollabContext } from "src/hooks/contexts/useCollabContext";

// karwi: replace with didymus code editor
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
