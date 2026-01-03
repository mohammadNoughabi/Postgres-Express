import express from 'express';
import authController from '../controllers/auth.controller.ts';

const authRouter = express.Router();

authRouter.post('/register', authController.registerControl);
authRouter.post('/login', authController.loginControl);
authRouter.post('/logout', authController.logoutControl);

export default authRouter;
