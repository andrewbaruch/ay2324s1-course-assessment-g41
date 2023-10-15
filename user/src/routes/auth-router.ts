import { Router } from 'express';
import * as AuthController from '@/controllers/auth-controller';

const authRouter = Router();

authRouter.get('/google', AuthController.googleAuth);
authRouter.post('/refresh', AuthController.refresh);
authRouter.get('/googleRedirect', AuthController.googleRedirect);
authRouter.get('/checkAuth', AuthController.googleRedirect);
authRouter.get('/logout', AuthController.googleRedirect);

export default authRouter;