import { Request, Response } from "express";

import complexityMatchingRequestCache from "@/utils/complexity-matching-request-cache";
import complexityMatchingPairCache from "@/utils/complexity-matching-pair-cache";
import { Status } from "@/models/status";
import ComplexityMatchingPushService from "@/services/complexity-matching-push-service";

export const pushMatchRequestToQueue = async (req: Request, res: Response) => {
  // TODO: @didy refator to use jwt token and auth service
  const { userId, questionComplexity }: {userId: string, questionComplexity: string} = req.body;
  const complexityPublisherService = new ComplexityMatchingPushService();
  try {
    complexityPublisherService.pushMatchingRequest(userId, questionComplexity)
  } catch (err) {
    // TODO: add better error validation
    res.status(400).send()
  }
  res.status(200).send()
  
}

export async function getMatchingStatus(
  req: Request,
  res: Response
): Promise<void> {
  // TODO: pull data from db
  const userId = req.params.id;
  // console.log(
  //   "in be get matching, matching keys=",
  //   matchingRequestCache.keys()
  // );
  // console.log(
  //   "in be get matching, pair keys=",
  //   matchingPairCache.keys()
  // );

  // console.log("in be get matching, userid=", userId);

  const matchingPair: any = complexityMatchingPairCache.get(userId);
  // console.log("in be get matching, matchingPair=", matchingPair);

  var status = complexityMatchingRequestCache.get(userId);
  // console.log("in be get matching, status=", status);

  if (matchingPair !== undefined) {
    const roomId: string | undefined = matchingPair.roomId;
    res.status(200).json({ roomId, status: Status.paired });
  } else if (status !== undefined) {
    res.status(200).json({ status: Status.processing });
  } else if (status === undefined) {
    res.status(200).json({ status: Status.expired });
  }
}
export async function getMatchingStatusWithoutParams(
  req: Request,
  res: Response
): Promise<void> {
  console.log("in be get matching without param");

  const status = 1;
  if (status == 1) {
    const roomId = 18263;
    res.status(200).json(roomId);
  } else if (status == 2) {
    res.status(202).send();
  } else if (status == 0) {
    res.status(204).send();
  }
}
