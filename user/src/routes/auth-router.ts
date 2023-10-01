import { Router } from 'express';
import * as AuthController from '@/controllers/auth-controller';

const authRouter = Router();

authRouter.get('/google', AuthController.googleAuth);
authRouter.post('/username', AuthController.usernameAuth);
authRouter.post('/register', AuthController.usernameAuth);
authRouter.get('/googleRedirect', AuthController.googleRedirect);
authRouter.get('/logout', AuthController.logout);

export default authRouter;