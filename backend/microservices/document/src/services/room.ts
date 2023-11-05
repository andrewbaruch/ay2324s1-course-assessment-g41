import * as RoomClient from "@/clients/room-client"

const verifyUserBelongsInRoom = async (userId: string, roomName: string) => {
  return await RoomClient.doesUserHaveAccessToRoom(userId, roomName)
}

const verifyRoomIsOpen = async (roomName: string) => {
  return await RoomClient.isRoomOpen(roomName)
}

export {
  verifyUserBelongsInRoom,
  verifyRoomIsOpen
}