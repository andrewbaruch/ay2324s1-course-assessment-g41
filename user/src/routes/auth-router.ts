import { Router } from 'express';
import * as AuthController from '@/controllers/auth-controller';

const authRouter = Router();

authRouter.get('/google', AuthController.googleAuth);
authRouter.post('/refresh', AuthController.refresh);
authRouter.get('/googleRedirect', AuthController.googleRedirect);

export default authRouter;