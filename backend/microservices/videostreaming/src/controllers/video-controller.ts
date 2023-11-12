import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import videoService from '@/services/video-service';
import { handleServiceError } from '@/controllers/error-handler';

export async function createOffer(req: Request, res: Response) {
  try {
    const { offer, roomId } = req.body;
    await videoService.saveOffer(offer, roomId);
    res.status(StatusCodes.OK).json({ message: 'Offer saved successfully' });
  } catch (error) {
    handleServiceError(error, res);
  }
}

export async function createAnswer(req: Request, res: Response) {
  try {
    const { answer, roomId } = req.body;
    await videoService.saveAnswer(answer, roomId);
    res.status(StatusCodes.OK).json({ message: 'Answer saved successfully' });
  } catch (error) {
    handleServiceError(error, res);
  }
}

export async function handleIceCandidate(req: Request, res: Response) {
  try {
    const { candidate, roomId } = req.body;
    await videoService.saveIceCandidate(candidate, roomId);
    res
      .status(StatusCodes.OK)
      .json({ message: 'ICE candidate saved successfully' });
  } catch (error) {
    handleServiceError(error, res);
  }
}
