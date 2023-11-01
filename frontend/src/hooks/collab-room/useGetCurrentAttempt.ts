import { Attempt } from "@/@types/attempt";
import { QuestionComplexity } from "@/@types/models/question";
import * as Y from "yjs";

// TODO: create the attempt here
const useGetCurrentAttempt = (document: Y.Doc | null): Attempt => {
  // TODO: make use of useshareddocument here to get the attempt id and language, etc
  // const { sharedValue: sharedLanguage }: { sharedValue: { label: string; value: string } } =
  //   useSharedDocument({
  //     sharedKey: "language",
  //     valueToShare: language,
  //     document,
  //   });

  // TODO: then create attempt here
  return {
    attemptId: 1,
    // TODO: remove code text?
    codeText: "// Your code here",
    question: {
      title: "Reverse String",
      id: "2",
      description:
        "Write a function that reverses a string. The input string is given as an array of characters `s`.",
      categories: ["String"],
      complexity: QuestionComplexity.EASY,
    },
    language: { label: "Plain Text", value: "plaintext" },
  };
};

export default useGetCurrentAttempt;
