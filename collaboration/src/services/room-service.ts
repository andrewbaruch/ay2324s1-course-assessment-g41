import { Room } from "../models/room"
import { generateSlug } from "random-word-slugs";
import { prisma } from "../clients/prisma";

export class RoomService {
  static async openRoom(room: Room) {
    if (!room) {
      return 
    }
    await prisma.room.update({
      where: {
        id: room.id
      },
      data: {
        isOpen: true
      }
    })
  }

  static async closeRoom(roomId: number) {
    console.log('closing room', roomId)
    if (!roomId) {
      return
    }
    
    // set isOpen to false
    await prisma.room.update({
      where: {
        id: roomId
      },
      data: {
        isOpen: false
      }
    })
    console.log('closed room in db')
    
    // TODO: @didy send attempt to attempt service via MQ 
  }

  static async createRoom(userId1: string, userId2: string) {
    RoomService.validateUsers(userId1, userId2);
    const { roomName } = await RoomService.generateRoomName();
    console.log('write into db')
    const room = await prisma.room.create({
      data: { userId1, userId2, name: roomName }
    })

    console.log('complete db')
    return room
  }

  // TODO: @didy update validation logic on integration with user service
  private static validateUsers(user1: string, user2: string) {
    console.log('validate users', user1, user2)
  }

  private static async generateRoomName() {
    console.log('generating room name')
    let slug = "";
    while (true) {
      slug = generateSlug()
      const room = await prisma.room.findFirst({
        where: {
          name: slug
        }
      })
      if (!room) {
        console.log('generated room name', slug)
        break
      }
    }

    return { roomName: slug }
  }
}