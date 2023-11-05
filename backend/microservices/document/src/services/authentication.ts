import { verifyAccessToken } from "../../../../shared/lib/verifyAccessToken";
import * as CollabClient from "@/clients/collab-client"

const verifyUserExists = (token: string) => {
  if (!process.env.JWT_SECRET) {
    // TODO: update error message
    throw new Error("Missing JWT_SECRET");
  }
  const { userId } = verifyAccessToken(token, process.env.JWT_SECRET)
  return userId
}

const verifyUserBelongsInRoom = async (userId: string, roomName: string) => {
  return await CollabClient.doesUserHaveAccessToRoom(userId, roomName)
}

const verifyRoomIsOpen = async (roomName: string) => {
  return await CollabClient.isRoomOpen(roomName)
}

export {
  verifyUserBelongsInRoom,
  verifyUserExists,
  verifyRoomIsOpen
}