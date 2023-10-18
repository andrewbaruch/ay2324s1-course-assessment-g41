import { Router } from "express";
import * as MatchingController from "@/controllers/matching-controller";

const matchingRouter = Router();

matchingRouter.post("/status", MatchingController.getMatchingStatus);

export default matchingRouter;
