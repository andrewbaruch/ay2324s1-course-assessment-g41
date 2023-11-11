import { Request, Response } from 'express';
import * as AttemptService from "@/services/attempt-service";

export async function getAttempt(req: Request, res: Response) {
  const { roomName, attemptId } = req.params
  const doc = await AttemptService.findAttemptFromDatabase(parseInt(attemptId), roomName)
  if (!doc) {
    res.status(400).send()
  } else {
    res.status(200).json(doc)
  }
  return
}

export async function getAllAttemptsInRoom(req: Request, res: Response) {
  const { roomName } = req.params;
  const doc = await AttemptService.findAllAttemptsFrom(roomName);
  res.status(200).json(doc)
}