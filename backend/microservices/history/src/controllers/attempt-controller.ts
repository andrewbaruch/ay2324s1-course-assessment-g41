import { Request, Response } from 'express';
import * as AttemptService from "@/services/attempt-service";

export async function getAttempt(req: Request, res: Response) {
  const { roomName, attemptId } = req.params
  const doc = await AttemptService.findAttemptFromDatabase(attemptId, roomName)
  if (!doc) {
    res.status(400).send()
  } else {
    res.json(doc).send()
  }
}

export async function getAllAttemptsInRoom(req: Request, res: Response) {
  const { roomName } = req.params;
  const doc = await AttemptService.findAllAttemptsFrom(roomName);
  if (!doc) {
    res.status(400).send()
  } else {
    res.json(doc).send()
  }
}