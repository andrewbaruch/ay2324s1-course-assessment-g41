import { Language } from "@/@types/language";
import { HocuspocusProvider } from "@hocuspocus/provider";
import { Doc } from "yjs";

export const upsertDocumentValue = ({
  sharedKey,
  valueToUpdate,
  document,
}: {
  sharedKey: string;
  valueToUpdate: any;
  document: Doc | null;
}): void => {
  if (!document) return;

  console.log("document", document);
  const ymap = document.getMap(sharedKey);
  console.log("ymap", ymap);
  document.transact(() => {
    console.log("transacting", ymap);
    ymap.set(sharedKey, valueToUpdate);
  });
  ymap.get(sharedKey);
};

export const resetTextInDocument = ({
  document,
  defaultText = "",
}: {
  document: Doc | null;
  defaultText?: string;
}) => {
  if (!document) return;

  const ytext = document.getText("monaco");
  // listeners to ytext("monaco") are already handled  by the monaco binding library
  document.transact(() => {
    console.log("transacting resetting text", ytext);
    ytext.delete(0, ytext.length);
    ytext.insert(0, defaultText);
    console.log("removal of text complete");
  });
};

export const sendAttemptToDocServer = ({
  attemptId,
  text,
  language,
  questionId,
  provider,
}: {
  attemptId: number;
  text: string;
  language: Language;
  questionId: string | null | undefined;
  provider: HocuspocusProvider | null;
}) => {
  provider?.sendStateless(
    JSON.stringify({
      attemptId,
      language,
      text,
      questionId,
    }),
  );
};
