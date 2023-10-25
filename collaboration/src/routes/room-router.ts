import { Router } from 'express'
import * as RoomController from '../controllers/room-controller'

const roomRouter = Router()

roomRouter.post('/', RoomController.createRoom)
roomRouter.put('/:roomId', RoomController.closeRoom)

export default roomRouter