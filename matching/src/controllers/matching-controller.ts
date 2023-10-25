import { Request, Response } from "express";

import matchingRequestCache from "@/utils/matchingRequestCache";
import matchingPairCache from "@/utils/matchingPairCache";
import { Status } from "@/models/status";

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

  const matchingPair: any = matchingPairCache.get(userId);
  // console.log("in be get matching, matchingPair=", matchingPair);

  var status = matchingRequestCache.get(userId);
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
