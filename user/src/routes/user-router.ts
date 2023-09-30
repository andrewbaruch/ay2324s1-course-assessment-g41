import { Router } from 'express';
import * as UserController from '@/controllers/user-controller';
import * as UIDMiddleware from '@/middlewares/uid-middleware';

const router = Router();

// TODO: update for session/middleware
router.use(UIDMiddleware.getUserInfoJWT);

router.post('/', UserController.createUser);
router.get('/:id', UserController.getUserById);
router.get('/', UserController.getCurrentUser);
router.put('/', UserController.updateUser);
router.delete('/', UserController.deleteUser);

export default router;