import { Router } from 'express'
import * as AttemptController from '@/controllers/attempt-controller';
import { authJWT } from "../../../../shared/middleware/auth-middleware"

const attemptRouter = Router()
// attemptRouter.use(authJWT);
attemptRouter.get('/:attemptId', AttemptController.getAttempt)



export default attemptRouter