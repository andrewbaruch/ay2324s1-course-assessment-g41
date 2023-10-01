import { Router } from 'express';
import * as QuestionController from '@/controllers/question-controller';
import * as UIDMiddleware from '@/middlewares/uid-middleware';

const router = Router();

// TODO: update for session/middleware
router.use(UIDMiddleware.getUserInfoJWT);

router.post('/', QuestionController.createQuestion);
router.get('/:id', QuestionController.getQuestionById);
router.get('/', QuestionController.getFilteredQuestions);
router.put('/:id', QuestionController.updateQuestion);
router.delete('/:id', QuestionController.deleteQuestion);

export default router;