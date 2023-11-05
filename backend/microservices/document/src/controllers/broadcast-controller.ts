import { onAuthenticatePayload, onChangePayload, onStoreDocumentPayload } from "@hocuspocus/server";
import { Language } from "@/models/language";
import * as AttemptService from "@/services/attempt";
import * as AuthService from "@/services/authentication";

const saveAttempt = (data: onStoreDocumentPayload) => {
  const { documentName } = data
  const ymap = data.document.getMap()
  const attemptId = ymap.get("attemptId") as string
  const text = ymap.get("text") as string
  const language = ymap.get("language") as Language
  AttemptService.saveAttempt({
    attemptId, text, language, roomId: documentName
  })
}

const authenticateUser = async (data: onAuthenticatePayload) => {
  // const token = data.token
  // const userId = AuthService.verifyUserExists(token)
  // await AuthService.verifyUserBelongsInRoom(userId, data.documentName)
}

const handleChangeData = async (data: onChangePayload) => {
  const signal = data.document.getMap().get("signal") as string
  
  switch (signal) {
    case "NEW":
      // create attempt
      return
    case "REVERT":
      // go back to attempt
      return
  }
}

export {
  saveAttempt,
  authenticateUser,
  handleChangeData
}