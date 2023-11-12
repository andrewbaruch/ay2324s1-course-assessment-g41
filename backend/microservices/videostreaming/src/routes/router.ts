import { Router } from 'express';
import videoRouter from '@/routes/video-router';

const routes = Router();

routes.use('/video', videoRouter);

export default routes;
