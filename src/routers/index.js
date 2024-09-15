import { Router } from 'express';
import authRouter from './auth.js';
import waterRouter from './water.js';
import authGoogleRouter from './authGoogleRouter.js';
// import confirmGoogleOauthRouter from './authGoogleConfirm.js';
const router = Router();

router.use('/users', authRouter);
router.use('/auth/google', authGoogleRouter);
router.use('/water', waterRouter);

export default router;
