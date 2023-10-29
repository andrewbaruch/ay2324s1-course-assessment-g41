import { Router } from "express";
import * as MatchingController from "@/controllers/matching-controller";
import { authJWT } from "../../../../shared/middleware/auth-middleware"

const matchingRouter = Router();
matchingRouter.use(authJWT)

matchingRouter.get("/user/status", MatchingController.getMatchingStatus);
matchingRouter.post("/user", MatchingController.pushMatchRequestToQueue)

export default matchingRouter;
