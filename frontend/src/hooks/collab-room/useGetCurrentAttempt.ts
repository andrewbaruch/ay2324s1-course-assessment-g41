import { Attempt } from "@/@types/attempt";
import { Language } from "@/@types/language";
import { Question } from "@/@types/models/question";
import * as Y from "yjs";
import { useGetDocumentValue } from "../room/useSharedDocument";

// TODO: create the attempt here
const useGetCurrentAttempt = (document: Y.Doc | null): Attempt => {
  // shared language
  const { sharedValue: sharedLanguage }: { sharedValue: Language } = useGetDocumentValue({
    sharedKey: "language",
    document,
    defaultValue: {
      label: "Plain Text",
      value: "plaintext"
    }
  })

  // shared question
  const { sharedValue: sharedQuestion }: { sharedValue: Question } = useGetDocumentValue({
    sharedKey: "question",
    document,
    defaultValue: null
  })
  
  // shared current attempt id
  const { sharedValue: attemptId }: { sharedValue: number } = useGetDocumentValue({
    sharedKey: "attemptId",
    document,
    defaultValue: 1
  })

  return {
    attemptId,
    question: sharedQuestion,
    language: sharedLanguage,
  };
};

export default useGetCurrentAttempt;
