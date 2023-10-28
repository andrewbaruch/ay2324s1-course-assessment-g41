import { Room } from "../models/room"
import { generateSlug } from "random-word-slugs";
import { knexPgClient } from "@/clients/pg-knex";

export class RoomService {
  static async openRoom(room: Room) {
    if (!room) {
      return 
    }
    const updatedRoom = await knexPgClient("Room").where("id", room.id).update({
      isOpen: true
    }, ["id", "isOpen", "name"])
    console.log("updated room", updatedRoom)
  }

  static async closeRoom(roomId: number) {
    console.log('closing room', roomId)
    if (!roomId) {
      return
    }
    
    // set isOpen to false
    const updatedRoom = await knexPgClient("Room").where("id", roomId).update({
      isOpen: false
    }, ["id", "isOpen", "name"])

    console.log("closed room", updatedRoom)
    // TODO: @didy send attempt to attempt service via MQ 
  }

  static async createRoom(userId1: string, userId2: string) {
    RoomService.validateUsers(userId1, userId2);
    const { roomName } = await RoomService.generateRoomName();
    console.log('write into db')
    const room: Room = await knexPgClient("Room").insert({
      userId1, userId2, name: roomName
    }, ["id", "name", "userId1", "userId2", "isOpen"])
    
    console.log('complete db insertion', room)
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
      const room = await knexPgClient("Room").where("name", slug).first() as Room
      console.log('retrieved room', room)
      if (!room) {
        console.log('generated room name', slug)
        break
      }
    }

    return { roomName: slug }
  }
}