import { Router } from 'express'
import * as RoomController from '../controllers/room-controller'
import { authJWT } from "../../../../shared/middleware/auth-middleware"

const roomRouter = Router()

// TODO: add verifier for microservice to call createRoom, otherwise reject request
roomRouter.post('/', RoomController.createRoom)

// indempotency
// auth JWT endpoints
roomRouter.put('/:roomId/status/close', authJWT, RoomController.closeRoom)
roomRouter.put('/:roomId/status/open', authJWT, RoomController.openRoom)

export default roomRouter