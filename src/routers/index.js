import { Router } from 'express';
import authRouter from './auth.js';
import waterRouter from './water.js';
import { swaggerDocs } from '../middlewares/swaggerDocs.js';

const router = Router();

router.use('/api-docs', swaggerDocs());
router.use('/users', authRouter);
router.use('/water', waterRouter);

export default router;
