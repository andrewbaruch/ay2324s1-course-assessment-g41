import { Request, Response } from 'express';
import * as AttemptService from "@/services/attempt-service";

export async function getAttempt(req: Request, res: Response) {
  const { attemptId } = req.params
  await AttemptService.findAttemptFromDatabase(attemptId)
}
