import { Room } from "../models/room"
import { generateSlug } from "random-word-slugs";
import * as Knex from "knex"
import { knexPgClient } from "@/clients/pg-knex";

export class RoomService {
  static async openRoom(roomName: string, userId: string) {
    if (!RoomService.doesUserHaveAccessToRoom(userId, roomName)) {
      throw new Error(`This user does not have access to the room.`)
    }
    const updatedRoom = await knexPgClient("Room").where("name", roomName).update({
      isOpen: true
    }, ["id", "isOpen", "name"])
    console.log("updated room", updatedRoom)
  }

  static async closeRoom(roomName: string, userId: string) {
    if (!RoomService.doesUserHaveAccessToRoom(userId, roomName)) {
      throw new Error(`This user does not have access to the room.`)
    }

    console.log('closing room', roomName)
    
    // set isOpen to false
    const updatedRoom = await knexPgClient("Room").where("name", roomName).update({
      isOpen: false
    }, ["id", "isOpen", "name"])

    console.log("closed room", updatedRoom)
    // TODO: @didy send attempt to attempt service via MQ 
  }

  static async createRoom(userId1: string, userId2: string) {
    const { roomName } = await RoomService.generateRoomName();
    console.log('write into db')
    const room: Room[] = await knexPgClient("Room").insert({
      userId1, userId2, name: roomName
    }, ["id", "name", "userId1", "userId2", "isOpen"])
    
    console.log('complete db insertion', room[0])
    return { room: room[0] }
  }

  static async isRoomOpen(roomName: string) {
    const record: Room[] = await knexPgClient("Room").where("name", roomName);
    if (record.length === 0) {
      return false;
    }
    
    const { isOpen } = record[0];
    return isOpen;
  }

  static async doesUserHaveAccessToRoom(userId: string, roomName: string) {
    if (!userId || !roomName) {
      console.log("missing arguments", userId, roomName)
      return false;
    }
    
    const record: Room[] = await knexPgClient("Room").where("name", roomName).where((builder: any) => {
      builder.where("userId1", userId).orWhere("userId2", userId)
    })

    console.log('query result', record)
    return record.length > 0;
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