import { Room } from "../models/room"
import { generateSlug } from "random-word-slugs";
import { RoomTable, RoomUserTable } from "@/clients/pg-knex";
import { RoomUser } from "@/models/room-user";

export class RoomService {
  static async openRoom(roomName: string, userId: string) {
    if (!RoomService.doesUserHaveAccessToRoom(userId, roomName)) {
      throw new Error(`This user does not have access to the room.`)
    }
    const updatedRoom = await RoomTable.where("name", roomName).update({
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
    const updatedRoom = await RoomTable.where("name", roomName).update({
      isOpen: false
    }, ["id", "isOpen", "name"])

    console.log("closed room", updatedRoom)
    // TODO: @didy send attempt to attempt service via MQ 
  }

  static async createRoom(userId1: string, userId2: string) {
    const { roomName } = await RoomService.generateRoomName();
    console.log('write into db')
    const room: Room[] = await RoomTable.insert({
      name: roomName
    }, ["id", "name", "isOpen"])
    
    const roomUser1: RoomUser[] = await RoomUserTable.insert({
      roomName, userId: userId1,
    }, ["id", "roomName", "userId"])
    const roomUser2: RoomUser[] = await RoomUserTable.insert({
      roomName, userId: userId2,
    }, ["id", "roomName", "userId"])

    console.log('complete db insertion', room[0], roomUser1[0], roomUser2[0])
    return { room: room[0] }
  }

  static async isRoomOpen(roomName: string) {
    const record: Room[] = await RoomTable.where("name", roomName);
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
    
    const record: RoomUser[] = await RoomUserTable.where("roomName", roomName).andWhere("userId", userId);

    console.log('query result', record)
    return record.length > 0;
  }

  private static async generateRoomName() {
    console.log('generating room name')
    let slug = "";
    while (true) {
      slug = generateSlug()
      const room = await RoomTable.where("name", slug).first() as Room
      console.log('retrieved room', room)
      if (!room) {
        console.log('generated room name', slug)
        break
      }
    }

    return { roomName: slug }
  }
}