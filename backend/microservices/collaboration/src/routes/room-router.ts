import { Router } from 'express'
import * as RoomController from '../controllers/room-controller'
import { authJWT } from "../../../../shared/middleware/auth-middleware"

const roomRouter = Router()
roomRouter.use(authJWT)

roomRouter.post('/', RoomController.createRoom)
roomRouter.put('/:roomId', RoomController.closeRoom)

export default roomRouter