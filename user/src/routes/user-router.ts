import { Router } from 'express';
import * as UserController from '@/controllers/user-controller';
import * as AuthMiddleware from '@/middlewares/auth-middleware';

const userRouter = Router();

userRouter.use(AuthMiddleware.authJWT);

// NOTE: No need to expose creating, should be done in registration steps?
userRouter.get('/:id', UserController.getUserById);
userRouter.get('/', UserController.getCurrentUser);
userRouter.patch('/', UserController.updateUser);
userRouter.delete('/', UserController.deleteUser);

userRouter.get('/topics', UserController.readCurrentTopics);
userRouter.post('/topics', UserController.addTopics);
userRouter.delete('/topics', UserController.deleteTopics);

export default userRouter;