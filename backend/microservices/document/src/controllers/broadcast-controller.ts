import { onAuthenticatePayload, onChangePayload, onStatelessPayload, onStoreDocumentPayload } from "@hocuspocus/server";
import * as AttemptService from "@/services/attempt";
import * as RoomService from "@/services/room";
import * as AuthService from "@/services/auth";
import { parseCookie } from "@/utils/parseCookie";

const autoSaveAttempt = (data: onStoreDocumentPayload) => {
  const attempt = AttemptService.extractAttemptFromDocument({ document: data.document });
  AttemptService.saveAttempt({ ...attempt, roomName: data.documentName, questionId: "test-question-id" });
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

const handleStatelessMessage = async (data: onStatelessPayload) => {
  const { attemptId, language, text } = JSON.parse(data.payload);
  console.log("Saving ", {
    roomName: data.documentName,
    attemptId,
    text,
    language,
    // questionId
  })
  AttemptService.saveAttempt({
    roomName: data.documentName,
    attemptId,
    text,
    language,
    questionId: "test-question-id",
  })

  console.log("Creating New Attempt")
}

const handleChangeData = async (data: onChangePayload) => {
  const signal = data.document.getMap("signal").get("signal") as string

  console.log('reading signal', signal)
  
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
  autoSaveAttempt as saveAttempt,
  checkAuthForUser,
  handleChangeData,
  handleStatelessMessage
}