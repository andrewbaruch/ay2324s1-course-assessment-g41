import { Request, Response } from 'express';
import * as AttemptService from "@/services/attempt-service";

export async function getAttempt(req: Request, res: Response) {
  const { attemptId } = req.params
  const doc = await AttemptService.findAttemptFromDatabase(attemptId)
  if (!doc) {
    res.status(400).send()
  } else {
    res.json(doc).send()
  }
}
