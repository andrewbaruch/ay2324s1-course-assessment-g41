import { Request, Response } from 'express';
import { RoomService } from "../services/room-service";

export async function createRoom(req: Request, res: Response) {
  const { userId1, userId2 }: { userId1: string, userId2: string } = req.body
  const { room } = await RoomService.createRoom(userId1, userId2)
  res.status(200).json({
    ...room
  })
}

export async function closeRoom(req: Request, res: Response) {
  const { roomId } = req.params
  await RoomService.closeRoom(parseInt(roomId))
  res.status(200).send()
}