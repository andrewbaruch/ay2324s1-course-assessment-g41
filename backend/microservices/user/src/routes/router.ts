import { Router } from 'express';

import userRouter from '@/routes/user-router'
import authRouter from '@/routes/auth-router'
import * as ResourceController from '@/controllers/resource-controller';

const routes = Router();

routes.get('/topics', ResourceController.getTopics)
routes.get('/languages', ResourceController.getLanguages)

routes.use('/user', userRouter);
routes.use('/auth', authRouter);

export default routes;
