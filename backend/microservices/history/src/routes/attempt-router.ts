import { Router } from 'express'
import * as AttemptController from '@/controllers/attempt-controller';
import { authJWT } from "../../../../shared/middleware/auth-middleware"

const attemptRouter = Router()
attemptRouter.use(authJWT);
attemptRouter.get('/:roomName/:attemptId', AttemptController.getAttempt)
attemptRouter.get('/:roomName', AttemptController.getAllAttemptsInRoom)
attemptRouter.get('/', AttemptController.getAttemptsByUser)


export default attemptRouter