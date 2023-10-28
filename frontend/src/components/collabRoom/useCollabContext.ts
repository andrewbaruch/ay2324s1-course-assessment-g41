import { useContext } from "react";
import { CollabContext, CurrentAttemptContext } from "./CollabRoom";

export const useCollabContext = () => {
  const collabContext = useContext(CollabContext);
  const currentAttemptContext = useContext(CurrentAttemptContext);

  if (collabContext === null) {
    throw new Error("useCollabContext must be used within a CollabContext.Provider");
  }

  if (currentAttemptContext === null) {
    throw new Error("useCollabContext must be used within a CurrentAttemptContext.Provider");
  }

  return {
    ...collabContext,
    ...currentAttemptContext,
  };
};
