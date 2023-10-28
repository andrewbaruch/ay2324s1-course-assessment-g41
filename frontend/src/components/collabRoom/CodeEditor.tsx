// components/CodeEditor.tsx
import React, { useContext } from "react";
import { CollabContext } from "./CollabRoom";
import { useCollabContext } from "./useCollabContext";

const CodeEditor = () => {
  const { state, setState } = useCollabContext();

  const handleCodeChange = (newCode: string) => {
    setState((prevState) => ({
      ...prevState,
      codeEditorText: newCode,
    }));
  };

  return (
    <textarea value={state.codeEditorText} onChange={(e) => handleCodeChange(e.target.value)} />
  );
};

export default CodeEditor;
