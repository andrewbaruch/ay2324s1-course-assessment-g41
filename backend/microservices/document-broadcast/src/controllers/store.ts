import { onStoreDocumentPayload } from "@hocuspocus/server";
import * as StorageService from "@/services/storage";
import { Language } from "@/models/language";

const saveAttempt = (data: onStoreDocumentPayload) => {
  const { documentName } = data
  const { attemptId, text, language }: { attemptId: string; text: string; language: Language } = data.context
  StorageService.saveDocument({
    attemptId, text, language, roomId: documentName
  })
}

export {
  saveAttempt
}