import { Router } from "express";
import * as MatchingController from "@/controllers/matching-controller";

const matchingRouter = Router();

matchingRouter.get("/status/:id", MatchingController.getMatchingStatus);
// matchingRouter.get("/status", MatchingController.getMatchingStatusWithoutParams);

export default matchingRouter;
