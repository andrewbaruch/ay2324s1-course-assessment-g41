import { Request, Response } from "express";
// import matchingService from "@/services/matching-service";

export async function getMatchingStatus(
  req: Request,
  res: Response
): Promise<void> {
  // TODO: pull data from db
  const userId = req.params.id;
  console.log("in be get matching, userid=", userId);

  const status = 1;
  if (status == 1) {
    const roomId = 912738;
    res.status(200).json(roomId);
  } else if (status == 2) {
    res.status(202).send();
  } else if (status == 0) {
    res.status(404).send();
  }
}
export async function getMatchingStatusWithoutParams(
  req: Request,
  res: Response
): Promise<void> {
  // TODO: pull data from db
  // const userId = req.params.id;
  console.log("in be get matching without param, userid");

  const status = 1;
  if (status == 1) {
    const roomId = 18263;
    res.status(200).json(roomId);
  } else if (status == 2) {
    res.status(202).send();
  } else if (status == 0) {
    res.status(404).send();
  }
}
