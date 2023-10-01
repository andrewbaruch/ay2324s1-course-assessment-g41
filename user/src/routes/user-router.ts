import { Router } from 'express';
import * as UserController from '@/controllers/user-controller';
import * as AuthMiddleware from '@/middlewares/auth-middleware';

const userRouter = Router();

userRouter.use(AuthMiddleware.authJWT);

userRouter.post('/', UserController.createUser);
userRouter.get('/:id', UserController.getUserById);
userRouter.get('/', UserController.getCurrentUser);
userRouter.put('/', UserController.updateUser);
userRouter.delete('/', UserController.deleteUser);

export default userRouter;