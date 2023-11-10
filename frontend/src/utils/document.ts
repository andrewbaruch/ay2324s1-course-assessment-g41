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
  
  console.log('document', document)
  const ymap = document.getMap(sharedKey);
  console.log('ymap', ymap)
  document.transact(() => {
    console.log('transacting', ymap)
    ymap.set(sharedKey, valueToUpdate);
  });
  ymap.get(sharedKey)
}