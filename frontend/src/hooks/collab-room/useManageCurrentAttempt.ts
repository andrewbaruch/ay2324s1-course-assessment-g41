import { Language } from "@/@types/language";
import { Question } from "@/@types/models/question";
import { getAttempt } from "@/services/history";
import QuestionService from "@/services/question";
import { resetTextInDocument, sendAttemptToDocServer, upsertDocumentValue } from "@/utils/document";
import { HocuspocusProvider } from "@hocuspocus/provider";
import { useEffect, useState } from "react";
import * as Y from "yjs";
import { useGetAllAttempts } from "../history/useGetAllAttempts";
import { useGetDocumentValue } from "../room/useSharedDocument";

const useManageAttempt = ({ document, provider, roomName }: {document: Y.Doc | null, provider: HocuspocusProvider | null, roomName: string }) => {
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
    defaultValue: null,
  })
  
  // shared current attempt id
  const { sharedValue: sharedAttemptId }: { sharedValue: number } = useGetDocumentValue({
    sharedKey: "attemptId",
    document,
    defaultValue: 1
  })

  const [currentAttempt, setCurrentAttempt] = useState({ attemptId: sharedAttemptId, question: sharedQuestion, language: sharedLanguage });
  const { attempts: listOfSavedAttempts } = useGetAllAttempts({ roomName, currentAttempt })

  useEffect(() => {
    if (!document || !provider) return;

    if (listOfSavedAttempts.length === 0) {
      // initialise the first attempt
      sendAttemptToDocServer({
        provider,
        attemptId: sharedAttemptId,
        language: sharedLanguage,
        text: "",
        questionId: sharedQuestion?.id,
      });
    }
  }, [document, provider]);

  useEffect(() => {
    console.log('setting current attempt to', sharedAttemptId, sharedLanguage);
    setCurrentAttempt({
      attemptId: sharedAttemptId,
      question: sharedQuestion,
      language: sharedLanguage
    });
  }, [sharedAttemptId, sharedLanguage, sharedQuestion]) 

  const createNewAttempt = () => {
    if (!provider || !document) {
      console.log('provider and document not initiated, no attempt to create');
      return;
    }

    const currentAttemptId = document.getMap("attemptId").get("attemptId") as number;
    const language = document.getMap("language").get("language") as Language;
    const text = document.getText("monaco");
    const question = document.getMap("question").get("question") as Question | undefined;
    
    if (currentAttemptId && currentAttemptId > 0) {
      // write all of previous attempt and send to server
      console.log('sending statless message', { currentAttemptId, language });
      sendAttemptToDocServer({
        provider,
        attemptId: currentAttemptId,
        language,
        text: text.toJSON(),
        questionId: question?.id || "-1", // "-1" indicates no question selected.
      });
    }
    // create new attempt
    console.log('creating attempt on new attempt', listOfSavedAttempts.length + 1);
    const newAttemptId = Math.max(...listOfSavedAttempts.map(attempt => attempt.attemptId)) + 1
    upsertDocumentValue({
      sharedKey: "attemptId",
      valueToUpdate: newAttemptId,
      document
    });
    resetTextInDocument({ document });
    sendAttemptToDocServer({
      provider,
      attemptId: newAttemptId,
      language,
      text: "",
      questionId: "",
    });
  }

  const toggleToAttempt = async (nextAttemptId: number) => {
    try {
      console.log(nextAttemptId);
      const toggledAttempt = await getAttempt(nextAttemptId, roomName);
      console.log('retrieved attempt', toggledAttempt);
      // update to prev attempt values
      upsertDocumentValue({
        sharedKey: "attemptId",
        valueToUpdate: toggledAttempt.attemptId,
        document
      });

      upsertDocumentValue({
        sharedKey: "language",
        valueToUpdate: toggledAttempt.language,
        document,
      });

      upsertDocumentValue({
        sharedKey: "question",
        valueToUpdate: toggledAttempt.question,
        document
      });

      resetTextInDocument({ document, defaultText: toggledAttempt.text });

      console.log(sharedAttemptId, sharedLanguage)

      setCurrentAttempt({
        attemptId: toggledAttempt.attemptId,
        question: toggledAttempt.question as Question,
        language: toggledAttempt.language
      })
    } catch (err) {
      console.error(err)
      // handle toast message here
    }
    
  }

  return {
    currentAttempt,
    listOfSavedAttempts,
    createNewAttempt,
    toggleToAttempt,
  }
};

export default useManageAttempt;
