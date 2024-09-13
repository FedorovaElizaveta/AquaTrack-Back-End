import express from 'express';
import { ctrlWrapper } from '../utilts/ctrlWrapper.js';
import { getUserInfoController } from '../controllers/userInfo.js';

const router = express.Router();

router.get('/info', ctrlWrapper(getUserInfoController));

export default router;
