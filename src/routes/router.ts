import express, { type Request, type Response } from 'express';
import authRouter from './auth.routes.ts';

const router = express.Router();

router.get('/health', (req: Request, res: Response) => {
  return res.status(200).json({ success: true, message: 'Express app is ok!' });
});

router.use('/auth', authRouter);

export default router;
