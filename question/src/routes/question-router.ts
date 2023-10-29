import { Router } from 'express';
import * as QuestionController from '@/controllers/question-controller';
import * as AuthMiddleware from '@/middlewares/auth-middleware';
import * as AuthorizationMiddleware from '@/middlewares/authorization-middleware';


const router = Router();

// TODO: update for session/middleware
router.use(AuthMiddleware.authJWT);

router.get('/', QuestionController.getFilteredQuestions);

router.post('/', AuthorizationMiddleware.authQuestion, QuestionController.createQuestion);
router.get('/:id', QuestionController.getQuestionById);
router.patch('/:id', AuthorizationMiddleware.authQuestion, QuestionController.updateQuestion);
router.delete('/:id', AuthorizationMiddleware.authQuestion, QuestionController.deleteQuestion);

export default router;