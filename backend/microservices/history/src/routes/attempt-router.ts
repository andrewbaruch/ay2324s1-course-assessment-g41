import { Router } from 'express'
import * as AttemptController from '@/controllers/attempt-controller';
import { authJWT } from "../../../../shared/middleware/auth-middleware"

const attemptRouter = Router()

// indempotency
// auth JWT endpoints, for client
attemptRouter.get('/:attemptId', authJWT, AttemptController.getAttempt)



export default attemptRouter