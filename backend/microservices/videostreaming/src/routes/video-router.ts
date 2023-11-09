import { Router } from 'express';
import * as VideoController from '@/controllers/video-controller';
import { authJWT } from '@/middlewares/auth-middleware';

const videoRouter = Router();

videoRouter.use(authJWT);

videoRouter.post('/offer', VideoController.createOffer);
videoRouter.post('/answer', VideoController.createAnswer);
videoRouter.post('/candidate', VideoController.handleIceCandidate);

export default videoRouter;
