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

const parseCookie = (cookieString: string) => {
  if (!process.env.ACCESS_COOKIE_KEY) {
    console.log("Missing ACCESS_COOKIE_KEY")
    process.exit()
  }
  const accessTokenKey = process.env.ACCESS_COOKIE_KEY
  const cookies = new Map<string, string>();
  cookieString.split(';').forEach(cookie => {
    const parts = cookie.split('=');
    const name = parts[0].trim();
    const value = parts[1];
    cookies.set(name, value)
  });
  return Object.fromEntries(cookies)[accessTokenKey];
}

const checkAuthForUser = async (data: onAuthenticatePayload) => {
  const token = parseCookie(data.requestHeaders.cookie || "");
  const userId = AuthService.verifyUserExists(token)
  const promiseVerifications = [AuthService.verifyUserBelongsInRoom(userId, data.documentName), AuthService.verifyRoomIsOpen(data.documentName)] 
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