import { useContext } from "react";
import { CollabContext } from "./CollabRoom";

// karwi: move to hooks
export const useCollabContext = () => {
  const context = useContext(CollabContext);
  if (context === null) {
    throw new Error("useCollabContext must be used within a CollabContext.Provider");
  }
  return context;
};
