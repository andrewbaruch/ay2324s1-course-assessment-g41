import { onAuthenticatePayload, onChangePayload, onStoreDocumentPayload } from "@hocuspocus/server";
import { Language } from "@/models/language";
import * as AttemptService from "@/services/attempt";
import * as RoomService from "@/services/room";
import * as AuthService from "@/services/auth";
import { parseCookie } from "@/utils/parseCookie";

const saveAttempt = (data: onStoreDocumentPayload) => {
  const { documentName } = data
  const ymap = data.document.getMap()
  const attemptId = ymap.get("attemptId") as string
  const text = ymap.get("text") as string
  const language = ymap.get("language") as Language
  AttemptService.saveAttempt({
    attemptId, text, language, roomName: documentName
  })
}

const checkAuthForUser = async (data: onAuthenticatePayload) => {
  const token = parseCookie(data.requestHeaders.cookie || "");
  const userId = AuthService.verifyUserExists(token)
  const promiseVerifications = [RoomService.verifyUserBelongsInRoom(userId, data.documentName), RoomService.verifyRoomIsOpen(data.documentName)] 
  try {
    await Promise.all(promiseVerifications)
  } catch (err) {
    // at least one verification failed
    console.error("Authorization error", err)
    throw err;
  }
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
  checkAuthForUser,
  handleChangeData
}