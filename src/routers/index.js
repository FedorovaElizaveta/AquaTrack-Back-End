import { Router } from 'express';
import authRouter from './auth.js';
import waterRouter from './water.js';
import userInfoRouter from './userInfo.js';
// import { auth } from 'google-auth-library';
import { auth } from '../middlewares/auth.js';

const router = Router();

router.use('/users', authRouter);
router.use('/users', auth, userInfoRouter);
router.use('/water', waterRouter);

export default router;
