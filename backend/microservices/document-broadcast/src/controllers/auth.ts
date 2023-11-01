import { onAuthenticatePayload } from "@hocuspocus/server";
import * as AuthService from "@/services/authentication";

const authenticateUser = async (data: onAuthenticatePayload) => {
  const token = data.token
  const userId = AuthService.verifyUserExists(token)
  await AuthService.verifyUserBelongsInRoom(userId, data.documentName)
}

export {
  authenticateUser
}