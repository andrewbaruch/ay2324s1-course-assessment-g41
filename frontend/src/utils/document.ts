import { Doc } from "yjs";

export const upsertDocumentValue = ({
  sharedKey,
  valueToUpdate,
  document
}: {
  sharedKey: string;
  valueToUpdate: any;
  document: Doc | null;
  }): void => {
  if (!document) return;
  
  const ymap = document.getMap(sharedKey);
  document.transact(() => {
      ymap.set(sharedKey, valueToUpdate);
  });
}