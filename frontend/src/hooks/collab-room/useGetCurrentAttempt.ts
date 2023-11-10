import { Attempt } from "@/@types/attempt";
import { Language } from "@/@types/language";
import { Question } from "@/@types/models/question";
import { User } from "@/@types/user";
import * as Y from "yjs";
import useGetIdentity from "../auth/useGetIdentity";
import { useGetDocumentValue } from "../room/useSharedDocument";

// TODO: create the attempt here
const useGetCurrentAttempt = (document: Y.Doc | null): Attempt & { listOfUsers: User[] } => {
  // shared language
  const { sharedValue: sharedLanguage }: { sharedValue: Language } = useGetDocumentValue({
    sharedKey: "langauge",
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
  
  // shared users
  const { identity } = useGetIdentity();
  const { sharedValue: pairIdentity }: { sharedValue: User } = useGetDocumentValue({
    sharedKey: `${identity.name}_pair`,
    document,
    defaultValue: {
      id: "user2",
      email: "user2@example.com",
      image: null,
      name: "User Two",
      preferred_language: "Python",
      preferred_difficulty: 2,
      preferred_topics: null,
      roles: null,
    }
  });
  
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
    listOfUsers: [identity, pairIdentity]
  };
};

export default useGetCurrentAttempt;
